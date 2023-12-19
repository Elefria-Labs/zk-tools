import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Link,
  Divider,
  Flex,
} from '@chakra-ui/react';

export type HomeCardPropsType = {
  title: string;
  description?: string;
  link?: string;
  category?: string;
  tags?: string;
  isExternal?: boolean;
  glow?: boolean;
};

export function HomeCard(props: HomeCardPropsType) {
  return (
    <Center>
      <Box
        w={'280px'}
        h={'160px'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'xl'}
        rounded={'10px'}
        p={4}
        className={props.glow ? 'box glowing' : ''}
      >
        <Link
          isExternal
          aria-label={props.title}
          href={props.isExternal ? `${props.link}` : `/${props.link}`}
          style={{ textDecoration: 'none' }}
          target="_blank"
        >
          <Flex flexDirection="column" height="100%">
            <Stack>
              <Heading
                color={useColorModeValue('gray.700', 'white')}
                fontSize={'xl'}
                fontFamily={'body'}
              >
                {props.title}
              </Heading>
              <Divider my={2} />
              <Text
                color={'black'}
                textAlign="justify"
                noOfLines={4}
                fontSize="sm"
              >
                {props.description}
              </Text>
            </Stack>
          </Flex>
        </Link>
      </Box>
    </Center>
  );
}
