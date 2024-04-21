import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

type ToolBaseProps = {
  toolComponent: JSX.Element;
};
export default function WithChakraProvider(props: ToolBaseProps) {
  return <ChakraProvider resetCSS>{props.toolComponent}</ChakraProvider>;
}
