#! bin/bash

set -x;

NAME=${1:-alexa-web-service}
REGION=${2:-us-east-1}
TAG=${3:-alexa-web-service-kit/alexa_fargate}

yarn run build
docker build -t ${TAG} .

ECR_URI=$(aws ecr create-repository --repository-name ${NAME} --region ${REGION} | \
    jq -r '.repository.repositoryUri')

ECR_URI=$(aws ecr describe-repositories | jq --arg s ${NAME} -r '.repositories | .[] | select(.repositoryName == $s) | .repositoryUri')

aws ecr get-login-password --region ${REGION} | \
    docker login --username AWS --password-stdin ${ECR_URI}

docker tag ${TAG}:latest ${ECR_URI}:latest
docker push ${ECR_URI}:latest