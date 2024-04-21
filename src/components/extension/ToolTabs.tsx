import React, { useState } from 'react';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Flex,
} from '@chakra-ui/react';
import { playgroundToolsList } from '@data/playground';
import BurnerWalletComponent from '@components/tools/evmtools/BurnerWalletComponent';
import EvmAddressChecksumComponent from '@components/tools/evmtools/EVMAddressChecksumComponent';
import MerkleTreeVerifier from '@components/tools/evmtools/MerkleTreeVerifier';
import StringByteConversion from '@components/tools/evmtools/StringByteConversion';
import TxDecoderComponent from '@components/tools/evmtools/TxDecoderComponent';
import { Links } from '@config/constants';

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
    // case Links.gasConverter:
    //   component = <GasConvertorComponent />;
    //   break;
  }
  return <TabPanel key={link}>{component}</TabPanel>;
}
export default function ToolTabs() {
  const [toolTabs] = useState(
    playgroundToolsList.filter((t) => t?.isWalletRequired == false),
  );

  return (
    <Flex dir="column" overflowX="hidden">
      <Tabs
        size="xs"
        variant="soft-rounded"
        colorScheme="green"
        overflowX="scroll"
      >
        <TabList overflowX="scroll">
          {toolTabs.map((t) => (
            <Tab rounded={'4px'} key={t.link} wordBreak="keep-all">
              {t.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels maxW={`480px -${16}px`} overflowX="hidden">
          {toolTabs.map((t) => RenderToolTabPanel(t.link))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
