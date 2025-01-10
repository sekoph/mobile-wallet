import { ID, Query } from "appwrite";
import { appwriteConfig, appwriteUtil } from "../appwrite";
import { parseStringify } from "../utils";
import { CreateTransactionProps, getTransactionsByBankIdProps } from "../../types/type";

export const createTransaction = async(transaction:CreateTransactionProps) => {
    try {
        const newTransaction = appwriteUtil.databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.transactionCollectionID,
            ID.unique(),
            {
            channel: "online",
            category: "Transfer",
            ...transaction,
            }
        )

        return parseStringify(newTransaction);
    } catch (error) {
        console.log(error);
        
    }
}

export const getTransactionsByBankID = async({bankID} : getTransactionsByBankIdProps) => {
    try {
        const senderInfo = await appwriteUtil.databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.transactionCollectionID,
            [Query.equal("senderBankID", bankID)]
        )

        const recieverInfo = await appwriteUtil.databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.transactionCollectionID,
            [Query.equal("receiverBankID", bankID)]
        )

        const transactions = {
            total: senderInfo.total + recieverInfo.total,
            documents: [...senderInfo.documents, ...recieverInfo.documents]
        }

        return parseStringify(transactions);
    } catch (error) {
        console.log(error);
        
    }
}