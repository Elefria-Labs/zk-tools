import { useState } from 'react';
import { Button, Box, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { toastOptions } from '@components/common/toast';

const MerkleTreeVerifier: React.FC = () => {
  const [addressesInput, setAddressesInput] = useState('');
  const [merkleRoot, setMerkleRoot] = useState('');
  const [verifyAddress, setVerifyAddress] = useState('');
  const [addressBelongs, setAddressBelongs] = useState(false);
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
      const leaves = addresses.map((address) =>
        ethers.utils.keccak256(address),
      );
      return new MerkleTree(leaves);
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
    const root = tree.getRoot().toString('hex');
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
    const addressToVerify = ethers.utils.keccak256(verifyAddress);
    const proof = tree.getProof(addressToVerify);

    // Verify if the address belongs to the Merkle root
    const isValid = MerkleTree.verify(proof, addressToVerify, merkleRoot);
    setAddressBelongs(isValid);
    if (isValid) {
      toast({
        ...toastOptions,
        title: 'Address is present in the merkle tree.',
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
      <Text mt={4}>Verify if an address belongs to the Merkle tree:</Text>
      <Input
        placeholder="Address to Verify"
        value={verifyAddress}
        onChange={handleVerifyAddressChange}
        mb={4}
      />
      <Button onClick={handleVerifyAddress} mb={4}>
        Verify Address
      </Button>
      {addressBelongs && (
        <Box mt={4}>
          <Text>The address belongs to the Merkle tree.</Text>
        </Box>
      )}
      {!addressBelongs && merkleRoot && (
        <Box mt={4}>
          <Text>The address does not belong to the Merkle tree.</Text>
        </Box>
      )}
    </Box>
  );
};

export default MerkleTreeVerifier;
