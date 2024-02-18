import React, { useState } from 'react';
import {
  Box,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton,
  CircularProgress,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

// import PolygonErc20 from '../../data/token-directory/index/polygon/erc20.json';
import { useGetErc20Balance } from '@hooks/useGetErc20Balance';
import { CloseIcon } from '@chakra-ui/icons';
import AllowanceModal from './AllowanceModal';
import { SendAllContractPolygon } from '@config/constants';

export interface TokenComponentData {
  token?: any;
  tokenAddress: string;
  numberValue: number;
}
type TokenComponentPropsType = {
  tokenData: TokenComponentData;
  index: number;
  provider: any;
  handleDropdownChange: (index: number, value: string) => void;
  handleNumberChange: (index: number, value: string) => void;
  handleRemoveComponent: (index: number) => void;
};

export const TokenComponent = (props: TokenComponentPropsType) => {
  const {
    index,
    tokenData,
    provider,
    handleDropdownChange,
    handleRemoveComponent,
    handleNumberChange,
  } = props;
  const [erc20Tokens] = useState<any[]>([]); // PolygonErc20.tokens
  const tokenInfo = useGetErc20Balance(
    tokenData.tokenAddress,
    provider,
    SendAllContractPolygon,
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Box display="flex" alignItems="center" mb={4}>
      <Box display="flex" alignItems="top">
        <FormControl>
          <FormLabel>Token</FormLabel>
          <Select
            value={tokenData.tokenAddress}
            onChange={(e) => handleDropdownChange(index, e.target.value)}
          >
            {erc20Tokens?.map((token) => (
              <option key={token.address} value={token.address}>
                {token.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl ml={4}>
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            value={tokenData.numberValue}
            onChange={(e) => handleNumberChange(index, e.target.value)}
          />
          <FormHelperText>
            Balance:
            {tokenInfo.balance ? tokenInfo.balance : <CircularProgress />}
          </FormHelperText>
        </FormControl>

        <FormControl ml={4}>
          <FormLabel>Allowance</FormLabel>
          <Input
            type="string"
            value={tokenInfo?.allowance ?? 0}
            disabled
            // onChange={(e) => handleNumberChange(index, e.target.value)}
          />
        </FormControl>
        <FormControl ml={2}>
          <Button colorScheme="green" onClick={onOpen}>
            Change Allowance
          </Button>
        </FormControl>
      </Box>
      <IconButton
        ml={4}
        aria-label="Remove Token"
        icon={<CloseIcon />}
        colorScheme="red"
        onClick={() => handleRemoveComponent(index)}
      />
      <AllowanceModal
        isOpen={isOpen}
        tokenName={tokenData.token?.name ?? ''}
        tokenAddress={tokenData.tokenAddress}
        allowance={tokenInfo?.allowance ?? ''}
        spender={SendAllContractPolygon}
        provider={provider}
        onClose={onClose}
      />
    </Box>
  );
};
