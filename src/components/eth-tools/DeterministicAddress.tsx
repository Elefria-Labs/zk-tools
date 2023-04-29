import { useState } from 'react';
import { Heading, Text, VStack, Button, Input } from '@chakra-ui/react';
import { ethers } from 'ethers';

const DeterministicAddress = () => {
  const [account, setAccount] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const generateContractAddress = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const nonce = await provider.getTransactionCount(account);
    const contractAddress = ethers.utils.getContractAddress({
      from: account,
      nonce: nonce,
    });
    setContractAddress(contractAddress);
  };

  return (
    <VStack>
      <Heading size="sm">
        Contract address when deployed from the below account
      </Heading>
      <Input
        type="text"
        placeholder="0xAccountAddress.."
        onChange={(e) => setAccount(e.target.value)}
      />
      <Button onClick={generateContractAddress}>Generate</Button>
      {contractAddress && (
        <Text as="b">Contract Address: {contractAddress}</Text>
      )}
    </VStack>
  );
};

export default DeterministicAddress;
