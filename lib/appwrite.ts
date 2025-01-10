import { Account, Client, Databases } from "appwrite";


export const appwriteConfig = {
    endPoint: process.env.REACT_NATIVE_APPWRITE_ENDPOINT!,
    platform: process.env.REACT_NATIVE_APPWRITE_PLATFORM!,
    projectID: process.env.REACT_NATIVE_APPWRITE_PROJECT_ID!,
    databaseID: process.env.REACT_NATIVE_APPWRITE_DATABASE_ID!,
    userCollectionID: process.env.REACT_NATIVE_APPWRITE_USER_COLLECTION_ID!,
    bankCollectionID:process.env.REACT_NATIVE_APPWRITE_BANKS_COLLECTION_ID!,
    transactionCollectionID:process.env.REACT_NATIVE_APPWRITE_TRANSACTION_COLLECTION_ID!,
};


const client = new Client();

client
    .setEndpoint(appwriteConfig.endPoint)
    .setProject(appwriteConfig.projectID)
;


const account = new Account(client);
const databases = new Databases(client);


export const appwriteUtil = {
    account,
    databases,
}
