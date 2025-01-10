import { parseStringify } from './../utils';
import {data} from './../../constants/index';
import {appwriteConfig, appwriteUtil} from '../appwrite';
import {Query, ID} from 'appwrite';
import {
  CreateBankAccountProps,
  exchangePublicTokenProps,
  getAccountDetailsProps,
  getAccountsProps,
  getBankByAccountIDProps,
  getBankByDocumentIDProps,
  SignInProps,
  SignUpProps,
  User,
} from '../../types/type';
import {plaidClient} from '../plaid';
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';
import {encryptId, extractCustomerIdFromUrl} from '../utils';
import {addFundingSource, createDwollaCustomer} from './dwollaAction';

export const onSignUp = async (form: SignUpProps) => {
  const {email, password, firstName, lastName} = form;
  let newAccount;

  try {
    const newAccount = await appwriteUtil.account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );
    if (!newAccount) throw new Error('error creating new user account');

    await onSignIn({email, password});

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...form,
      type: 'personal',
    });

    if (!dwollaCustomerUrl) throw new Error('error creating dwolla customer');

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const userData = {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      address1: form.address1,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      dateOfBirth: form.dateOfBirth,
      ssn: form.ssn,
    };

    const newUser = await appwriteUtil.databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionID,
      ID.unique(),
      {
        ...userData,
        userId: newAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      },
    );

    return newUser;
  } catch (error) {
    console.log('onsignUp error', error);
  }
};

export const onSignIn = async ({email, password}: SignInProps) => {
  try {
    const userSession = await appwriteUtil.account.createEmailPasswordSession(
      email,
      password,
    );
    return userSession;
  } catch (error) {
    console.log('onSignIN error', error);
  }
};

export const logOut = async () => {
  try {
    const endSession = await appwriteUtil.account.deleteSession('current');
    return endSession;
  } catch (error) {
    console.log('LogOut Error', error);
  }
};

export const getCurrentUSer = async () => {
  try {
    const currentAccount = await appwriteUtil.account.get();

    if (!currentAccount) throw Error('no account in session');

    const currentUser = await appwriteUtil.databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionID,
      [Query.equal('userId', currentAccount.$id)],
    );

    // if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    // console.log("get current user error" , error)
    // // return null;
    if (error instanceof Error) {
      console.log(error);
      
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
  
};


export const createLinkToken = async (user: User) => {
  const userId = user.$id;
  const name = `${user.firstName} ${user.lastName}`;
  try {
    const response = await plaidClient.linkTokenCreate({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      user: {
        client_user_id: userId,
      },
      client_name: name,
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: 'en',
      android_package_name: 'com.sekoph.hb',
    });
    if (response.data.link_token) {
      // console.log("tesss", response.data.link_token);
    }
    return ({linkToken: response.data.link_token});
  } catch (error: unknown) {
    console.log("create link token error" , error);
    // if (error instanceof Error) {
    //   console.log(error);
      
    //   console.error(
    //     'Create Link Token Error:',
    //     error.response ? error.response.data : error.message,
    //   );
    // } else {
    //   console.error('An unknown error occurred');
    // }
    // throw error;
  }
};

export const exchangePublicToken = async ({
  publicToken
}: exchangePublicTokenProps) => {
  try {
    // exchange public token for item id and access token
    const response = await plaidClient.itemPublicTokenExchange({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      public_token: publicToken,
    });

    if(!response) throw new Error('error exchanging public token');
    // get access token and item id
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    console.log("exchange public token", accessToken, itemId);

    return ({accessToken, itemId});
  } catch (error) {
    // console.log('Error details:', error.response?.data || error.message || error);
    console.log(error);
    
  }
};


export const createAccountDetails = async ({
  accessToken,
  itemId,
  user}:getAccountDetailsProps) => {
  try {

    // get account details
    const accountsResponse = await plaidClient.accountsGet({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];
    console.log("account data", accountData);
    

    // create a processor token for Dwolla using the access token and accountData_id

    const request: ProcessorTokenCreateRequest = {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    console.log("processor token request", request);
    

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request,
    );

    const processorToken = processorTokenResponse.data.processor_token;

    // create a funding source Url for the account using Dwolla customer id,processor token and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
      BankType:accountData.type,
    });
    

    if (!fundingSourceUrl) throw new Error("error creating url")


    console.log({
      accessToken,
      itemId,
      accountId: accountData.account_id,
      fundingSourceUrl,
      shareableID: encryptId(accountData.account_id)
    });
    
    console.log('Appwrite config:', appwriteConfig);

    // create a bank account for appwrite database
    // using the user Id, Item ID, account ID, accessToken, fundingsource, shareableID
    await createBankAccount({
      userID: user.$id,
      bankID: itemId,
      accountID: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableID: encryptId(accountData.account_id),
    });

    // revalidate path to reflect the changes
    console.log("create bank account");
    
    return ("Success")

  } catch(error : unknown){
    // if (error instanceof Error) {
    //   console.log(error);
      
    //   console.error(
    //     'create account:',
    //     error.response ? error.response.data : error.message,
    //   );
    // } else {
      console.error('An unknown error occurred', error);
    // }
    // throw error;
  }
};

export const createBankAccount = async ({
  userID,
  bankID,
  accountID,
  accessToken,
  fundingSourceUrl,
  shareableID,
}: CreateBankAccountProps) => {
  try {
    const bankAccount = await appwriteUtil.databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.bankCollectionID,
      ID.unique(),
      {
        userID,
        bankID,
        accountID,
        accessToken,
        fundingSourceUrl,
        shareableID,
      },
    );
    return bankAccount;
  } catch (error) {
    console.log('error while creating bank account', error);
    console.error('Error creating bank account', error);
  }
};

// get user bank account using the user id

export const getUserBankAccount = async({userID} : getAccountsProps) => {
  try {
    const bank = await appwriteUtil.databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.bankCollectionID,
      [Query.equal('userID', userID)]
    )
  
    return parseStringify(bank.documents);
  } catch (error) {
    console.log("get user bank account error", error);
    
  }
}

// get a specific bank account using documentId

export const getBankByDocumentID = async({documentID} : getBankByDocumentIDProps) => {
  try {
    const bank_account = await appwriteUtil.databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.bankCollectionID,
      [Query.equal('$id', documentID)]
    )
    if(bank_account.total !== 1) return null;
    return parseStringify(bank_account.documents[0]);
  } catch (error) {
    console.log('get accounts using document id error' ,  error);
  }
}

// get bank account using account ID
export const getBankByAccountID = async({accountID} : getBankByAccountIDProps) => {
  try {
    const bank = await appwriteUtil.databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.bankCollectionID,
      [Query.equal('accountID', accountID)]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log('get account by accountId error' , error);
  }
}
