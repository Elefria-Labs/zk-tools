import { useState } from 'react';
import {
  Button,
  Box,
  Input,
  Text,
  Textarea,
  useToast,
  Divider,
  Heading,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

const defaultInput =
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045\n0xeee718c1e522ecb4b609265db7a83ab48ea0b06f\n0x14536667cd30e52c0b458baaccb9fada7046e056';

const MerkleTreeVerifier = () => {
  const [addressesInput, setAddressesInput] = useState(defaultInput.toString());
  const [merkleRoot, setMerkleRoot] = useState('');
  const [verifyAddress, setVerifyAddress] = useState('');
  const [proofAddressInput, setProofAddressInput] = useState('');
  const [addressProof, setAddressProof] = useState('');
  const [, setAddressBelongs] = useState(false);
  const toast = useToast();

  const handleAddressesInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setAddressesInput(event.target.value);
  };

  const handleVerifyAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerifyAddress(event.target.value);
  };

  const handleProofAddressInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setProofAddressInput(event.target.value);
  };

  const getTree = (addressesInput: string) => {
    try {
      const addresses = addressesInput
        .split('\n')
        .map((address) => address.trim());
      const areAllEvmAddr = addresses.every((addr) =>
        ethers.utils.isAddress(addr),
      );
      const noDuplicates = new Set(addresses).size !== addresses.length;
      if (!areAllEvmAddr || noDuplicates) {
        toast({
          ...toastOptions,
          title: 'Invalid or duplicate addresses.',
        });
        return;
      }

      return StandardMerkleTree.of(
        addresses.map((a) => [a]),
        ['address'],
      );
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Unable to parse merkle leaves. Please check your input.',
      });
    }
  };

  const handleCreateMerkleRoot = () => {
    const tree = getTree(addressesInput);
    if (tree == null) {
      return;
    }
    const root = tree.root;
    setMerkleRoot(root);
  };

  const handleVerifyAddress = () => {
    if (
      !verifyAddress ||
      !merkleRoot ||
      !ethers.utils.isAddress(verifyAddress)
    ) {
      toast({
        ...toastOptions,
        title: 'Please check your input.',
      });
      return;
    }
    const tree = getTree(addressesInput);
    if (tree == null) {
      return;
    }

    const proof = tree.getProof([verifyAddress]);

    // Verify if the address belongs to the Merkle root
    const isValid = tree.verify([verifyAddress], proof);
    setAddressBelongs(isValid);
    if (isValid) {
      toast({
        ...toastOptions,
        title: 'Address is present in the merkle tree.',
        status: 'success',
      });
    }
  };

  const handleGenerateProof = () => {
    if (!proofAddressInput || !ethers.utils.isAddress(proofAddressInput)) {
      toast({
        ...toastOptions,
        title: 'Please check your input.',
      });
      return;
    }
    const tree = getTree(addressesInput);
    if (tree == null) {
      return;
    }
    try {
      const proof = tree.getProof([proofAddressInput]);
      setAddressProof(proof.toString());
      toast({
        ...toastOptions,
        title: 'Proof generated successfully!',
        status: 'success',
      });
    } catch (e) {
      toast({
        ...toastOptions,
        title: 'Failed to generate valid proof.',
      });
    }
  };

  return (
    <Box p={4}>
      <Text mb={4}>Enter addresses (one per line):</Text>
      <Textarea
        placeholder="Enter addresses, one per line"
        rows={6}
        value={addressesInput}
        onChange={handleAddressesInputChange}
      />
      <Button onClick={handleCreateMerkleRoot} my={4}>
        Create Merkle Root
      </Button>
      {merkleRoot && (
        <Box mt={4}>
          <Text>Merkle Root: {merkleRoot}</Text>
        </Box>
      )}
      <Divider my={4} />
      <Heading my={4} size={'md'}>
        Generate merkle proof
      </Heading>
      <Input
        placeholder="Address"
        value={proofAddressInput}
        onChange={handleProofAddressInput}
        mb={4}
      />
      <Button onClick={handleGenerateProof} mb={4}>
        Generate Proof
      </Button>
      <Textarea
        placeholder="Enter addresses, one per line"
        rows={6}
        value={addressProof}
        disabled
      />
      <Divider my={4} />
      <Text my={4}>Verify if an address belongs to the Merkle tree:</Text>
      <Input
        placeholder="Address to Verify"
        value={verifyAddress}
        onChange={handleVerifyAddressChange}
        mb={4}
      />
      <Button onClick={handleVerifyAddress} mb={4}>
        Verify Address
      </Button>

      {/* {!addressBelongs && merkleRoot && (
        <Box mt={4}>
          <Text>The address does not belong to the Merkle tree.</Text>
        </Box>
      )} */}
    </Box>
  );
};

export default MerkleTreeVerifier;
