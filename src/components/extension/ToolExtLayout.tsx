import React from 'react';
import { ChakraProvider, Stack } from '@chakra-ui/react';
import ToolTabs from './ToolTabs';
import ToolExtHeader from './ToolExtHeader';

export default function ToolExtLayout() {
  return (
    <ChakraProvider resetCSS>
      <Stack>
        <ToolExtHeader />
        <div style={{ padding: '0 8px 8px 8px' }}>
          {/* <ToolSearchInput /> */}
          <ToolTabs />
        </div>
      </Stack>
    </ChakraProvider>
  );
}
