import { useEffect, useState } from 'react';
import {
  Heading,
  Text,
  VStack,
  Button,
  Input,
  useToast,
  Textarea,
  Checkbox,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';

type DeterministicAddressPropsType = {
  provider?: ethers.providers.JsonRpcProvider;
  address?: string;
};
const DeterministicAddress = (props: DeterministicAddressPropsType) => {
  const { provider, address } = props;
  const [account, setAccount] = useState(address);
  const [contractAddress, setContractAddress] = useState('');
  const [salt, setSalt] = useState('Salt');
  const [useCreate2, setUseCreate2] = useState(false);
  const [byteCode, setByteCode] = useState('');
  const toast = useToast();
  useEffect(() => {
    setAccount(address);
  }, [address]);

  const generateContractAddress = async () => {
    if (provider == null) {
      toast({ ...toastOptions, title: 'Please connect wallet.' });
      return;
    }
    if (!account) {
      toast({ ...toastOptions, title: 'Please check input.' });
      return;
    }
    const nonce = await provider.getTransactionCount(account);
    const contractAddress = ethers.utils.getContractAddress({
      from: account,
      nonce: nonce,
    });
    setContractAddress(contractAddress);
  };

  const generateContractAddressWithSalt = async () => {
    if (provider == null || account == null) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet or provide an address',
      });
      return;
    }
    if (!account || !salt || !byteCode) {
      toast({ ...toastOptions, title: 'Please provide correct input!' });
      return;
    }
    const contractAddress = ethers.utils.getCreate2Address(
      account,
      ethers.utils.keccak256(salt),
      byteCode,
    );
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
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />
      {useCreate2 && (
        <>
          <Input
            type="text"
            placeholder="Salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
          <Textarea
            placeholder="Enter contract bytecode"
            rows={6}
            value={byteCode}
            onChange={(e) => setByteCode(e.target.value)}
          />
        </>
      )}
      <Checkbox
        isChecked={useCreate2}
        onChange={(e) => setUseCreate2(e.target.checked)}
        colorScheme="blue"
      >
        Determine address using create2 (salt)
      </Checkbox>

      <Button
        onClick={
          useCreate2 ? generateContractAddressWithSalt : generateContractAddress
        }
      >
        Generate
      </Button>
      {contractAddress && (
        <Text as="b">Contract Address: {contractAddress}</Text>
      )}
    </VStack>
  );
};

export default DeterministicAddress;
