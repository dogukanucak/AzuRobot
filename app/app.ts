import express = require('express');
import AzureConnector from './azure/azureconnector';
import AzureHelper from './azure/azurehelper';
import { VC_PRODUCT_RIB_PROJECT } from './constants/azureConstants';
import { TeamContext } from 'azure-devops-node-api/interfaces/CoreInterfaces';

// Create a new express application instance
const app: express.Application = express();

const connector = new AzureConnector();
const connection = connector.getConnection();

const helper = new AzureHelper(connection);
// helper.createWorkItem().then(response => {
//   console.log("RES:",response);
// }).catch(error => {
//   console.log("ERR:",error);
// })





