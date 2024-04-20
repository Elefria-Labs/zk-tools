import React from 'react';
import { Container, Heading } from '@chakra-ui/react';

type ToolBaseProps = {
  title: string;
  isWalletRequired?: boolean;
  toolComponent: JSX.Element;
};
export default function ToolBase(props: ToolBaseProps) {
  return (
    <Container maxW={'container.lg'} position="relative">
      <Heading
        as="h1"
        color="black"
        fontSize={['35px', '35px', '40px']}
        fontWeight={700}
        mb="20px"
        mt="20px"
      >
        {props.title}
      </Heading>
      {/* <Flex justifyContent="end">
          {!account ? (
            <Button variant="solid" size="md" onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Button variant="solid" size="md" onClick={disconnect}>
              Disconnect {truncateAddress(account)}
            </Button>
          )}
        </Flex> */}
      {/* <DeterministicAddress provider={provider} address={account} /> */}
      {props.toolComponent}
    </Container>
  );
}
