import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import { Main } from '@templates/Main';
import { Meta } from '@layout/Meta';

export const SIGNUP_FORM_ACTION = 'https://zkblock.substack.com/';
export const SIGNUP_EMAIL_INPUT_NAME = 'email';

export function FreeSignUp() {
  return (
    <iframe
      src="https://zkblock.substack.com/embed"
      width="480"
      height="320"
      style={{ border: '1px solid #EEE', background: 'white' }}
      frameBorder="0"
      scrolling="no"
    ></iframe>
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
