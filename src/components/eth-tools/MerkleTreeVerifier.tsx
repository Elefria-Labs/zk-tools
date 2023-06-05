import { useState } from 'react';
import { Button, Box, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';

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
      const leaves = addresses.map((address) =>
        ethers.utils.keccak256(address),
      );
      return new MerkleTree(leaves);
    } catch (e) {
      toast({
        title: 'Unable to parse merkle leaves. Please check your input.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
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
    if (!verifyAddress || !merkleRoot) {
      toast({
        title: 'Please check your input.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
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
        title: 'Address is present in the merkle tree.',
        status: 'success',
        position: 'top',
        duration: 4000,
        isClosable: true,
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
