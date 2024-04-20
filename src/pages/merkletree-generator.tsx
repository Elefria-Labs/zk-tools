import React from 'react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import MerkleTreeVerifier from '@components/eth-tools/MerkleTreeVerifier';
import ToolBase from '@components/common/ToolBase';

export default function MerkleTreeGenerator() {
  return (
    <Main
      meta={
        <Meta
          title="Merkle Tree Generator | Zk block"
          description="Generate merkle trees and verify leaves"
        />
      }
    >
      <ToolBase
        title="Merkle Tree Generator"
        toolComponent={<MerkleTreeVerifier />}
      />
    </Main>
  );
}
