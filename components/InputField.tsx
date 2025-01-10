import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Platform, Keyboard } from 'react-native'
import React from 'react'
import { InputFieldProps } from '../types/type'

const InputField = ({ label, labelStyle, icon, secureTextEntry = false, containerStyle, inputStyle, iconStyle, className, ...props}:InputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className='my-2 w-full'>
                <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
                    {label}
                </Text>
                <View className={`flex flex-row items-center relative justify-start rounded-full border border-neutral-100 bg-neutral-100 focus:border-primary-500 ${containerStyle}`}>
                    {icon && (
                        <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`}/>
                    )}
                    <TextInput
                        className={`rounded-full p-4 font-JakartaSemiBold flex-1 text-[15px] ${inputStyle} text-left`}
                        secureTextEntry={secureTextEntry}
                        {...props}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default InputField