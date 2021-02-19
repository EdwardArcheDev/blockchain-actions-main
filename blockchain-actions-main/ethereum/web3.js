import Web3 from 'web3';
let web3;
// post 01/2020 - https://medium.com/@awantoch/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a
if (typeof window !== 'undefined' && window.ethereum) {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable();
} else {
  const provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/43cc01e6a7214eeda7ed8ca7e9d027dd');
  web3 = new Web3(provider);
}

export default web3;
