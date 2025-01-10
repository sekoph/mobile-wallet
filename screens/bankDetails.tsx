import {View, Text, ScrollView, Alert, TouchableOpacity} from 'react-native';
import React, {FC, useContext, useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import BankCard from '../components/BankCard';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Account,
  BankData,
  globalContextProps,
  RootParamList,
  Transaction,
} from '../types/type';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getAccount} from '../lib/action/bankActions';
// import Transaction from './transaction';
import {CountUp} from 'use-count-up';
import {encryptId, formatAmount, slicedAmount} from '../lib/utils';
import {GlobalContext} from '../context/GlobalProvider';
import Clipboard from '@react-native-clipboard/clipboard';

type BanksScreenRouteProp = RouteProp<RootParamList, 'Banks'>;
type BanksScreenNavigationProp = StackNavigationProp<RootParamList, 'Banks'>;

type Props = {
  route: BanksScreenRouteProp;
  navigation: BanksScreenNavigationProp;
};

const BankDetails: FC<Props> = ({route, navigation}) => {
  const {appwriteItemID} = route?.params;
  const {user, isLoggedIn} = useContext(GlobalContext) as globalContextProps;

  const [account, setAccount] = useState<BankData<Account, Transaction>>({
    data: [],
    transaction: [],
  });

  const [newAccount, setNewAccount] = useState<Account>({
    id: '',
    availableBalance: 0,
    currentBalance: 0,
    institutionId: '',
    name: '',
    officialName: '',
    mask: '',
    type: '',
    subtype: '',
    appwriteItemId: '',
    shareableID: '',
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAccount({appwriteItemId: appwriteItemID});
      if (!response) throw new Error('no accounts');
      setAccount(response);
      setNewAccount(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert('error', 'no data');
    } finally {
      setLoading(false);
    }
  };

  const transactions = account.transaction;

  const groupedTransactions = {
    debit: [] as typeof transactions,
    credit: [] as typeof transactions,
  };

  // Use forEach to group transactions by type
  transactions.forEach(transaction => {
    if (transaction.amount < 0) {
      groupedTransactions.debit.push(transaction);
    } else if (transaction.amount > 0) {
      groupedTransactions.credit.push(transaction);
    }
  });

  const expense = groupedTransactions.debit.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  const income = groupedTransactions.credit.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  const textToCopy = newAccount?.shareableID;
  const copyToClipboard = () => {
    Clipboard.setString(textToCopy);
  };

  useEffect(() => {
    if (appwriteItemID) {
      fetchData();
    }
  }, [appwriteItemID]);

  return (
    <ScrollView className="bg-white">
      <View className="mt-3 items-center justify-center w-full">
        <BankCard appwriteItemId={appwriteItemID} />
      </View>
      {!loading ? (
        <>
          <View className="items-center justify-center">
            <View className="rounded-lg bg-slate-300 flex-row justify-evenly  w-[350px] top-3">
              <View className="flex-col p-4 items-center">
                <View className="rounded-lg border-2 items-center justify-center w-24">
                  <Text className="text-lg font-bold text-slate-950">
                    Income
                  </Text>
                </View>
                <View className="flex-row items-center justify-center">
                  <AntDesign name="arrowdown" size={22} color="#14532d" />
                  <Text className="text-lg font-bold text-green-900">
                    $
                    <CountUp
                      isCounting={true}
                      end={income}
                      start={0}
                      decimalPlaces={2}
                      decimalSeparator="."
                      thousandsSeparator=","
                      duration={2.0}
                    />
                  </Text>
                </View>
              </View>
              <View className="flex-col p-4 items-center">
                <View className="rounded-lg border-2 items-center justify-center w-24">
                  <Text className="text-lg font-bold text-slate-950">
                    Expense
                  </Text>
                </View>
                <View className="flex-row items-center justify-center">
                  <AntDesign name="arrowup" size={22} color="#991b1b" />
                  <Text className="text-lg font-bold text-red-800">
                    $
                    <CountUp
                      isCounting={true}
                      end={expense}
                      start={0}
                      decimalPlaces={2}
                      decimalSeparator="."
                      thousandsSeparator=","
                      duration={1.0}
                    />
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="justify-center mt-6 items-center">
            <View className="w-[350px] bg-slate-200">
              <View className="p-2">
                <Text className="text-slate-950 font-semibold">
                  Account Name
                </Text>
                <Text className="text-slate-950 font-bold text-lg">
                  {newAccount.name}
                </Text>
                <View className="border-b-2" />
                <Text className="text-slate-950 font-semibold">Name</Text>
                <Text className="text-slate-950 font-bold text-lg">{`${user?.firstName} ${user?.lastName}`}</Text>
                <View className="border-b-2" />
                <Text className="text-slate-950 font-semibold">Status</Text>
                <Text className="text-green-700 font-bold text-lg">Active</Text>
                <View className="border-b-2" />
                <Text className="text-slate-950 font-semibold">Type</Text>
                <Text className="text-slate-950 font-bold text-lg">
                  {newAccount.subtype}
                </Text>
                <View className="border-b-2" />
                <View className="flex-row justify-between">
                  <Text className="text-slate-950 font-semibold">
                    Sharing ID
                  </Text>
                  <Ionicons name="copy" size={24} color="#020617" />
                </View>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Text className="text-slate-950 font-bold text-lg">
                    {encryptId(newAccount.shareableID)}
                  </Text>
                </TouchableOpacity>
                <View className="border-b-2" />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              className="flex-row items-center justify-center p-4 space-x-2">
              <AntDesign name="leftcircle" size={28} color="#020617" />
              <Text className="text-lg font-bold text-slate-950">Go Back</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex items-center justfiy-center">
          <Text className="text-xl font-bold text-slate-950">Loading...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default BankDetails;
