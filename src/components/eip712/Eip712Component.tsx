import React, { useState } from 'react';
import {
  Text,
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  Flex,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Data712Type, Eip712MessageType, getData712 } from './eip712type';
import { ethers } from 'ethers';
import { splitSignature, verifyTypedData } from 'ethers/lib/utils';
import { CheckCircleIcon, LockIcon, CloseIcon } from '@chakra-ui/icons';
import JSONInput from 'react-json-editor-ajrm';
import { SignatureLike } from '@ethersproject/bytes';
const locale = require('react-json-editor-ajrm/locale/en');

type Eip712ComponentType = {
  provider?: ethers.providers.Web3Provider;
  address?: string;
};
const defaultMsg: Eip712MessageType = {
  from: '0xEC8bfA4a9F650a4439cce1Bdc23EAc0AD95E7a0D',
  to: '0xEC8bfA4a9F650a4439cce1Bdc23EAc0AD95E7a0D',
  value: 100000,
  data: '0x',
  nonce: 1, // await provider.getSigner().getTransactionCount(),
  gas: 100000,
};
export function Eip712Component(props: Eip712ComponentType) {
  const { provider, address } = props;
  const toast = useToast();
  // const [data712, setData712] = useState<Data712Type | undefined>();
  // @ts-ignore
  const [signTypedData, setSignTypedData] = useState<string | undefined>();
  const [sig, setSig] = useState<string | undefined>();
  const [verifySigInput, setVerifySigInput] = useState<
    SignatureLike | undefined
  >();
  const [rsvSig, setRsvSig] = useState<ethers.Signature | undefined>();
  const [data712, setData712] = useState<Data712Type>(getData712(defaultMsg));
  const [recoveredAddr, setRecoveredAddr] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  // @ts-ignore
  const signRaw = async () => {
    if (provider == null) {
      return;
    }
    setLoading(true);
    const signer = await provider.getSigner();
    const flatSig = await provider.send('eth_signTypedData_v4', [
      await signer.getAddress(),
      JSON.stringify(data712),
    ]);
    setSig(flatSig);
    const sig = splitSignature(flatSig);
    setRsvSig(sig);
    setVerifySigInput(flatSig);
    setSignTypedData(flatSig);
    setLoading(false);
  };
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
    const flatSig = await signer._signTypedData(
      data712.domain,
      { SampleTx: data712.types.SampleTx },
      data712.message,
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
    const recoveredAddress = verifyTypedData(
      data712.domain,
      { SampleTx: data712.types.SampleTx },
      data712.message,
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
          <JSONInput
            id="a_unique_id"
            placeholder={data712}
            height="320px"
            locale={locale}
            onChange={(event: any) => {
              if (event == null) {
                return;
              }
              setData712(event.jsObject);
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
