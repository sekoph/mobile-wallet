import { View, Text, FlatList, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { images } from '../constants'
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Account, bankCard } from '../types/type';
import { getAccount } from '../lib/action/bankActions';



const BankCard = ({ appwriteItemId}: bankCard) => {
  const [account, setAccount] = useState<Account>({
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
    shareableID:'',
  });


  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAccount({appwriteItemId});
      if (!response) throw new Error('no accounts');
      setAccount(response.data);
      setLoading(false)
    } catch (error) {
      Alert.alert("error", "no data")
    }finally{
      setLoading(false)
    }
  };
  

  useEffect(() => {
    if (appwriteItemId) {
      fetchData();
    }
  }, [appwriteItemId]);



  return (
    <View className="flex">
        {!loading  ? (
            <View
              className="flex-col rounded-md bg-slate-700 border-slate-800 p-2 mx-6 h-52"
            >
              <View className="flex-row items-center justify-between p-6 -mt-2">
                <View className="flex-col">
                  <Text className="text-2xl font-extrabold text-white">{account.name}</Text>
                  <Image source={images.card} className="h-8 w-14 mt-4" resizeMode="contain" />
                </View>
                <View className="flex-col">
                  <Text className="text-md font-bold text-green-600 p-2">Available balance</Text>
                  <View className="flex-row space-x-2">
                    <View className="rounded-full h-8 w-8 bg-slate-950 items-center justify-center">
                      <Fontisto name="dollar" size={20} color="white" />
                    </View>
                    <Text className="text-2xl font-bold text-white">{account.currentBalance}</Text>
                  </View>
                </View>
              </View>
              <View className="items-center justify-center -mt-3">
                <Text className="text-3xl font-extrabold text-white">●●●●● ●●●●● ●●●●●</Text>
              </View>
              <View className="flex-row items-center justify-between p-3 mx-4">
                <View className="items-center flex-row space-x-3">
                  <Text className="text-white font-semibold">Mask</Text>
                  <Text className="text-white">{account.mask}</Text>
                </View>
                <View className="items-center flex-row space-x-3">
                  <Text className="text-white font-semibold">Type</Text>
                  <Text className="text-white">{account.subtype}</Text>
                </View>
              </View>
            </View>
        ) : (
          <View>
            <ActivityIndicator size="large" color="blue"/>
          </View>
        )}
    </View>
  );
};

export default BankCard;
