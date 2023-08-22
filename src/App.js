import { useState, useEffect} from 'react';
import { ethers } from "ethers";
import { contractABI, contractAddress } from './Constant/constant';
import Login from "./Components/Login";
import Connected from './Components/Connected';

import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [voted, setVoted] = useState(true);

  useEffect( () => {
    getCandidates();
    getCurrentStatus();
    getRemainingTime();
    if(window.ethereum){
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () =>{
      if(window.ethereum){
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  })

  function handleAccountsChanged(accounts){
    if(accounts.length > 0 && account !== accounts[0]){
      setAccount(accounts[0]);
      canVote();
    }else{
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function getCurrentStatus(){
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
    const status = await contractInstance.getVotingStatus();

    setVotingStatus(status);
  }
  async function getCandidates(){
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    
    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
    const candidates_ = await contractInstance.getCandidates();

    const candidatesList = candidates_.map((candidate, index)=> {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toString()
      }
    })
    setCandidates(candidatesList);
  }

  async function getRemainingTime(){
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16))
  }

  async function connectToMetamask(){
    if(window.ethereum){
      try{
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("Metamask conneted: ", address);
        setIsConnected(true);
        setAccount(address);
        canVote();
      }catch(e){  
        console.error(e);
      }
    }else{
      console.error("Metamask is not connect")
    }
  }

  async function handleNumberChange(e){
    setNumber(e.target.value)
  }

  async function canVote(){
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
    const voteStatus = await contractInstance.voted(await signer.getAddress());
    setVoted(voteStatus);
  }

  async function vote(){
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contractInstance.vote(number);
    await tx.wait();
    canVote();
  }


  return (
    <div className="App">
      {isConnected ? (<Connected account={account}
      candidates={candidates}
      remainingTime= {remainingTime}
      number = {number}
      handleNumberChange= {handleNumberChange}
      voteFunction={vote}
      showButton = {voted}
      />) 
      : (<Login connectWallet={connectToMetamask}/>)}
    
    </div>
  );
}

export default App;
