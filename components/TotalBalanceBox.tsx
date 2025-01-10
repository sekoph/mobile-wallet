import {Text, View} from 'react-native';
import React from 'react';
import AnimateCountup from './AnimateCountup';
import {TotalBalanceBoxProps} from '../types/type';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
  user,
}: TotalBalanceBoxProps) => {
  return (
    <View className="flex rounded-lg border-2 p-3">
      <View className="flex-col relative space-y-6 h-56">
        <View className="flex-row justify-evenly rounded-lg bg-slate-800 p-4 h-48 mb-10 mt-4">
          <View className="flex-col items-center mt-4 p-4">
            <Text className="text-xl font-bold text-white trancate">
              Total Balance
            </Text>
            <View className="border-b-2"></View>
            <AnimateCountup amount={totalCurrentBalance} type="primary"/>
          </View>
          <View className="rounded-full border-4 border-white h-28 w-28 bg-slate-950 items-center justify-center">
            <Fontisto name="dollar" size={80} color="white" />
          </View>
        </View>
        <View className="rounded-lg bg-slate-300 flex-row justify-evenly absolute w-72 top-36 left-12">
          <View className="flex-col p-4">
            <View className="rounded-lg border-2 items-center justify-center w-24">
              <Text className="text-lg font-bold text-slate-950">Income</Text>
            </View>
            <View className="flex-row items-center justify-center">
              <AntDesign name="arrowdown" size={22} color="#14532d" />
              <Text className="text-lg font-bold text-green-900">$6078</Text>
            </View>
          </View>
          <View className="flex-col p-4">
            <View className="rounded-lg border-2 items-center justify-center w-24">
              <Text className="text-lg font-bold text-slate-950">Expense</Text>
            </View>
            <View className="flex-row items-center justify-center">
              <AntDesign name="arrowup" size={22} color="#991b1b" />
              <Text className="text-lg font-bold text-red-800">$8978</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TotalBalanceBox;
