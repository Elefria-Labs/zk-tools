import React from 'react';

import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import BurnerWalletComponent from '@components/eth-tools/BurnerWalletComponent';

export default function BurnerWallet() {
  return (
    <Main
      meta={
        <Meta
          title="Burner Wallet | Zk block"
          description="Generate random private keys for evm chains"
        />
      }
    >
      <ToolBase
        title="Burner Wallet"
        toolComponent={<BurnerWalletComponent />}
      />
    </Main>
  );
}
