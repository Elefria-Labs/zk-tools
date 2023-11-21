import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Divider,
  Flex,
  Button,
} from '@chakra-ui/react';
import { BlockchainNetwork } from '@types';

type ZkNetworkCardType = {
  onClickAdd: (network: number | undefined) => void;
  blockchainNetwork: BlockchainNetwork;
};
export function ZkNetworkCard(props: ZkNetworkCardType) {
  const { onClickAdd, blockchainNetwork } = props;
  return (
    <Center>
      <Box
        maxW={'445px'}
        minW={'320px'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
      >
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <Stack>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'2xl'}
              fontFamily={'body'}
            >
              {blockchainNetwork.name}
            </Heading>
            <Divider my={4} />
            <Text color={'black'} textAlign="justify" fontSize="sm">
              {`Name: ${blockchainNetwork.name}`}
            </Text>
            <Text color={'black'} textAlign="justify" mt={2} fontSize="sm">
              {`Chain Id: ${blockchainNetwork.chainId}`}
            </Text>
            <Text color={'black'} textAlign="justify" mt={2} fontSize="sm">
              {`Currency: ${blockchainNetwork.nativeCurrency?.name} (${blockchainNetwork.nativeCurrency?.symbol})`}
            </Text>
            <Text color={'black'} textAlign="justify" mt={2} fontSize="sm">
              {`Decimals: ${blockchainNetwork.nativeCurrency?.decimals}`}
            </Text>
          </Stack>

          <Box mt={2}>
            <Divider my={4} />
            <Button
              variant="solid"
              onClick={() => {
                onClickAdd(blockchainNetwork.networkId);
              }}
            >
              Add Network
            </Button>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
}
