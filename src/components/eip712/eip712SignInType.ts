export type Eip712MessageType = {
  from: string;
  to: string;
  value: number;
  gas: number;
  nonce: number;
  data: string;
};

export type Data712Type = {
  types: {
    EIP712Domain: [
      {
        name: 'name';
        type: 'string';
      },
      {
        name: 'version';
        type: 'string';
      },
      {
        name: 'chainId';
        type: 'uint256';
      },
      {
        name: 'verifyingContract';
        type: 'address';
      },
    ];
    SampleTx: [
      { name: 'from'; type: 'address' },
      { name: 'to'; type: 'address' },
      { name: 'value'; type: 'uint256' },
      { name: 'gas'; type: 'uint256' },
      { name: 'nonce'; type: 'uint256' },
      { name: 'data'; type: 'bytes' },
    ];
  };
  primaryType: 'SampleTx';
  domain: {
    name: 'ZkBlock.app';
    version: '1';
    chainId: 1;
    verifyingContract: string;
  };
  message: Eip712MessageType;
};

export const getData712 = (message: Eip712MessageType): Data712Type => {
  return {
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
      SampleTx: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'gas', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'data', type: 'bytes' },
      ],
    },
    primaryType: 'SampleTx',
    domain: {
      name: 'ZkBlock.app',
      version: '1',
      chainId: 1,
      verifyingContract: '0xEC8bfA4a9F650a4439cce1Bdc23EAc0AD95E7a0D',
    },
    message: message,
  };
};
