import React, {useEffect, useState} from 'react';
import {Modal, Text, View, Button, Image, Alert} from 'react-native';
import {DataTable} from 'react-native-paper';
import {getAccount} from '../lib/action/bankActions';
import {
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from '../lib/utils';
import { Account, BankData, TableDataProps, Transaction } from '../types/type';



const TableData = ({appwriteItemId, accountId = ''}: TableDataProps) => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0);
  const [modalVisible, setModalVisible] = useState<{
    visible: boolean;
    transaction?: Transaction;
    status?: string;
    amount?: string | undefined;
  }>({visible: false});
  const [account, setAccount] = useState<BankData<Account, Transaction>>({
    data: [],
    transaction: [],
  });

  const tableHeads = ['Transaction', 'Amount', 'Show More'];

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getAccount({appwriteItemId});
    if (!response) throw new Error('no accounts');
    setAccount(response);
    setLoading(false)
    } catch (error) {
      Alert.alert("error","no data fetched" )
    }finally{
      setLoading(false)
    }
    
  };

  const transactions = account.transaction;
  const itemsPerPage = 5;
  const totalItems = transactions.length;
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, totalItems);

  useEffect(() => {
    if (appwriteItemId) {
      fetchData();
    }
  }, [appwriteItemId]);

  return (
      <View className='items-center justify-center'>
        {!loading ? (
          <DataTable className="p-6">
          <DataTable.Header className="bg-slate-700">
            {tableHeads.map((head, index) => (
              <DataTable.Title key={index} className="bg-slate-700 pl-3 justify-evenly">
                <Text className="font-extrabold text-sm text-white">{head}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>
          {transactions.slice(from, to).map((transaction, index) => {
            const status = getTransactionStatus(new Date(transaction.date));
            const amountChecker = transaction.amount ?? '0';
            const amount = formatAmount(amountChecker);
            const isDebit = transaction.type === 'debit';
            const isCredit = transaction.type === 'credit';
            return (
              <DataTable.Row
                key={index}
                className={`${
                  isDebit || amount[0] === '-' ? 'bg-[#fffbfa]' : 'bg-[#f6fef9]'
                } over:bg-none border-b-0 items-center justify-evenly`}>
                <DataTable.Cell className="max-w-[250px] items-center justify-right flex ">
                  <Text className="font-semibold text-zinc-700">
                    {removeSpecialCharacters(transaction.name)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell className={`items-center justify-center`}>
                  <Text
                    className={`${
                      isDebit || amount[0] === '-'
                        ? 'text-[#f04439]'
                        : 'text-[#039855]'
                    }`}>
                    {isDebit ? `-${amount}` : isCredit ? amount : amount}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell className='items-center justify-center'>
                  <Button
                    onPress={() => setModalVisible({visible: true, transaction, status, amount:amount })}
                    title="View"
                    color='#334155'
                  />
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(totalItems / itemsPerPage)}
            onPageChange={page => setPage(page)}
            label={`${from + 1}-${to} of ${totalItems}`}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
    
          {/* Modal for viewing transaction details */}
          {modalVisible.transaction && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible.visible}
              onRequestClose={() => setModalVisible({visible: false})}>
              <View className="bg-slate-200 flex rounded-lg border border-l-zinc-600 w-11/12 ml-4 mt-19 mb-20">
                <View className="bg-slate-700 p-4">
                  <View className="flex justify-center items-center p-2">
                    <Text className="text-lg font-extrabold text-white">
                      Transaction Report
                    </Text>
                  </View>
                  <View className="flex-row items-center p-1">
                      <View className='rounded-lg bg-white border-2 border-gray-300 p-1'>
                      <Image source={{uri: modalVisible.transaction.image}} className='h-[35px] w-[35px]' resizeMode='contain' alt='image'/>
                      </View>
                      <Text className="text-lg font-bold text-gray-900 ml-3">
                        {modalVisible.transaction.name}
                      </Text>
                    </View>
                </View>
                <View className="bg-slate-200 p-4 ">
                  <View className="flex-column justify-center">
                    
                    <View className="flex-row justify-between p-2 border-b-2">
                      <Text className={`text-lg font-semibold text-gray-900`}>
                        Amount:
                      </Text>
                      <Text
                        className={`text-lg mr-4 font-semibold ${
                          modalVisible.transaction.amount < 0
                            ? 'text-red-500'
                            : 'text-green-500'
                        }`}>
                        {modalVisible.transaction.amount < 0
                          ? `- $${Math.abs(modalVisible.transaction.amount)}`
                          : `+ $${modalVisible.transaction.amount}`}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b-2 p-3">
                      <Text className="text-lg font-semibold text-gray-900">
                        Date:
                      </Text>
                      <Text className="text-lg font-semibold text-gray-900">
                      {formatDateTime(new Date(modalVisible.transaction.date)).dateTime}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b-2 p-3">
                      <Text className="text-lg font-semibold text-gray-900">
                      Type:
                      </Text>
                      <Text className="text-lg font-semibold text-gray-900">
                      {modalVisible.transaction.type}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b-2 p-3">
                      <Text className="text-lg font-semibold text-gray-900">
                      Category: 
                      </Text>
                      <Text className="text-lg font-semibold text-gray-900">
                      {String(modalVisible.transaction.category)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b-2 p-3">
                      <Text className="text-lg font-semibold text-gray-900">
                      Status: 
                      </Text>
                      <Text className={`font-extrabold ${
                      modalVisible.transaction.type === 'debit' || modalVisible.amount[0] === '-'
                        ? 'text-[#f04439]'
                        : 'text-[#039855]'
                    }`}>
                      {modalVisible.status}
                      </Text>
                    </View>
                  </View>
                  <Button
                    onPress={() => setModalVisible({visible: false})}
                    title="Close"
                    color='#334155'
                  />
                </View>
              </View>
            </Modal>
          )}
        </DataTable>
        ):
        (
          <Text className='text-black font-semibold text-lg'>Loading</Text>
        )
        }
      </View>
  );
};

export default TableData;
