import {TextInputProps, TouchableOpacityProps} from "react-native";
import { Models } from "appwrite";

declare type User = {
    $id: string;
    email: string;
    userId: string;
    dwollaCustomerUrl: string;
    dwollaCustomerId: string;
    firstName: string;
    lastName:string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    dateOfBirth: string;
    ssn: string;
};

type RootParamList = {
    BottomTabs: {
      screen: string;
    };
    Home: undefined;
    Banks : {
        appwriteItemID: string;
    }
    Welcome: undefined;
    SignIn: undefined;
    SignUp: undefined
  };

declare type Accounts ={
    id: string;
    availableBalance: number;
    currentBalance: number;
    institutionId: string;
    name: string;
    officialName: string;
    mask: string;
    type: string;
    subtype: string;
    appwriteItemId: string;
    shareableID: string;
}

declare type Account = {
    id: string;
    availableBalance: number;
    currentBalance: number;
    institutionId: string;
    name: string;
    officialName: string;
    mask: string;
    type: string;
    subtype: string;
    appwriteItemId: string;
    shareableID: string;
}

declare type Transaction = {
    id: string;
    $id: string;
    name: string;
    paymentChannel: string;
    type: string;
    accountId: string;
    amount: number;
    pending: boolean;
    category: string;
    date: string;
    image: string;
    type: string;
    $createdAt: string;
    channel: string;
    senderBankId: string;
    receiverBankId: string;
};

declare type SignInProps = {
    email:string,
    password:string
}

declare type SignUpProps = {
    email: string;
    firstName: string;
    lastName:string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    dateOfBirth: string;
    ssn: string;
    password: string;
}

declare type TransferParams = {
    sourceFundingSourceUrl: string;
    destinationFundingSourceUrl: string;
    amount: string;
};

declare type AddFundingSourceParams = {
    dwollaCustomerId: string;
    processorToken: string;
    bankName: string;
    BankType: "checking" | "savings";
};


declare type globalContextProps = {
    isLoggedIn:boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>;
    accounts?: BanksData;
    bankLoading?: boolean;
}

declare type Bank = {
    $id: string;
    accountId: string;
    bankId: string;
    accessToken: string;
    fundingSourceUrl: string;
    userId: string;
    shareableId: string;
};

declare type NewDwollaCustomerParams = {
    firstName: string;
    lastName: string;
    email: string;
    type: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    dateOfBirth: string;
    ssn: string;
};

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

declare interface headerProps {
    type:string,
    title:string,
    user?:User | null,
    subtext:string,
}

declare interface TotalBalanceBoxProps{
    accounts: Accounts[],
    totalBanks: number,
    totalCurrentBalance: number,
    user:User | null,
}

declare interface connectedAccounts{
    accounts: Accounts[],
}

declare interface bankCard{
    appwriteItemId: string,
}

declare interface displayItem{
    name: string;
    currentBalance: number;
    appwriteItemID: string;
    type: string;
}

declare interface doughnutProps{
    accounts: Accounts[],
}

declare interface exchangePublicTokenProps{
    publicToken: string,
}

declare interface CreateBankAccountProps {
    userID: string;
    bankID: string;
    accountID: string;
    accessToken: string;
    fundingSourceUrl: string;
    shareableID: string;
}


declare interface CreateFundingSourceOptions {
    customerId: string; // Dwolla Customer ID
    fundingSourceName: string; // Dwolla Funding Source Name
    plaidToken: string; // Plaid Account Processor Token
    _links: object; // Dwolla On Demand Authorization Link
    type: "checking" | "savings";
}


declare interface PlaidLinkProps {
    user: User;
}


declare interface getAccountDetailsProps {
    accessToken: string;
    itemId: string;
    user:User;
}

declare interface getAccountsProps{
    userID: string
}

declare interface getAccountProps {
    appwriteItemId: string
}

declare interface getInstitutionProps{
    institutionID: string
}

declare interface getTransactionProp{
    accessToken: string
}

declare interface getBankByDocumentIDProps{
    documentID: string
}


declare interface getBankByAccountIDProps{
    accountID: string
}


declare interface AccountsData {
    data: Account[];
    totalBanks: number;
    totalCurrentBalance: number;
}

declare interface searchParamsProps{
    route: {
        params: {
          id: string;
          page: number;
        };
      };
}

declare interface recentTransactionProps{
    accounts: Accounts[];
    appwriteItemId: string;
    page: number;
}

declare interface bankListProp{
    accounts: Accounts[];
}

declare interface getTransactionsByBankIdProps {
    bankID: string;
  }

  declare interface CreateTransactionProps {
    name: string;
    amount: string;
    senderID: string;
    senderBankID: string;
    receiverID: string;
    receiverBankID: string;
    receiverEmail: string;
  }

  type BanksData = {
    data: Account[];
    totalBanks: number;
    totalCurrentBalance: number;
  };

  interface TableDataProps {
    appwriteItemId: string;
    accountId?: string | '';
    status?: string;
    amount?: string | undefined;
  }

  type BankData<T, U> = {
    data: Account[];
    transaction: Transaction[];
  };