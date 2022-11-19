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
        height={'300px'}
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
              {blockchainNetwork.chainName}
            </Heading>
            <Divider mt={4} mb={8} />
            {/* <Box flexWrap="wrap">
              {props.tags?.split(',').map((tag, i) => (
                <Tag
                  size="sm"
                  key={i}
                  variant="solid"
                  colorScheme="blackAlpha"
                  mb="4px"
                  ml="4px"
                >
                  {tag}
                </Tag>
              ))}
            </Box> */}
            <Text
              color={'black'}
              textAlign="justify"
              mt={8}
              noOfLines={9}
              fontSize="sm"
            >
              {`Name: ${blockchainNetwork.name}`}
            </Text>
            <Text
              color={'black'}
              textAlign="justify"
              mt={8}
              noOfLines={9}
              fontSize="sm"
            >
              {`Chain Id: ${blockchainNetwork.chainId}`}
            </Text>
            <Text
              color={'black'}
              textAlign="justify"
              mt={8}
              noOfLines={9}
              fontSize="sm"
            >
              {`Currency: ${blockchainNetwork.nativeCurrency?.name} (${blockchainNetwork.nativeCurrency?.symbol})`}
            </Text>
            <Text
              color={'black'}
              textAlign="justify"
              mt={8}
              noOfLines={9}
              fontSize="sm"
            >
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
            <Stack direction={'row'} spacing={2} fontSize={'sm'}>
              {/* {!!props.blockExplorerUrls?.[0] && (
                <Link
                  isExternal
                  aria-label="Go to GitHub page"
                  href={props.blockExplorerUrls?.[0]}
                >
                  Block Explorer
                  <Icon
                    as={LinkIcon}
                    display="block"
                    transition="color 0.2s"
                    w="4"
                    h="4"
                    _hover={{ color: 'gray.600' }}
                  />
                </Link>
              )} */}
              {/* {!!props.website && (
                <Link
                  isExternal
                  aria-label="Go to Website page"
                  href={props.website}
                >
                  <Icon
                    as={ExternalLinkIcon}
                    display="block"
                    transition="color 0.2s"
                    w="5"
                    h="5"
                    _hover={{ color: 'gray.600' }}
                  />
                </Link>
              )} */}
            </Stack>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
}
