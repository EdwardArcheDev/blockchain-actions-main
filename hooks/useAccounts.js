import { useEffect, useState } from 'react';
import web3 from '../ethereum/web3';
const useAccounts = () => {
  const [accounts, setAccounts] = useState(null);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setAccounts(await web3.eth.getAccounts());
      } catch (e) {
        console.log('something wrong when fetching accounts');
      }
    };
    fetchAccounts();
  }, []);

  return accounts;
};

export default useAccounts;
