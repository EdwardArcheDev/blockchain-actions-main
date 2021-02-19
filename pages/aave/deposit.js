import React, { useEffect, useState } from 'react';
import web3 from '../../ethereum/web3';
import useAccounts from '../../hooks/useAccounts';
import { useFormik } from 'formik';

import LendingPoolAddressesProviderABI from '../../ethereum/abis/LendingPoolAddressesProvider.json';
import LendingPoolABI from '../../ethereum/abis/LendingPool.json';
import ERC20ABI from '../../ethereum/abis/ERC20.json';

const ROPSTEN_DAI_RESERVE_ADDRESS = '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108';
const ROPSTEN_LENDING_POOL_ADDRESSES_PROVIDER_ADDRESS = '0x1c8756FD2B28e9426CDBDcC7E3c4d64fa9A54728';

const Desosit = () => {
  const [balance, setBalance] = useState(null);
  const [lendingPoolCoreAddress, setLendingPoolCoreAddress] = useState(null);
  const [lendingPoolContract, setLendingPoolContract] = useState(null);
  const referralCode = '0';

  const accounts = useAccounts();
  const daiContract = new web3.eth.Contract(ERC20ABI, ROPSTEN_DAI_RESERVE_ADDRESS);

  const lendingPoolAddressesProviderContract = new web3.eth.Contract(
    LendingPoolAddressesProviderABI,
    ROPSTEN_LENDING_POOL_ADDRESSES_PROVIDER_ADDRESS
  );

  useEffect(() => {
    const fetchLendingPoolAddress = async () => {
      try {
        setLendingPoolCoreAddress(await lendingPoolAddressesProviderContract.methods.getLendingPoolCore().call());
        const lendingPoolAddress = await lendingPoolAddressesProviderContract.methods.getLendingPool().call();
        setLendingPoolContract(new web3.eth.Contract(LendingPoolABI, lendingPoolAddress));
      } catch (e) {
        throw Error(`Error getting lendingPool address: ${e.message}`);
      }
    };
    fetchLendingPoolAddress();
  }, [lendingPoolCoreAddress]);

  const DepositForm = () => {
    const formik = useFormik({
      initialValues: {
        depositAmount: '',
      },
      onSubmit: async ({ depositAmount }) => {
        // alert(JSON.stringify(values, null, 2));
        try {
          if (accounts && accounts.length && lendingPoolCoreAddress) {
            const daiAmountinWei = web3.utils.toWei(depositAmount, 'ether').toString();
            await daiContract.methods.approve(lendingPoolCoreAddress, daiAmountinWei).send({ from: accounts[0] });
            await lendingPoolContract.methods
              .deposit(ROPSTEN_DAI_RESERVE_ADDRESS, daiAmountinWei, referralCode)
              .send({ from: accounts[0] });
          }
        } catch (e) {
          throw new Error('something wrong while submitting' + e.message);
        }
      },
    });
    return (
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor='depositAmount'>Amount to deposit</label>
        <input
          id='depositAmount'
          name='depositAmount'
          type='text'
          onChange={formik.handleChange}
          value={formik.values.depositAmount}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  };

  return (
    <div>
      <DepositForm />
    </div>
  );
};
export default Desosit;
