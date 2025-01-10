import { View, Text, Image } from 'react-native'
import React from 'react'
import { headerProps } from '../types/type'
import { icons } from '../constants'

const Header = ({type="Title",title,subtext,user}:headerProps) => {
  return (
    <View className='flex-col'>
      <View className='flex-row'>
      <Image source={icons.logo} resizeMode='contain' className='w-7 h-7'/>
        {type === 'greeting' && (
            <Text className='text-white text-lg font-semibold ml-2'>
              {title}
            </Text>
        )}
            {type === 'greeting' ? (
                <Text className="text-lg text-slate-950 font-extrabold text-center">&nbsp;{user?.firstName}</Text>
            ): (
              <Text className='text-slate-950 text-lg font-semibold ml-2'>{title}</Text>
            )}
      </View>
      {type === 'greeting' ? (
        <Text className='text-sm font-bold text-white'>{subtext}</Text>
      ): (
        <Text className='text-sm font-extrabold text-slate-950'>{subtext}</Text>
      )}
    </View>

  )
}

export default Header