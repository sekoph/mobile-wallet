import { CommonActions, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext, useEffect, useState } from "react";
import { Alert, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { icons, images } from "../constants";
import { getCurrentUSer, onSignUp } from "../lib/action/userAction";
import { GlobalContext } from "../context/GlobalProvider";
import { globalContextProps, RootParamList, User } from "../types/type";


type NavigationProps = StackNavigationProp<RootParamList, 'BottomTabs'>;

const SignUp = () => {
  const navigation = useNavigation<NavigationProps>()

  const {setUser, setIsLoggedIn} = useContext(GlobalContext) as globalContextProps;
  const [isLoading, setIsLoading] = useState(false);


  const [form, setForm] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    ssn: "",
  });

  const onSignUpPress = async () => {
    setIsLoading(true);
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.address1 ||
      !form.city ||
      !form.state ||
      !form.postalCode ||
      !form.dateOfBirth ||
      !form.ssn
    ) {
      Alert.alert("fill in all the details");
    }
    try {
      const userData = {
        email:form.email!,
        firstName:form.firstName!,
        lastName:form.lastName!,
        address1: form.address1!,
        city: form.city!,
        state: form.state!,
        postalCode: form.postalCode!,
        dateOfBirth : form.dateOfBirth!,
        ssn : form.ssn!,
        password: form.password!,
  }
      const signUp = await onSignUp(userData);
      const response = await getCurrentUSer();
      if(!response) throw new Error('error getting current user');

      const user:User = {
        $id: response.$id || '',
        email: response.email || '',
        userId: response.userId || '',
        dwollaCustomerUrl: response.dwollaCustomerUrl || '',
        dwollaCustomerId: response.dwollaCustomerId || '',
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        address1: response.address1 || '',
        city: response.city || '',
        state: response.state || '',
        postalCode: response.postalCode || '',
        dateOfBirth: response.dateOfBirth || '',
        ssn: response.ssn || '',
      };

      setUser(user);
      setIsLoggedIn(true);
      navigation.navigate('BottomTabs', {screen: 'Home'});
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("sign error", error.message);
      } else {
        Alert.alert("sign error", "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex bg-white">
        <View className="relative w-full h-[200px]">
          <Image source={images.signImage} className="z-0 w-full h-[200px]" />
          <Text className="text-2xl text-black absolute bottom-5 left-5 font-JakartaSemiBold">
            Create Your Account
          </Text>
        </View>
        <View className="padding-5">
          <InputField
            label="firstName"
            placeholder="i.e Mark"
            icon={icons.person}
            value={form.firstName}
            onChangeText={(value: string) => setForm({ ...form, firstName: value })}
          />
          <InputField
            label="lastName"
            placeholder="i.e Juma"
            icon={icons.person}
            value={form.lastName}
            onChangeText={(value: string) => setForm({ ...form, lastName: value })}
          />
          <InputField
            label="Address"
            placeholder="Enter your address"
            // icon={icons.email}
            value={form.address1}
            onChangeText={(value: string) => setForm({ ...form, address1: value })}
          />
          <InputField
            label="City"
            placeholder="e.g New York"
            // icon={icons.city}
            value={form.city}
            onChangeText={(value:string) => setForm({ ...form, city: value })}
          />
          <InputField
            label="State"
            placeholder="e.g NY"
            // icon={icons.email}
            value={form.state}
            onChangeText={(value:string) => setForm({ ...form, state: value })}
          />
          <InputField
            label="Postal Code"
            placeholder="e.g 111-111"
            // icon={icons.email}
            value={form.postalCode}
            onChangeText={(value:string) => setForm({ ...form, postalCode: value })}
          />
          <InputField
            label="Date Of Birth"
            placeholder="yyyy-mm-dd"
            // icon={icons.dateOfBirth}
            value={form.dateOfBirth}
            onChangeText={(value:string) => setForm({ ...form, dateOfBirth: value })}
          />
          <InputField
            label="Social Security Number"
            placeholder="e.g 1111"
            // icon={icons.email}
            value={form.ssn}
            onChangeText={(value:string) => setForm({ ...form, ssn: value })}
          />
          <InputField
            label="Email"
            placeholder="Enter your Email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value:string) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your Password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value:string) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
        </View>
        <View
          className="justify-center mt-5 mb-5 flex-row"
        >
          <Text className="text-lg text-center text-general-200">Already Have an account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)}>
            <Text className="text-lg text-center text-primary-500">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </ScrollView>
  );
};

export default SignUp;
