# alexa-web-service-kit (infrastructure part) 

This is infrastructure part of Alexa web service kit.
Using AWS CDK

# configure
modify lib/config.ts

You need to prepare

- ACM Certificate
- hostedZone in Route53
- domain in the hostedZone

```javascript
export default {
    name: "your-service-name",
    repository: "your-ecr-repository",
    acmArn: 'ACM arn of service domain',
    hostedZoneId: 'Hosted zone of service domain',
    zoneName: 'hostedzone',
    domainName: 'domain of service'
}
```

# Usage

```
cdk deploy
```
