import * as azdev from "azure-devops-node-api";
import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
require('dotenv').config({path: "environment/.env"})

export default class AzureConnector {

    private connection!: azdev.WebApi;
    private authHandler!: IRequestHandler;
    private baseURL!: string;

    constructor() {
        this.init();        
    }  

    getConnection(): azdev.WebApi {
        return this.connection || new azdev.WebApi(this.baseURL, this.authHandler);
    }

    private init(): void {
        this.baseURL = this.getURL();
        const token = this.getToken();
        this.authHandler = azdev.getPersonalAccessTokenHandler(token)
    }

    private getToken():string {
        return process.env.AZURE_TOKEN!;
    }

    private getURL(): string {
        return process.env.AZURE_COLLECTION_URL!;
    }
}



