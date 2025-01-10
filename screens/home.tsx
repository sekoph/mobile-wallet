import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import TotalBalanceBox from '../components/TotalBalanceBox';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {GlobalContext} from '../context/GlobalProvider';
import {logOut} from '../lib/action/userAction';
import {globalContextProps} from '../types/type';
import ConnectedAccounts from '../components/ConnectedAccounts';
import PlaidLinkComponent from '../components/PlaidLinkComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileModal from '../components/ProfileModal';

type Account = {
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
  shareableId: string;
};

type Transaction = {
  accountId: string;
  amount: number;
  category: Category;
  date: string;
  id: string;
  name: string;
  image: string;
  paymentChannel: string;
  pending: boolean;
  type: string;
};

type Category = {
  primary: string;
};

type BankData<T, U> = {
  data: Account[];
  transaction: Transaction[];
};

const Home = () => {
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false)

  const {user, isLoggedIn, accounts , bankLoading} = useContext(GlobalContext) as globalContextProps;

  const [account, setAccount] = useState<BankData<Account, Transaction>>({
    data: [],
    transaction: [],
  });

  const accountsData = accounts?.data || [];

  const limitAccountdata = accountsData.slice(0,2);

  if (!accountsData) return;
  const appwriteItemId = accountsData[0]?.appwriteItemId;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: '#334155',
      },
      headerLeft: () => (
        <View className="ml-2">
          <Header
            type="greeting"
            title="Welcome, "
            user={user}
            subtext="Access and Manage your accounts effortlessly"
          />
        </View>
      ),
      headerRight: () => (
        <View className="flex-row items-center gap-1 mr-2">
            <ProfileModal />
        </View>
      ),
    });
  }, []);

  const renderModal = () => {
    return (
      <Modal visible={openModal} animationType='slide' transparent={true} className='items-center justify-center w-[90%]'>
          <View className='flex-1 bg-transparent absolute top-0 left-0 w-[100%] h-[100%] justify-end'>
            <View className='bg-slate-200 p-6 w-[100%] rounded-t-3xl'>
              <Text className='text-lg font-bold text-slate-950'>My Banks</Text>
              <ConnectedAccounts accounts={accountsData} />
              <View className='items-center justify-center mt-4'>
                <TouchableOpacity onPress={() => setOpenModal(false)} className='items-center justify-center w-[90%] rounded-lg bg-slate-950 h-10'>
                  <Text className='font-bold text-lg text-white'>Close</Text>
                </TouchableOpacity>
              </View>
              </View>
          </View>
      </Modal>
    )
  }

  return (
    <SafeAreaView className="h-full bg-slate-400">
      <View className="w-full">
        <View className={`flex bg-slate-700`}>
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks || 0}
            totalCurrentBalance={accounts?.totalCurrentBalance || 0}
            user={user}
          />
        </View>
        <View className="flex p-6 mt-2">
          <View className="flex-col">
            <View className="rounded-lg border-2 border-slate-600 p-2">
              <View className='flex-row justify-between'>
              <Text className="font-bold text-2xl text-slate-950">
                My Banks
              </Text>
              <TouchableOpacity onPress={()=>setOpenModal(true)} className='items-center justify-center'>
                <Text className='text-lg font-semibold text-green-900'>View All</Text>
              </TouchableOpacity>
              {renderModal()}
              </View>
              
              {!bankLoading ? (
                    <ConnectedAccounts accounts={limitAccountdata} />
              ):(
                <View className='flex-col items-center justify-center'>
                  <ActivityIndicator size="large" color="blue"/>
                  <Text className='text-black font-semibold text-lg'>Loading</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="flex-row justify-evenly -mt-3">
          <View className="rounded-lg border-2 items-center justify-center w-40 bg-slate-950 h-14">
            {user && <PlaidLinkComponent user={user} />}
          </View>
          <TouchableOpacity onPress={() =>navigation.navigate('Transfer' as never)} className="flex-row rounded-lg border-2 items-center justify-center w-40 bg-slate-950 h-14">
            <MaterialCommunityIcons
              name="bank-transfer"
              size={36}
              color="white"
            />
            <Text className="text-lg font-bold text-white">Send Money</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Home;
