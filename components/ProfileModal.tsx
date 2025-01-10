import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {globalContextProps, User} from '../types/type';
import {GlobalContext} from '../context/GlobalProvider';
import { logOut } from '../lib/action/userAction';


const ProfileModal = () => {
  const {user, isLoggedIn,setIsLoggedIn} = useContext(GlobalContext) as globalContextProps;
  const [modalVisible, setModalVisible] = useState(false);
  const signOut = async () => {
    await logOut();
    setIsLoggedIn(false);
  };
  return (
    <>
      <Ionicons name="chatbox-outline" size={28} color="black" />
      <Ionicons name="notifications-outline" size={28} color="black" />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View className="items-center bg-gray-100 rounded-full border-2 w-8 h-8">
          <Text className="text-xl font-bold text-slate-950 text-center">
            {user?.firstName[0]}
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(!modalVisible)}>
          <View className="bg-transparent justify-start items-end">
            <TouchableWithoutFeedback>
              <View className="bg-white w-[50%] flex-auto h-[88%]">
                <View className="h-28 bg-slate-400 rounded-b-full relative">
                  <View className="bg-slate-800 rounded-full absolute top-20 left-[36%] h-16 w-16 justify-center items-center">
                    <View className="items-center justify-center">
                      <Text className="text-white font-extrabold text-5xl">{user?.firstName[0]}</Text>
                    </View>
                  </View>
                </View>
                <View className='p-4 mt-4 items-center justify-center'>
                        <Text className='text-slate-950 font-bold'>{`${user?.firstName} ${user?.lastName}`}</Text>
                        <View className='border w-24 mt-2 mb-2'/>
                        <Text className='text-slate-950 font-bold'>{user?.email}</Text>
                        <View className='border w-36 mt-2 mb-2'/>
                        <Text className='text-slate-950 font-bold'>{user?.city}</Text>
                        <View className='border w-20 mt-2 mb-2'/>
                        <Text className='text-slate-950 font-bold'>{user?.dateOfBirth}</Text>
                        <View className='border w-24 mt-2 mb-2'/>
                        <View className='mt-4 flex-row'>
                            <TouchableOpacity className=' justify-center items-center flex-row space-x-2' onPress={() =>signOut()}>
                                <Text className='text-sm font-bold text-slate-950'>Log Out</Text>
                                <AntDesign name="logout" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ProfileModal;
