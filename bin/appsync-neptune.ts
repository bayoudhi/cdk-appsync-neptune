#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppsyncNeptuneStack } from '../lib/appsync-neptune-stack';
import { App, Environment } from "aws-cdk-lib";

const app = new App();
new AppsyncNeptuneStack(app, 'NewAppsyncNeptuneStack');
