import React, { useCallback, useEffect, useState } from 'react';
import { createAccountDetails, createLinkToken, exchangePublicToken } from '../lib/action/userAction';
import { PlaidLinkProps } from '../types/type';
import { useNavigation } from '@react-navigation/native';
import {
  create,
  dismissLink,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
  LinkSuccess,
  open,
} from 'react-native-plaid-link-sdk';
import { Platform, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const PlaidLinkComponent = ({ user }: PlaidLinkProps) => {
  const navigation = useNavigation();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLinkCreated, setIsLinkCreated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

  // Fetch the link token
  const returnLinkToken = useCallback(async () => {
    try {
      setIsLoading(true); // Show loading
      const response = await createLinkToken(user);
      if (response) {
        setLinkToken(response.linkToken);
      }
    } catch (error) {
      console.error('Error fetching link token:', error);
      // Alert.alert('Error', 'Failed to fetch link token.');
    } finally {
      setIsLoading(false); // Hide loading
    }
  }, [user]);

  // Configure the Plaid link creation
  const createLinkTokenConfiguration = (token: string, noLoadingState: boolean = false) => ({
    token: token,
    noLoadingState: noLoadingState,
  });

  // Initialize the Plaid link
  useEffect(() => {linkToken
    const createPlaidLink = async () => {
      if (linkToken && !isLinkCreated) {
        try {
          const tokenConfiguration = createLinkTokenConfiguration(linkToken);
          await create(tokenConfiguration);
          // console.log(tokenConfiguration);
          
          setIsLinkCreated(true); // Set flag that link has been created
        } catch (error) {
          console.error('Error creating Plaid link:', error);
          // Alert.alert('Error', 'Failed to create Plaid link.');
        }
      } else if (!linkToken) {
        await returnLinkToken();
      }
    };

    createPlaidLink();
  }, [linkToken, isLinkCreated, returnLinkToken]);

  // Configure the open link props
  const createLinkOpenProps = () => ({
    onSuccess: async (success: LinkSuccess) => {
      try {
        const data = await exchangePublicToken({
          publicToken: success.publicToken,
        });

        if (data) {
          const addAccount = await createAccountDetails({
            accessToken: data.accessToken,
            itemId: data.itemId,
            user: user,
          });

          if (addAccount) {
            setLinkToken(null);
            setIsLinkCreated(false);
            navigation.navigate('Home' as never);
          } else {
            throw new Error('Failed to add account.');
          }
        }
      } catch (error) {
        console.error('Error in onSuccess:', error);
      }
    },
    onExit: (linkExit: LinkExit) => {
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  });

  // Handle link opening
  const handleOpenLink = () => {
    if (isLinkCreated) {
      const openProps = createLinkOpenProps();
      open(openProps);
    } else {
      console.error('Plaid Link is not yet created. Please try again.');
      Alert.alert('Plaid Link is not yet created. Please try again.');
    }
  };

  return (
    <>
      <TouchableOpacity className='flex-row items-center justify-center gap-1' onPress={handleOpenLink} disabled={isLoading}>
        <MaterialCommunityIcons name="bank-plus" size={34} color={isLoading ? 'gray' : 'white'} />
        <Text className='text-lg font-bold text-white'>Add Account</Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="small" color="blue" />}
    </>
  );
};

export default PlaidLinkComponent;
