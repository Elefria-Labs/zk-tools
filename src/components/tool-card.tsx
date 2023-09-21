import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Link,
  Icon,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { GithubIcon } from './icon/github';
import { ToolsType } from '@types';

export function ToolCard(props: ToolsType) {
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
              {props.name}
            </Heading>
            <Divider mt={4} mb={8} />
            <Text
              color={'black'}
              textAlign="justify"
              mt={8}
              noOfLines={9}
              fontSize="sm"
            >
              {props.description}
            </Text>
          </Stack>

          <Box mt={2}>
            <Divider my={4} />
            <Stack direction={'row'} spacing={2} fontSize={'sm'}>
              {!!props.github && (
                <Link
                  isExternal
                  aria-label="Go to GitHub page"
                  href={props.github}
                >
                  <Icon
                    as={GithubIcon}
                    display="block"
                    transition="color 0.2s"
                    w="5"
                    h="5"
                    _hover={{ color: 'gray.600' }}
                  />
                </Link>
              )}
              {!!props.website && (
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
              )}
            </Stack>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
}
