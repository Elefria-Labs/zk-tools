import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  Flex,
  Input,
  Textarea,
  useToast,
  Select,
  Text,
} from '@chakra-ui/react';

import { ethers } from 'ethers';
import { splitSignature, verifyTypedData } from 'ethers/lib/utils';
import { CheckCircleIcon, LockIcon, CloseIcon } from '@chakra-ui/icons';
import JSONInput from 'react-json-editor-ajrm';
import { SignatureLike } from '@ethersproject/bytes';
import {
  GenericData712Type,
  getEip721DataByTemplate,
} from '@components/eip712/eip712type';
const locale = require('react-json-editor-ajrm/locale/en');

type Eip712PlaygroundType = {
  provider?: ethers.providers.Web3Provider;
  address?: string;
};

export function Eip712PlaygroundComponent(props: Eip712PlaygroundType) {
  const { provider, address } = props;
  const toast = useToast();
  // @ts-ignore
  const [signTypedData, setSignTypedData] = useState<string | undefined>();
  const [sig, setSig] = useState<string | undefined>();
  const [eip721Template, setEip712Template] = useState<string>('');
  const [verifySigInput, setVerifySigInput] = useState<
    SignatureLike | undefined
  >();
  const [rsvSig, setRsvSig] = useState<ethers.Signature | undefined>();
  const [data7122, setData7122] = useState<
    GenericData712Type<Record<string, string | number>, Record<string, string>>
  >(getEip721DataByTemplate('default'));
  const [recoveredAddr, setRecoveredAddr] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (eip721Template == null) {
      return;
    }

    setData7122(getEip721DataByTemplate(eip721Template));
  }, [eip721Template]);
  const signUsingEthers = async () => {
    if (provider == null) {
      toast({
        title: 'Please connect wallet.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    const signer = await provider.getSigner();
    const types = {
      [data7122.primaryType]: data7122.types[data7122.primaryType],
    } as Record<string, []>;
    const flatSig = await signer._signTypedData(
      data7122.domain,
      types,
      data7122.message,
    );
    setSig(flatSig);
    const sig = splitSignature(flatSig);
    setRsvSig(sig);
    setVerifySigInput(flatSig);
    setSignTypedData(flatSig);
    setLoading(false);
  };

  const verify = async () => {
    if (verifySigInput == null) {
      return;
    }
    setLoading(true);
    const types = {
      [data7122.primaryType]: data7122.types[data7122.primaryType],
    } as Record<string, []>;
    const recoveredAddress = verifyTypedData(
      data7122.domain,
      types,
      data7122.message,
      verifySigInput,
    );
    setRecoveredAddr(recoveredAddress);
    setLoading(false);
  };
  return (
    <Box
      mt={4}
      justifyContent="center"
      alignItems="center"
      borderRadius="10px 10px 0 0"
    >
      <Text>{loading}</Text>

      <Flex justifyContent={'space-between'}>
        <Flex flexDirection="column">
          <Text mb="8px">{'eth_signTypedData_v4'}</Text>
          <Select
            placeholder="Select Template"
            onChange={(event) => {
              setEip712Template(event.target.value);
            }}
            mb={4}
          >
            <option value="meta-tx">Meta Transaction</option>
            <option value="aave-delegate-credit">
              Aave Credit Delegation (Sepolia)
            </option>
          </Select>
          <JSONInput
            id="data7122"
            placeholder={data7122}
            height="320px"
            locale={locale}
            onChange={(event: any) => {
              if (event == null) {
                return;
              }
              setData7122(event.jsObject);
            }}
          />

          <Button variant="solid" size="md" mt="16px" onClick={signUsingEthers}>
            Sign
          </Button>
        </Flex>
        <Box ml="8px">
          {sig && (
            <List spacing={3}>
              <ListItem key={'sig'}>
                <ListIcon as={LockIcon} color="green.500" />
                Signature:
                <Textarea width="480px" contentEditable={false} value={sig} />
              </ListItem>
              <ListItem key={'split-sig'}>
                <ListIcon as={LockIcon} color="green.400" />
                Split Signature:
                <Textarea
                  width="480px"
                  value={JSON.stringify(rsvSig)}
                  contentEditable={false}
                />
              </ListItem>
              <ListItem key={'verify'}>
                <Input
                  placeholder="signature..."
                  value={sig}
                  color="black"
                  borderColor="black"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setVerifySigInput(event.target.value);
                  }}
                />
                <Button variant="solid" size="md" ml="16px" onClick={verify}>
                  Verify
                </Button>
              </ListItem>
              <ListItem key={'signingAddress'}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Signing Address: <strong>{recoveredAddr}</strong>
              </ListItem>
              {!!recoveredAddr && (
                <ListItem key={'recoveredAddress'}>
                  {recoveredAddr?.toLowerCase() == address?.toLowerCase() ? (
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                  ) : (
                    <ListIcon as={CloseIcon} color="red.500" />
                  )}
                  Recovered Address:
                  <strong>{recoveredAddr?.toLowerCase()}</strong>
                </ListItem>
              )}
            </List>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
