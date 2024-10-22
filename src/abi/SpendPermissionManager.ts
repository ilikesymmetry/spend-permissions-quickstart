import { Address } from "viem";

export const spendPermissionManagerAddress =
  "0x4ba47ee994d7fd63e8e8029431c35afa8487b8a5" as Address;
export const spendPermissionManagerAbi = [
  {
    inputs: [
      { internalType: "uint48", name: "currentTimestamp", type: "uint48" },
      { internalType: "uint48", name: "end", type: "uint48" },
    ],
    name: "AfterSpendPermissionEnd",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint48", name: "currentTimestamp", type: "uint48" },
      { internalType: "uint48", name: "start", type: "uint48" },
    ],
    name: "BeforeSpendPermissionStart",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "allowance", type: "uint256" },
    ],
    name: "ExceededSpendPermission",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "expected", type: "address" },
    ],
    name: "InvalidSender",
    type: "error",
  },
  { inputs: [], name: "InvalidSignature", type: "error" },
  {
    inputs: [
      { internalType: "uint48", name: "start", type: "uint48" },
      { internalType: "uint48", name: "end", type: "uint48" },
    ],
    name: "InvalidStartEnd",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
    name: "SpendValueOverflow",
    type: "error",
  },
  { inputs: [], name: "UnauthorizedSpendPermission", type: "error" },
  { inputs: [], name: "ZeroAllowance", type: "error" },
  { inputs: [], name: "ZeroPeriod", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "hash", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        indexed: false,
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
    ],
    name: "SpendPermissionApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "hash", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        indexed: false,
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
    ],
    name: "SpendPermissionRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "hash", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
          { internalType: "uint160", name: "spend", type: "uint160" },
        ],
        indexed: false,
        internalType: "struct SpendPermissionManager.PeriodSpend",
        name: "newUsage",
        type: "tuple",
      },
    ],
    name: "SpendPermissionUsed",
    type: "event",
  },
  {
    inputs: [],
    name: "NATIVE_TOKEN",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "approveWithSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { internalType: "bytes1", name: "fields", type: "bytes1" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "version", type: "string" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "verifyingContract", type: "address" },
      { internalType: "bytes32", name: "salt", type: "bytes32" },
      { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
    ],
    name: "getCurrentPeriod",
    outputs: [
      {
        components: [
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
          { internalType: "uint160", name: "spend", type: "uint160" },
        ],
        internalType: "struct SpendPermissionManager.PeriodSpend",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
    ],
    name: "getHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
    ],
    name: "isApproved",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint160", name: "value", type: "uint160" },
    ],
    name: "spend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint160", name: "allowance", type: "uint160" },
          { internalType: "uint48", name: "period", type: "uint48" },
          { internalType: "uint48", name: "start", type: "uint48" },
          { internalType: "uint48", name: "end", type: "uint48" },
        ],
        internalType: "struct SpendPermissionManager.SpendPermission",
        name: "spendPermission",
        type: "tuple",
      },
      { internalType: "bytes", name: "signature", type: "bytes" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint160", name: "value", type: "uint160" },
    ],
    name: "spendWithSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
