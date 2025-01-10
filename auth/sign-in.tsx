import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { icons, images } from "../constants";
import { GlobalContext } from "../context/GlobalProvider";
import { getCurrentUSer, onSignIn } from "../lib/action/userAction";
import { globalContextProps, RootParamList, User } from "../types/type";



type NavigationProps = StackNavigationProp<RootParamList, 'BottomTabs'>;

const SignIn = () => {
  

  const navigation = useNavigation<NavigationProps>()
  const [loading, setLoading ] =  useState(false);

  const {setIsLoggedIn, setUser} = useContext(GlobalContext) as globalContextProps;


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Fill in all user details");
      return;
    }

    setLoading(true);
    const email = form.email;
    const password = form.password;
    try {
      await onSignIn({ email, password });
      const response = await getCurrentUSer();
      if(!response) throw new Error('error getting current user',);

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
      setLoading(false);
    
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Sign in error", error.message);
      } else {
        Alert.alert("Sign in error", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex bg-white">
        <View className="w-full h-[200px]">
          <Image source={images.signImage} className="z-0 w-full h-[200px]" />
          <Text className="text-2xl text-black absolute bottom-5 left-5 font-JakartaSemiBold">
            Login
          </Text>
        </View>
        <View className="padding-5">
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
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />
        </View>
        <View
          className="mt-10 flex-row justify-center"
        >
          <Text className="text-lg text-center text-general-200">Don't have an account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
            <Text className="text-lg text-center text-primary-500">Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default SignIn;
