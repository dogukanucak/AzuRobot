import { WebApi } from "azure-devops-node-api"
import { ICoreApi } from "azure-devops-node-api/CoreApi";
import { TeamProjectReference, WebApiTeam} from "azure-devops-node-api/interfaces/CoreInterfaces";
import { IWorkItemTrackingApi } from "azure-devops-node-api/WorkItemTrackingApi";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { JsonPatchOperation, Operation } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { VpCodeReviewItem, WORK_ITEM_TYPES } from "../types/workItem.types";

export default class AzureHelper {
    private connection: WebApi;   
    private coreApi!: ICoreApi;
    private workItemTrackingApi!: IWorkItemTrackingApi;
    
    constructor(connection: WebApi) {
        this.connection = connection;  
    }

     /***********************************************/ 
    /*          WORK ITEMS INFO                */
    /***********************************************/    

    async getWorkItem(id:number): Promise<WorkItem> {
        if(!this.workItemTrackingApi) {
            this.workItemTrackingApi = await this.connection.getWorkItemTrackingApi();
        }
        return await this.workItemTrackingApi.getWorkItem(id);
    }

    async createWorkItem(operations: JsonPatchOperation[],projectName:string,workItemType: string) {
        if(!this.workItemTrackingApi) {
            this.workItemTrackingApi = await this.connection.getWorkItemTrackingApi();
        }        
       return await this.workItemTrackingApi.createWorkItem(null,operations,projectName,workItemType);
    }

    async createVpCodeReviewItem(itemProperties: VpCodeReviewItem,projectName:string,returnId:boolean): Promise<WorkItem | number> {
        const workItemType = WORK_ITEM_TYPES.VP_CODE_REVIEW;
        const operations: JsonPatchOperation[] = [];   
        operations.push({ op: Operation.Add, "path": "/fields/System.Title", "value": itemProperties.title });       
        operations.push({ op: Operation.Add, "path": "/fields/System.Description", "value": itemProperties.description});
        operations.push({ op: Operation.Add, "path": "/fields/System.AreaPath", "value": itemProperties.areaPath });
        operations.push({ op: Operation.Add, "path": "/fields/System.TeamProject", "value": itemProperties.teamProject });
        operations.push({ op: Operation.Add, "path": "/fields/System.IterationPath", "value": itemProperties.iterationPath});      
        operations.push({ op: Operation.Add, "path": "/fields/System.AssignedTo", "value": itemProperties.assignedTo});
        if(returnId) {
            return new Promise((resolve,reject) => {
                this.createWorkItem(operations,projectName,workItemType).then(response => resolve(response.id)).catch(error => reject(error));
            })
        } else {
            return await this.createWorkItem(operations,projectName,workItemType);
        }      
    }

    /***********************************************/ 
    /*             GET PROJECTS INFO                */
    /***********************************************/

    async getTeams(projectId:string): Promise<WebApiTeam[]> {
        if(!this.coreApi) {
            this.coreApi = await this.connection.getCoreApi();           
        }
        return await this.coreApi.getTeams(projectId,true);
    }

    async getTeam(projectId:string,teamId:string): Promise<WebApiTeam>  {
        if(!this.coreApi) {
            this.coreApi = await this.connection.getCoreApi();           
        }
        return await this.coreApi.getTeam(projectId,teamId);
    }

    async getProjects(): Promise<TeamProjectReference[]> {
        if(!this.coreApi) {
            this.coreApi = await this.connection.getCoreApi();           
        }
        return await this.coreApi.getProjects();
    }

    async getProjectById(id:string): Promise<TeamProjectReference | undefined> {
        const projects = await this.getProjects();
        const project = projects.find(projects => projects.id = id);
        return project;
    }

    async getProjectByName(name:string): Promise<TeamProjectReference | undefined> {
        const projects = await this.getProjects();
        const project = projects.find(projects => projects.name = name);
        return project;
    }

    async getProjectName(id:string): Promise<string | undefined> {
        const project = await this.getProjectById(id);
        return project?.name;
    }

    async getProjectId(name:string): Promise<string | undefined> {
        const project = await this.getProjectByName(name);
        return project?.id;
    }       
}