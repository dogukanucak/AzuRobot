require('dotenv').config({path: "environment/.env"})
export const VC_PRODUCT_RIB_PROJECT: NonNullable<any> = {
    ID: process.env.VC_Product_Retail_ID,
    NAME: process.env.VC_PRODUCT_RETAIL_NAME,
    TEAMID: process.env.VC_PRODUCT_RETAIL_TEAM_ID
}