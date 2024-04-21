import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ToolBase from '@components/common/ToolBase';
import TxDecoderComponent from '@components/tools/evmtools/TxDecoderComponent';

export default function TxDecoder() {
  return (
    <Main
      meta={
        <Meta
          title="Evm Transaction Decoder | Zk block"
          description="Decode raw evm transaction"
        />
      }
    >
      <ToolBase
        title="Transaction Decoder"
        toolComponent={<TxDecoderComponent />}
      />
    </Main>
  );
}
