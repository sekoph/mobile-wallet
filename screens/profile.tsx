import {View, Text, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {GlobalContext} from '../context/GlobalProvider';
import {globalContextProps} from '../types/type';
import {logOut} from '../lib/action/userAction';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Profile = () => {
  const {user, isLoggedIn, setIsLoggedIn} = useContext(
    GlobalContext,
  ) as globalContextProps;
  const signOut = async () => {
    await logOut();
    setIsLoggedIn(false);
  };
  return (
    <View className="bg-white flex-auto h-[88%]">
      <View className="h-[36%] bg-slate-400 rounded-b-full relative">
        <View className="bg-slate-800 rounded-full absolute top-44 left-[41%] h-20 w-20 justify-center items-center">
          <View className="items-center justify-center">
            <Text className="text-white font-extrabold text-5xl">
              {user?.firstName[0]}
            </Text>
          </View>
        </View>
      </View>
      <View className="p-4 mt-8 items-center justify-center">
        <Text className="text-slate-950 font-bold text-lg">{`${user?.firstName} ${user?.lastName}`}</Text>
        <View className="border w-32 mt-2 mb-2" />
        <Text className="text-slate-950 font-bold">{user?.email}</Text>
        <View className="border w-36 mt-2 mb-2" />
        <Text className="text-slate-950 font-bold">{user?.city}</Text>
        <View className="border w-20 mt-2 mb-2" />
        <Text className="text-slate-950 font-bold">{user?.dateOfBirth}</Text>
        <View className="border w-24 mt-2 mb-2" />
        <View className="mt-4 flex-row">
          <TouchableOpacity
            className=" justify-center items-center flex-row space-x-2"
            onPress={() => signOut()}>
            <Text className="text-sm font-bold text-slate-950">Log Out</Text>
            <AntDesign name="logout" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
