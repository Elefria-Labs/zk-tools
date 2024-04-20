import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import StringByteConversion from '@components/eth-tools/StringByteConversion';
import ToolBase from '@components/common/ToolBase';

export default function ByteConversion() {
  return (
    <Main
      meta={
        <Meta
          title="Bytes32 & String Conversion | Zk block"
          description="Convert between Bytes32 & String "
        />
      }
    >
      <ToolBase
        title="Bytes32 & String Conversion"
        toolComponent={<StringByteConversion />}
      />
    </Main>
  );
}
