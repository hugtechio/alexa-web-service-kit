#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FargateAlexaCdkStack } from '../lib/fargate_alexa_cdk-stack';

const app = new cdk.App();
new FargateAlexaCdkStack(app, 'FargateAlexaCdkStack');
