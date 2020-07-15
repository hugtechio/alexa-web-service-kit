import * as cdk from '@aws-cdk/core';
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
import ecr = require("@aws-cdk/aws-ecr")
import acm = require("@aws-cdk/aws-certificatemanager")
import route53 = require("@aws-cdk/aws-route53")
import config from './config.ts'

export class FargateAlexaCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const name = config.name
    const repo = ecr.Repository.fromRepositoryName(this, `${name}Ecr`, config.repository)
    const vpc = new ec2.Vpc(this, `${name}Vpc`, {
      maxAzs: 3
    });

    const certificate = acm.Certificate.fromCertificateArn(this, `${name}Acm`, config.acmArn)
    const cluster = new ecs.Cluster(this, `${name}Cl`, {
      vpc: vpc
    });

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, `${name}Hz`, {
      hostedZoneId: config.hostedZoneId,
      zoneName: config.zoneName
    })

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, `${name}Fargate`, {
      cluster: cluster,
      certificate: certificate,
      cpu: 512,
      desiredCount: 3,
      taskImageOptions: { image: ecs.ContainerImage.fromEcrRepository(repo) },
      memoryLimitMiB: 2048,
      publicLoadBalancer: true,
      domainName: config.domainName,
      domainZone: hostedZone,
    })
  }
}
