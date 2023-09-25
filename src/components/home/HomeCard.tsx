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

export type HomeCardPropsType = {
  title: string;
  description?: string;
  link?: string;
  category?: string;
  tags?: string;
};

export function HomeCard(props: HomeCardPropsType) {
  return (
    <Center>
      <Box
        maxW={'280px'}
        minW={'280px'}
        height={'280px'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'xl'}
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
              fontSize={'xl'}
              fontFamily={'body'}
            >
              {props.title}
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
              {!!props.link && (
                <Link
                  isExternal
                  aria-label="Go to Website page"
                  href={props.link}
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
