import { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import { GlobalContext } from '../context/GlobalProvider';
import { createTransfer } from '../lib/action/dwollaAction';
import { createTransaction } from '../lib/action/transactions';
import {
  getBankByAccountID,
  getBankByDocumentID,
} from '../lib/action/userAction';
import { decryptId } from '../lib/utils';
import { globalContextProps } from '../types/type';
import { useNavigation } from '@react-navigation/native';
import ProfileModal from '../components/ProfileModal';

const Transaction = () => {
  const {user, isLoggedIn, accounts , bankLoading} = useContext(GlobalContext) as globalContextProps;
  // const {accounts, loading: bankLoading} = useBankAccounts();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: '',
    sharableId: '',
  });
  const [activeAppwriteId, setActiveAppwriteId] = useState('');

  const accountsData = accounts?.data || [];

  const data = accountsData.map(account => ({
    key: account.appwriteItemId,
    value: account.name,
  }));

  const submitForm = async () => {
    try {
      if(!form.amount || !form.amount || !form.email || form.sharableId || activeAppwriteId) throw new Error("fill all details")
      const receiverAccountID = decryptId(form.sharableId);
      const receiverBank = await getBankByAccountID({
        accountID: receiverAccountID,
      });
      const senderBank = await getBankByDocumentID({
        documentID: activeAppwriteId,
      });

      

      if (!receiverBank) throw new Error('Receiver bank not found');

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: form.amount,
      };

      const transfer = await createTransfer(transferParams);
      if (!transfer) throw new Error('Transfer failed');

      const transaction = {
        name: form.name,
        amount: form.amount,
        senderID: senderBank.userID.$id,
        senderBankID: senderBank.$id,
        receiverID: receiverBank.userID.$id,
        receiverBankID: receiverBank.$id,
        receiverEmail: form.email,
      };

      const results = await createTransaction(transaction);

      if(results){
        Alert.alert('Success','Sure with the Transaction', [
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () =>navigation.navigate('Transfer History' as never),
          }
        ])
      }


    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ScrollView>
      <View className="w-full">
        <View className="flex-row items-center justify-between p-8 bg-slate-700">
          <Header type="greeting" title="Payment Transfer" subtext="Details for your transactions" />
          <View className="flex-row items-center gap-2">
          <ProfileModal />
          </View>
        </View>

        <View className="p-4 flex flex-col justify-center gap-2 bg-slate-200">
          {/* Source Bank Picker */}
          <View className="border-b-2 border-gray-300 p-2 mb-4">
            <Text className="font-bold text-sm text-gray-700">Select Source Bank</Text>
            <Text className="text-gray-500">Select the bank you want to send funds from</Text>
            <SelectList
              setSelected={(val: string) => setActiveAppwriteId(val)}
              data={data}
              save="key"
              boxStyles={{
                width: '100%', 
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: 'white',
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 4,
              }}
              searchicon={<FontAwesome name="search" size={12} color="black" />}
              placeholder="Select bank"
              searchPlaceholder="Search a bank"
              // defaultOption={data.length > 0 ? { key: data[0].key, value: data[0].value } : null} // Set default selection
              maxHeight={150}
              dropdownStyles={{
                backgroundColor: 'white',
                zIndex: 999, // Ensure dropdown is visible
                position: 'relative', // Position relative for better visibility
              }}
            />
          </View>

          {/* Transfer Note */}
          <View className="border-b-2 border-gray-300 p-2 mb-4">
            <Text className="font-bold text-sm text-gray-700">Transfer Note (Optional)</Text>
            <View className="flex-row items-center relative justify-start rounded-lg border border-gray-300 bg-neutral-100 mt-2">
              <TextInput
                className="rounded-full p-4 font-JakartaSemiBold flex-1 text-[15px]"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />
            </View>
          </View>

          {/* Other Form Fields */}
          <View className="border-b-2 border-gray-300 p-2 mb-4">
            <Text className="font-bold text-sm text-gray-700">Recipient's Email Address</Text>
            <View className="flex-row items-center relative justify-start rounded-lg border border-gray-300 bg-neutral-100 mt-2">
              <TextInput
                className="rounded-full p-4 font-JakartaSemiBold flex-1 text-[15px]"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
              />
            </View>
          </View>

          <View className="border-b-2 border-gray-300 p-2 mb-4">
            <Text className="font-bold text-sm text-gray-700">Recipient's bank account number</Text>
            <View className="flex-row items-center relative justify-start rounded-lg border border-gray-300 bg-neutral-100 mt-2">
              <TextInput
                className="rounded-full p-4 font-JakartaSemiBold flex-1 text-[15px]"
                value={form.sharableId}
                onChangeText={(value) => setForm({ ...form, sharableId: value })}
              />
            </View>
          </View>

          <View className="p-2 mb-4">
            <Text className="font-bold text-sm text-gray-700">Enter Amount</Text>
            <View className="flex-row items-center relative justify-start rounded-lg border border-gray-300 bg-neutral-100 mt-2">
              <TextInput
                className="rounded-full p-4 font-JakartaSemiBold flex-1 text-[15px]"
                value={form.amount}
                onChangeText={(value) => setForm({ ...form, amount: value })}
              />
            </View>
          </View>

          <CustomButton title="Continue with the transfer" onPress={submitForm} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Transaction;
