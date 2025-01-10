import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalProvider';
import { getAccounts } from '../action/bankActions';
import { BanksData, User } from '../../types/type';

const useBankAccounts = ({user,isLoggedIn}:{isLoggedIn: boolean,user:User | null}) => {
  const [accounts, setAccounts] = useState<BanksData>({
    data: [],
    totalBanks: 0,
    totalCurrentBalance: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await getAccounts({ userID: user.$id });
        setAccounts(response);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { accounts, loading };
};

export default useBankAccounts;
