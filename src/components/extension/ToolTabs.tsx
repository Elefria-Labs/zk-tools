import React, { useState } from 'react';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { playgroundToolsList } from '@data/playground';
import BurnerWalletComponent from '@components/tools/evmtools/BurnerWalletComponent';
import EvmAddressChecksumComponent from '@components/tools/evmtools/EVMAddressChecksumComponent';
import MerkleTreeVerifier from '@components/tools/evmtools/MerkleTreeVerifier';
import StringByteConversion from '@components/tools/evmtools/StringByteConversion';
import TxDecoderComponent from '@components/tools/evmtools/TxDecoderComponent';
import { Links } from '@config/constants';
import GasConvertorComponent from '@components/tools/evmtools/GasConvertorComponent';
import CheatsheetComponent from '@components/tools/evmtools/CheatsheetComponent';

// type ToolTabsProps = {
//   toolNameSearchQuery?: string;
// };

function RenderToolTabPanel(link: string) {
  let component = <>Not Found</>;
  switch (link) {
    case Links.txDecoder:
      component = <TxDecoderComponent />;
      break;
    case Links.byteconversion:
      component = <StringByteConversion />;
      break;
    case Links.merkleTreeGenerator:
      component = <MerkleTreeVerifier />;
      break;
    case Links.evmChecksumAddress:
      component = <EvmAddressChecksumComponent />;
      break;
    case Links.burnerWallet:
      component = <BurnerWalletComponent />;
      break;
    case Links.gasConverter:
      component = <GasConvertorComponent />;
      break;
    case Links.cheatsheet:
      component = <CheatsheetComponent />;
      break;
  }
  return <TabPanel key={link}>{component}</TabPanel>;
}
export default function ToolTabs() {
  const [toolTabs] = useState(
    playgroundToolsList.filter((t) => t?.isWalletRequired == false),
  );

  return (
    <Flex dir="column" overflowX="hidden">
      <Tabs variant="soft-rounded" colorScheme="green">
        {/* H: 54px +16px */}
        <TabList
          overflowX="scroll"
          width={'464px'}
          style={{ scrollbarWidth: 'thin' }}
        >
          {toolTabs.map((t) => (
            <Tab
              rounded={'4px'}
              key={t.link}
              w="72px"
              height="64px"
              fontSize={'12px'}
              // padding="4px"
              // wordBreak="normal"
              // whiteSpace="nowrap"
            >
              {t.title}
            </Tab>
          ))}
        </TabList>
        <Divider my={1} />
        <TabPanels
          maxW={`480px -${16}px`}
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            height: `472px`, // -${56}px -${70}px
            paddingBottom: '8px',
          }}
        >
          {toolTabs.map((t) => RenderToolTabPanel(t.link))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
