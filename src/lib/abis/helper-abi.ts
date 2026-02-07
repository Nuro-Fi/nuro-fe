export const helperAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_factory",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    name: "OwnableInvalidOwner",
    type: "error",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    name: "OwnableUnauthorizedAccount",
    type: "error",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    name: "OwnershipTransferred",
    type: "event",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    name: "factory",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "getAddressPosition",
    type: "function",
    inputs: [
      {
        name: "_lendingPool",
        type: "address",
        internalType: "address",
      },
      {
        name: "_user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "getExchangeRate",
    type: "function",
    inputs: [
      {
        name: "_tokenIn",
        type: "address",
        internalType: "address",
      },
      {
        name: "_tokenOut",
        type: "address",
        internalType: "address",
      },
      {
        name: "_amountIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_position",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "getFee",
    type: "function",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          {
            name: "sendParam",
            type: "tuple",
            components: [
              {
                name: "dstEid",
                type: "uint32",
                internalType: "uint32",
              },
              {
                name: "to",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "amountLD",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "minAmountLD",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "extraOptions",
                type: "bytes",
                internalType: "bytes",
              },
              {
                name: "composeMsg",
                type: "bytes",
                internalType: "bytes",
              },
              {
                name: "oftCmd",
                type: "bytes",
                internalType: "bytes",
              },
            ],
            internalType: "struct SendParam",
          },
          {
            name: "fee",
            type: "tuple",
            components: [
              {
                name: "nativeFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lzTokenFee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            internalType: "struct MessagingFee",
          },
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "chainId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "addExecutorLzReceiveOption",
            type: "uint128",
            internalType: "uint128",
          },
        ],
        internalType: "struct BorrowParams",
      },
      {
        name: "_lendingPool",
        type: "address",
        internalType: "address",
      },
      {
        name: "_payInLzToken",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "getMaxBorrowAmount",
    type: "function",
    inputs: [
      {
        name: "_lendingPool",
        type: "address",
        internalType: "address",
      },
      {
        name: "_user",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "getTokenValue",
    type: "function",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "isLiquidatable",
    type: "function",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "lendingPool",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "owner",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    name: "renounceOwnership",
    type: "function",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "setFactory",
    type: "function",
    inputs: [
      {
        name: "_factory",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "transferOwnership",
    type: "function",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
