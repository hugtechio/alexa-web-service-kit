# alexa-web-service-kit

The Alexa web service kit makes you deploy Backend infrastructure of Alexa Skill Kit as a Web Service easier.

# Requirements
docker
aws cli v2
aws cdk
jq

# preparation(mac os)
```
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
brew install jq
npm i aws-cdk -g

```
# Usage
deploy web service infra (AWS Fargate)
```
cd infrastructure
cdk deploy
```

deploy skill from ecr repository
```
cd skill
bash deploy.sh
```


