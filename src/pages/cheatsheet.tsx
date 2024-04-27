import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import CheatsheetComponent from '@components/tools/evmtools/CheatsheetComponent';
import ToolBase from '@components/common/ToolBase';

export default function Cheatsheet() {
  return (
    <Main
      meta={
        <Meta
          title="Solidity Cheatsheet | Zk block"
          description="Solidity helpers"
        />
      }
    >
      <ToolBase
        title="Solidity helpers"
        toolComponent={<CheatsheetComponent />}
      />
    </Main>
  );
}
