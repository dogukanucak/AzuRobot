export const WORK_ITEM_TYPES = {
    VP_CODE_REVIEW: "VP Code Review"
}

export type VpCodeReviewItem = {
    title:string,
    description:string,
    assignedTo: string,
    workItemType: string,
    areaPath:string,
    teamProject: string,
    iterationPath: string
}