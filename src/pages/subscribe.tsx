import React from 'react';
import { Box, Button, Container, Heading, Input, Text } from '@chakra-ui/react';
import { Main } from '@templates/Main';
import { Meta } from '@layout/Meta';

export const SIGNUP_FORM_ACTION =
  'https://www.getrevue.co/profile/zkblock/add_subscriber';
export const SIGNUP_EMAIL_INPUT_NAME = 'member[email]';

export function FreeSignUp() {
  return (
    <Box p="20px" rounded="5px" borderWidth={2}>
      <Box textAlign="left">
        <Heading mb="10px" fontSize="23px" fontWeight={700}>
          Zk Updates
        </Heading>
        <Text mb="14px" fontSize="14px" lineHeight="20px">
          Enter your email below to get notified about the new zero knowledge
          projects, guides and updates
        </Text>

        <form action={SIGNUP_FORM_ACTION} method="post" target="_blank">
          <Input
            size="sm"
            fontSize="15px"
            py="18px"
            rounded="4px"
            placeholder="Your email"
            borderWidth={2}
            mb={'10px'}
            name={SIGNUP_EMAIL_INPUT_NAME}
          />
          <Button
            type={'submit'}
            bg="gray.700"
            _hover={{ bg: 'black' }}
            fontWeight={500}
            color={'white'}
            w="100%"
          >
            Subscribe
          </Button>
        </form>

        <Text color="gray.500" fontSize="12px" mt="10px">
          <Text as="span">We will only send emails</Text> when there are new
          updates.
        </Text>
      </Box>
    </Box>
  );
}

export default function Subscribe() {
  return (
    <Main
      meta={
        <Meta
          title="Zk Block | Subscribe to Zk Block"
          description="Subscribe to ZKBlock for updates on zero knowledge projects and web3."
        />
      }
    >
      <Box mb="60px">
        <Container maxW={'container.md'} position="relative">
          <Box maxWidth="400px" mx="auto" my={['30px', '30px', '80px']}>
            <FreeSignUp />
          </Box>
        </Container>
      </Box>
    </Main>
  );
}
