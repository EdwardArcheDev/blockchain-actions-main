import React, { useEffect, useState } from 'react';
import web3 from '../../ethereum/web3';
import useAccounts from '../../hooks/useAccounts';
import { useFormik } from 'formik';

import LendingPoolAddressesProviderABI from '../../ethereum/abis/LendingPoolAddressesProvider.json';
import LendingPoolABI from '../../ethereum/abis/LendingPool.json';

const ROPSTEN_DAI_RESERVE_ADDRESS = '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108';
const ROPSTEN_LENDING_POOL_ADDRESSES_PROVIDER_ADDRESS = '0x1c8756FD2B28e9426CDBDcC7E3c4d64fa9A54728';

const Desosit = () => {
  const [lendingPoolContract, setLendingPoolContract] = useState(null);

  const accounts = useAccounts();

  const lendingPoolAddressesProviderContract = new web3.eth.Contract(
    LendingPoolAddressesProviderABI,
    ROPSTEN_LENDING_POOL_ADDRESSES_PROVIDER_ADDRESS
  );

  useEffect(() => {
    const fetchLendingPoolAddress = async () => {
      try {
        const lendingPoolAddress = await lendingPoolAddressesProviderContract.methods.getLendingPool().call();
        setLendingPoolContract(new web3.eth.Contract(LendingPoolABI, lendingPoolAddress));
      } catch (e) {
        throw Error(`Error getting lendingPool address: ${e.message}`);
      }
    };
    fetchLendingPoolAddress();
  }, []);

  const DepositForm = () => {
    const formik = useFormik({
      initialValues: {
        depositAmount: '',
      },
      onSubmit: async ({ useAsCollateral }) => {
        try {
          if (accounts && accounts.length) {
            await lendingPoolContract.methods
              .setUserUseReserveAsCollateral(ROPSTEN_DAI_RESERVE_ADDRESS, useAsCollateral)
              .send({ from: accounts[0] });
          }
        } catch (e) {
          throw new Error('something wrong while submitting' + e.message);
        }
      },
    });
    return (
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor='useAsCollateral'>use As Collateral</label>
        <input
          id='useAsCollateral'
          name='useAsCollateral'
          type='checkbox'
          onChange={formik.handleChange}
          value={formik.values.useAsCollateral}
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
