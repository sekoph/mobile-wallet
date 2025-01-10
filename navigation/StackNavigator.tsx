import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { StatusBar } from 'react-native';

import Home from '../screens/home';
import Profile from '../screens/profile';
import Transaction from '../screens/transaction';

import { NavigationContainer } from '@react-navigation/native';
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SignIn from '../auth/sign-in';
import SignUp from '../auth/sign-up';
import OnBoarding from '../auth/welcome';
import { GlobalContext } from '../context/GlobalProvider';
import TransferHistory from '../screens/history';
import { globalContextProps, RootParamList } from '../types/type';
import bankDetails from '../screens/bankDetails';



const StackNavigator = () => {
  const Stack = createNativeStackNavigator<RootParamList>();
  const Tab = createBottomTabNavigator();

  const { isLoggedIn } = useContext(GlobalContext) as globalContextProps;


  const BottomTabs = () => {
    return (
      <Tab.Navigator screenOptions={{
        tabBarStyle:{
          height:80,
        }
      }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarActiveTintColor: 'rgb(15 23 42)',
            tabBarIcon: ({focused}) => focused ? (
              <Ionicons name="home-outline" size={40} color="rgb(15 23 42)" />
            ) : (
              <Ionicons name="home-outline" size={34} color="#989898" />
            ),
          }}
        />
        <Tab.Screen
          name="Transfer"
          component={Transaction}
          options={{
            headerShown:false,
            tabBarActiveTintColor: 'rgb(15 23 42)',
            tabBarIcon: ({focused}) => focused ? (
              <MaterialCommunityIcons name="bank-transfer" size={40} color="rgb(15 23 42)" />
            ) : (
              <MaterialCommunityIcons name="bank-transfer" size={36} color="#989898" />
            ),
          }}
        />
        <Tab.Screen
          name="Transfer History"
          component={TransferHistory}
          options={{
            headerShown:false,
            tabBarActiveTintColor: 'rgb(15 23 42)',
            tabBarIcon: ({focused}) => focused ? (
              <FontAwesome name="history" size={40} color="rgb(15 23 42)" />
            ) : (
              <FontAwesome name="history" size={34} color="#989898" />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown:false,
            tabBarActiveTintColor: 'rgb(15 23 42)',
            tabBarIcon: ({focused}) => focused ? (
              <AntDesign name="profile" size={40} color="rgb(15 23 42)" />
            ) : (
              <AntDesign name="profile" size={34} color="#989898" />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name='Welcome' component={OnBoarding} options={{headerShown: false}}/>
          <Stack.Screen name='SignIn' component={SignIn} options={{headerShown: false}}/>
          <Stack.Screen name='SignUp' component={SignUp} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
  }

  const MainStack   = () => {
    return (
        <Stack.Navigator>
          <Stack.Screen
            name="BottomTabs"
            component={BottomTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Banks"
            component={bankDetails}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
    );
  };

  return (
      <NavigationContainer>
        { !isLoggedIn ? <AuthStack/> : <MainStack/> }
        <StatusBar backgroundColor="#334155" barStyle="light-content" />
      </NavigationContainer>
  );
};
export default StackNavigator;
