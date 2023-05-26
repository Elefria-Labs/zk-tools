import React, { useState } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';
import PolygonErc20 from '../data/token-directory/index/polygon/erc20.json';
import {
  TokenComponent,
  TokenComponentData,
} from './multi-send/TokenComponent';
import { Web3Provider } from '@ethersproject/providers';
import { SendAllContractPolygon } from '@config/constants';
import { ethers } from 'ethers';

type MultiSendPropsType = {
  provider: Web3Provider;
};
export const MultiSend = (props: MultiSendPropsType) => {
  const [components, setComponents] = useState<TokenComponentData[]>([]);
  const [erc20Tokens, setErc20Tokens] = useState(PolygonErc20.tokens);
  const [receiverAddress, setReceiverAddress] = useState('');
  const { provider } = props;

  const handleAddComponent = () => {
    setComponents([
      ...components,
      { token: null, tokenAddress: '', numberValue: 0 },
    ]);
  };

  const handleRemoveComponent = (index: number) => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setErc20Tokens([...erc20Tokens, components[index]?.token]);
    setComponents(updatedComponents);
  };

  const handleDropdownChange = (index: number, value: string) => {
    const updatedComponents: TokenComponentData[] = Object.assign(
      [],
      components,
    );
    if (!updatedComponents || !updatedComponents[index]) {
      return;
    }
    // @ts-ignore
    updatedComponents[index].tokenAddress = value;
    // @ts-ignore
    updatedComponents[index].token = erc20Tokens.filter(
      (token) => token.address == value,
    )?.[0];

    // const updateErc20TokenList = erc20Tokens.filter(
    //   (token) => token.address.toLowerCase() != value.toLowerCase(),
    // );

    // setErc20Tokens(updateErc20TokenList);
    setComponents(updatedComponents);
  };

  const handleNumberChange = (index: number, value: string) => {
    const parsedValue = parseInt(value, 10);
    const updatedComponents = [...components];
    // @ts-ignore
    updatedComponents[index].numberValue = isNaN(parsedValue) ? 0 : parsedValue;
    setComponents(updatedComponents);
  };

  const handleSignButtonClick = async () => {
    const sendAllContract = new ethers.Contract(
      SendAllContractPolygon,
      [
        'function transferTokens(address[] memory tokens, uint[] memory amounts, address to)',
      ],
      provider,
    );

    const valuesToSend = await Promise.all(
      components.map(async (c) => {
        const tokenContract = new ethers.Contract(
          c.tokenAddress,
          ['function decimals() public view returns (uint8)'],
          provider,
        );
        try {
          const decimals = await tokenContract.decimals();
          const power = ethers.BigNumber.from(10).pow(decimals);
          const formattedBalance = ethers.BigNumber.from(c.numberValue).mul(
            power,
          );
          console.log(formattedBalance);
          return formattedBalance;
        } catch (error) {
          console.error('Error fetching ERC20 token balance:', error);
        }
        return 0;
      }),
    );
    const allTokens = components.map((c) => c.tokenAddress);
    const sendAllTx = await sendAllContract
      .connect(provider.getSigner())
      .transferTokens(allTokens, valuesToSend, receiverAddress);
    console.log('sednAll', sendAllTx);
  };

  return (
    <Box>
      <Box>
        {components.map((component, i) => (
          <TokenComponent
            key={`token-${i}`}
            index={i}
            provider={provider}
            tokenData={component}
            handleDropdownChange={handleDropdownChange}
            handleRemoveComponent={handleRemoveComponent}
            handleNumberChange={handleNumberChange}
          />
        ))}
        {provider && (
          <Button mt={4} onClick={handleAddComponent}>
            Add Token
          </Button>
        )}
      </Box>
      <Box display="flex" flexDir="row">
        <Input
          type="string"
          placeholder="receiver's address"
          onChange={(e) => setReceiverAddress(e.target.value)}
        />

        <Button colorScheme="green" onClick={handleSignButtonClick}>
          Send
        </Button>
      </Box>
    </Box>
  );
};
