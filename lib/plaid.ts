
// import dotenv from "dotenv";
import { Configuration, PlaidApi, PlaidEnvironments, Products } from 'plaid';

// dotenv.config();

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
})



export const plaidClient:PlaidApi = new PlaidApi(configuration);



