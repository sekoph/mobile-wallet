import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { connectedAccounts, displayItem } from '../types/type'
import AnimateCountup from './AnimateCountup'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const DisplayItem = ({ name, currentBalance, appwriteItemID, type }:displayItem) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity className='my-1' onPress={() => navigation.navigate('Banks' as never, {appwriteItemID})}>
            <View className='flex rounded-lg p-2 bg-slate-500 '>
                <View className='flex-col'>
                    <View className='flex-row justify-between'>
                        <View className='rounded-full bg-white h-10 w-10 items-center justify-center'>
                            <FontAwesome name="bank" size={26} color="#020617" />
                        </View>
                        <Text className='text-xl font-bold text-slate-950'>{name}</Text>
                        <AnimateCountup amount={currentBalance} type="secondary"/>
                    </View>
                    <Text className='text-md font-extrabold text-slate-950 -mt-4 ml-16'>{type}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const ConnectedAccounts = ({accounts}:connectedAccounts) => {
  return (
    <View>
        <FlatList
            data={accounts}
            keyExtractor={(item) => item.id}
            renderItem={(item) => (
                <DisplayItem name={item.item.name} currentBalance={item.item.currentBalance} appwriteItemID={item.item.appwriteItemId} type={item.item.subtype}/>
            )}
        />
    </View>
  )
}

export default ConnectedAccounts