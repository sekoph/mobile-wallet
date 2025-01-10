import {View, Text, TouchableOpacity, StatusBar, Image, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalContext} from '../context/GlobalProvider';
import {globalContextProps} from '../types/type';
import Header from '../components/Header';
import TableData from '../components/TableData';
import { SelectList } from 'react-native-dropdown-select-list'
import BankCard from '../components/BankCard';
import ProfileModal from '../components/ProfileModal';

// type Account = {
//   id: string;
//   availableBalance: number;
//   currentBalance: number;
//   institutionId: string;
//   name: string;
//   officialName: string;
//   mask: string;
//   type: string;
//   subtype: string;
//   appwriteItemId: string;
//   shareableId: string;
// };

// type BanksData = {
//   data: Account[];
//   totalBanks: number;
//   totalCurrentBalance: number;
// };

const TransferHistory = () => {
  const {user ,accounts, bankLoading} = useContext(GlobalContext) as globalContextProps;
  const [loading, setLoading] = useState(false);

  // const [accounts, setAccounts] = useState<BanksData>({
  //   data: [],
  //   totalBanks: 0,
  //   totalCurrentBalance: 0,
  // });

  const accountsData = accounts?.data || []

  const [activeAppwriteId, setActiveAppwriteId] = useState<string>('');
  

  const fetchData = async () => {
    setLoading(true)
    try {
      
      setActiveAppwriteId(accountsData[0]?.appwriteItemId || '');
      setLoading(false)
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };


  const data = accountsData.map((a) => {
    return {key: a.appwriteItemId, value:a.name}
  })
  
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <ScrollView className="flex h-full bg-white">
      <View className='flex-row p-2 justify-between'>
        <View className=''>
          <Header
            type="history"
            title="My Transaction"
            subtext="Access and Manage your accounts effortlessly"
          />
        </View>
        <View className="flex-row justify-end items-center px-4 py-2">
        <ProfileModal />
        </View>
      </View>
     <View className='items-center mb-3'>
      <SelectList
          setSelected={(val:string) =>setActiveAppwriteId(val)}
          data={data}
          save="key"
          boxStyles={{ width:360}}
          searchicon={<FontAwesome name="search" size={12} color={'black'} />}
          placeholder='select bank'
          searchPlaceholder='search a bank'
          maxHeight={150}
          dropdownStyles={{ position:'absolute', top:'100%', zIndex:1, backgroundColor:'white'}}
        />
     </View>

      <BankCard appwriteItemId={activeAppwriteId}/>

      <View className='-mt-1'>
        <TableData appwriteItemId={activeAppwriteId}/>
      </View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </ScrollView>
  );
};

export default TransferHistory;
