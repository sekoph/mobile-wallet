import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Swiper from "react-native-swiper";

import { onboarding } from "../constants";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const OnBoarding = () => {
  const navigation = useNavigation();
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);


  const isLastSlide = activeIndex === onboarding.length - 1;


  return (
    <SafeAreaView className="flex h-full items-center justify-center bg-white">
      <TouchableOpacity
        onPress={() => navigation.navigate("SignIn" as never)}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">skip</Text>
      </TouchableOpacity>
      
      <Swiper
        ref={swiperRef}
        loop={false}
        scrollEnabled={true}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-slate-950 rounded-full" />
        }

        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image source={item.image} className="w-full h-[300px] rounded-full" />
            <View className="flex flex-row items-center justify-center">
              <Text className="text-black text-3xl font-bold mx-10 text-center">{item.title}</Text>
            </View>
            <Text className="text-lg font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">{item.descriptions}</Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next" }
        onPress={() => isLastSlide ? navigation.navigate("SignIn" as never) : swiperRef.current?.scrollBy(1)

        }
        className="w-11/12 mt-2 mb-10"
      />
    </SafeAreaView>
  );
};

export default OnBoarding;
