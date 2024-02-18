import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { ethers } from 'ethers';

interface AllowanceModalProps {
  isOpen: boolean;
  tokenAddress: string;
  provider: ethers.providers.Web3Provider;
  onClose: () => void;
  spender: string;
  tokenName: string;
  allowance?: string;
}

const AllowanceModal: React.FC<AllowanceModalProps> = ({
  isOpen,
  onClose,
  spender,
  allowance,
  tokenName,
  tokenAddress,
  provider,
}) => {
  const [erc20allowance, setAllowance] = useState(allowance);
  const handleChangeAllowance = async () => {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() public view returns (uint8)',
        'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
        'function approve(address _spender, uint256 _value) public returns (bool success)',
      ],
      provider,
    );

    try {
      const decimals = await tokenContract.decimals();
      const power = ethers.BigNumber.from(10).pow(decimals);
      const formattedBalance = ethers.BigNumber.from(erc20allowance).mul(power);

      const balanceResult = await tokenContract
        .connect(provider.getSigner())
        .approve(spender, formattedBalance);
      console.log(balanceResult);
    } catch (error) {
      console.error('Error in approving token allowance:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{tokenName} Allowance</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text>Spender Address: {spender}</Text>
          <Text>Current Allowance: {allowance}</Text>

          <FormControl mt={4}>
            <FormLabel>Set Allowance:</FormLabel>
            <Input
              placeholder="Enter amount"
              onChange={(e) => setAllowance(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" onClick={handleChangeAllowance}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AllowanceModal;
