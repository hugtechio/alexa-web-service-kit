import axios from 'axios'
import crypto from 'crypto'
import forge from 'node-forge'
import { Verifier, } from 'ask-sdk-express-adapter'
import { IncomingHttpHeaders } from 'http'

const verifier: Verifier = {
  verify: verifyRequest
}

async function verifyRequest (requestEnvelope: string, headers?: IncomingHttpHeaders): Promise<void | string> {
    try {
      if (!headers) {
        return '[Error] Null headers'
      }

      // Step1: Verify Signature Certificate Chain Url has specific format.
      const regex = /https:\/\/s3\.amazonaws\.com(:443)*\/echo\.api\/(\.\.\/echo\.api\/)*echo-api-cert(-[0-9]*)\.pem/
      // @ts-ignore
      const isMatch = regex.test(headers.SignatureCertChainUrl)
      if (!isMatch) {
        return ''
      }
  
      // Step2: Download Certificate
      // @ts-ignore
      const pem = await axios.get(headers.SignatureCertChainUrl)
  
      // Step3: Check Certificate timestamp
      const pki = forge.pki
      const cert = pki.certificateFromPem(pem.data)
      cert.validity.notBefore
      const now = new Date().getTime()
      if (now < new Date(cert.validity.notBefore).getTime() || now > new Date(cert.validity.notAfter).getTime()) {
        return 'certificate expired' 
      }
  
      // Step4: Check SANS has specific name
      const sans = cert.getExtension('subjectAltName')
      // @ts-ignore
      if (!sans['altNames'].find((i):boolean => i.value === 'echo-api.amazon.com')) {
        return 'invalid subject alternative name' 
      }
  
      // Step5: Check all Certificate exactly combine all together
      const regex2 = /(-----BEGIN CERTIFICATE-----[^-]+-----END CERTIFICATE-----)/g
      const match = pem.data.match(regex2)
  
      let i = 0
      let validateChain = []
      for(i = 0; i < match.length-1; i++) {
        const c1 = pki.certificateFromPem(match[i])
        const c2 = pki.certificateFromPem(match[i+1])
        // @ts-ignore
        const result = c1.issuer.attributes.every(c1Item => {
          // @ts-ignore
          const r = c2.subject.attributes.find(c2Item => {
            return (c2Item.type === c1Item.type)
              && (c2Item.value === c1Item.value)
              && (c2Item.valueTagClass === c1Item.valueTagClass)
              && (c2Item.name === c1Item.name)
              && (c2Item.shortName === c1Item.shortName)
          })
          return r !== null
        })
        validateChain.push(result)
      }
      if (!validateChain.every(i => i === true)) {
        return 'No suitable chain' 
      }
  
      // Step6: Check to match hashes of Signature and body
      const verifier = crypto.createVerify('RSA-SHA1');
      verifier.update(requestEnvelope, 'utf8')
      // @ts-ignore
      if (!verifier.verify(pem.data, headers.Signature, 'base64')) {
        return 'hash mismatch' 
      }
  
      // Step7: Check time limit of each request
      const body = JSON.parse(requestEnvelope)
      if (new Date(body.request.timestamp).getTime() + 150 * 1000 < new Date().getTime() ) {
        return 'request timed out' 
      }
      return
    } catch (e) {
      return e.toString()
    }
  }

  export default verifier