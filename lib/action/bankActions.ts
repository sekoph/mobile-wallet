import { Account, Bank, getAccountProps, getAccountsProps, getInstitutionProps, getTransactionProp, Transaction } from "../../types/type";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { getTransactionsByBankID } from "./transactions";
import { getBankByDocumentID, getUserBankAccount } from "./userAction"
import { CountryCode} from 'plaid';


// get multiple bank account info and totalbalance
export const getAccounts = async ({userID}:getAccountsProps) => {
    try {
        const banks = await getUserBankAccount({userID});
        if(!banks) throw new Error("no accounts");
        
        const accounts = await Promise.all(
            banks?.map(async (bank: Bank) => {

                // get account info from plaid
                const accountsResponse = await plaidClient.accountsGet({
                    client_id: process.env.PLAID_CLIENT_ID,
                    secret: process.env.PLAID_SECRET,
                    access_token: bank.accessToken,
                })
                const accountData = accountsResponse.data.accounts[0];

                const institution = await getInstitution({
                    institutionID: accountsResponse.data.item.institution_id!,
                })

                const account = {
                    id: accountData.account_id,
                    availableBalance: accountData.balances.available!,
                    currentBalance: accountData.balances.current!,
                    institutionId: institution.institution_id,
                    name: accountData.name,
                    officialName: accountData.official_name!,
                    mask: accountData.mask!,
                    type: accountData.type as string,
                    subtype: accountData.subtype! as string,
                    appwriteItemId: bank.$id!,
                    sharaebleId: bank.shareableId,
                };
                return account
            })
        );

        const totalBanks = accounts.length;
        const totalCurrentBalance = accounts.reduce((total, account) => {
            return total + account.currentBalance;
        },0)

        return parseStringify({data : accounts, totalBanks, totalCurrentBalance});
    } catch (error) {
        console.log("get multiple bank account info and totalbalance" , error);
    }
}


// get one bank account info using documentID passed as appwriteItemID

export const getAccount = async ({appwriteItemId} : getAccountProps) => {
    try {
        const bank = await getBankByDocumentID({documentID : appwriteItemId});

        // console.log(bank);
        

        const accountResponse = await plaidClient.accountsGet({
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
            access_token: bank.accessToken,
        })

        const accountData = accountResponse.data.accounts[0];

        // get transactions from appwrite
        const tranferTransactionsData = await getTransactionsByBankID({
            bankID : bank.$id,
        })

        const transferTransactions = await tranferTransactionsData.documents.map(
            (transferData: Transaction) => ({
                id: transferData.$id,
                name: transferData.name!,
                amount: transferData.amount!,
                date: transferData.$createdAt,
                paymentChannel: transferData.channel,
                category: transferData.category,
                type: transferData.senderBankId === bank.$id ? "debit" : "credit"
            })
        )

        const institution = await getInstitution({
            institutionID: accountResponse.data.item.institution_id!,
        })

        const transactions = await getTransaction({
            accessToken: bank?.accessToken,
        })

        if(!transactions) throw new Error;

        const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            institutionId: institution.institution_id,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.$id,
            shareableID: bank.shareableID,
        };

        // sorting from the most recent

        const allTransactions = [...transactions, ...transferTransactions].sort(
            (a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return parseStringify({data : account, transaction: allTransactions})
    } catch (error) {
        console.log('get one bank account info using documentID passed as appwriteItemID');
    }
}


// get  instutions from plaid
export const getInstitution = async ({
    institutionID
}: getInstitutionProps) => {
    try {
        const institutionResponse = await plaidClient.institutionsGetById({
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
            institution_id: institutionID,
            country_codes:[CountryCode.Us],
        });

        const institution = institutionResponse.data.institution;

        return parseStringify(institution);
    } catch (error) {
        console.log('Get instutions from plaid' , error);
        
    }
}


// get trasactions from plaid

export const getTransaction = async ({accessToken} : getTransactionProp) => {
    let hasMore = true;
    let transactions: any =[];

    try {
        while(hasMore) {
            const response = await plaidClient.transactionsSync({
                client_id: process.env.PLAID_CLIENT_ID,
                secret: process.env.PLAID_SECRET,
                access_token: accessToken,
            })

            const data = response.data;

            transactions = response.data.added.map((transaction) => ({
                id: transaction.transaction_id,
                name: transaction.name,
                paymentChannel: transaction.payment_channel,
                type: transaction.payment_channel,
                accountId: transaction.account_id,
                amount: transaction.amount,
                pending: transaction.pending,
                category: transaction.personal_finance_category ? transaction.personal_finance_category.primary : "",
                date: transaction.date,
                image: transaction.logo_url,
            }));
            hasMore = data.has_more;
        }

        return parseStringify(transactions);
    } catch (error) {
        console.log('get trasactions from plaid', error);
    }
}




