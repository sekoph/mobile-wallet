import { View, Text } from 'react-native'
import React from 'react'
import { CountUp } from 'use-count-up'

const AnimateCountup = ({amount,type} : {amount:number, type:string}) => {
  return (
    <Text className='text-3xl font-extrabold text-white'>
      $<CountUp
        isCounting={true}
        end={amount}
        start={0}
        decimalPlaces={2}
        decimalSeparator='.'
        thousandsSeparator=','
        duration={1.0}
        />
        </Text>
  )
}

export default AnimateCountup