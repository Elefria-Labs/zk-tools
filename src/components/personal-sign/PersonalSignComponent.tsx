import React, { useEffect, useState } from 'react';
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
  Heading,
  Icon,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { splitSignature, verifyMessage } from 'ethers/lib/utils';
import { CheckCircleIcon, LockIcon, CloseIcon } from '@chakra-ui/icons';
import { SignatureLike } from '@ethersproject/bytes';
import { toastOptions } from '@components/common/toast';
import { useAccount, useSignMessage } from 'wagmi';

type PersonalSignComponentPropsType = {};

const defaultMsg: string = 'Hello Ethereum!';

export function PersonalSignComponent(_: PersonalSignComponentPropsType) {
  // const { provider } = props;
  const account = useAccount();
  const { data: signMessageData, signMessage } = useSignMessage();
  const toast = useToast();

  const [verifySigInput, setVerifySigInput] = useState<
    SignatureLike | undefined
  >();
  const [rsvSig, setRsvSig] = useState<ethers.Signature | undefined>();
  const [messageToSign, setMessageToSign] = useState<string>(defaultMsg);

  const [recoveredAddr, setRecoveredAddr] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (signMessageData == null) {
      return;
    }
    const sig = splitSignature(signMessageData);
    setRsvSig(sig);
    setVerifySigInput(signMessageData);
  }, [signMessageData]);
  const signPersonalMessageUsingEthers = async () => {
    if (account == null) {
      toast({
        ...toastOptions,
        title: 'Please connect wallet.',
      });
      return;
    }
    if (signMessage == null) {
      return;
    }
    setLoading(true);
    // const signer = await provider.getSigner();
    signMessage({ message: messageToSign });
    // setSig(flatSig);

    setLoading(false);
  };

  const verify = async () => {
    if (verifySigInput == null || signMessage == null) {
      return;
    }
    setLoading(true);
    const recoveredAddress = verifyMessage(messageToSign, verifySigInput);
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
        <Flex flexDirection="column" w={'40%'}>
          <Heading size="md">Signing Message:</Heading>
          <Input
            placeholder="message to sign..."
            mt="8px"
            height="240px"
            color="black"
            borderColor="black"
            onChange={(event) => {
              if (event.target.value == null) {
                return;
              }
              setMessageToSign(event.target.value);
            }}
          />
          <Button
            variant="solid"
            size="md"
            mt="16px"
            onClick={signPersonalMessageUsingEthers}
          >
            Sign
          </Button>
        </Flex>
        {signMessageData && (
          <Flex ml="8px" pl="8px" w={'60%'} borderLeft="1px solid gray">
            <List spacing={3}>
              <ListItem key={'sig'}>
                <Text justifyContent="center">
                  <Icon as={LockIcon} color="green.500" /> Signature:
                </Text>
                <Textarea
                  mt={'4px'}
                  contentEditable={false}
                  value={signMessageData}
                />
              </ListItem>
              <ListItem key={'split-sig'}>
                <Text justifyContent="center">
                  <Icon as={LockIcon} color="green.500" />
                  Split Signature:
                </Text>
                <Textarea
                  mt={'4px'}
                  value={JSON.stringify(rsvSig)}
                  contentEditable={false}
                />
              </ListItem>
              <ListItem key={'verify'}>
                Verify Signature:
                <Input
                  placeholder="signature..."
                  color="black"
                  borderColor="black"
                  width={'340px'}
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
                Signing Address: <strong>{account.address}</strong>
              </ListItem>
              {!!recoveredAddr && (
                <ListItem key={'recoveredAddress'}>
                  {recoveredAddr?.toLowerCase() ==
                  account?.address?.toLowerCase() ? (
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                  ) : (
                    <ListIcon as={CloseIcon} color="red.500" />
                  )}
                  Recovered Address:
                  <strong>{recoveredAddr?.toLowerCase()}</strong>
                </ListItem>
              )}
            </List>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
