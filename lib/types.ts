import { Address } from "viem";

export type SpendPermission = {
  account: Address; // address
  spender: Address; // address
  token: Address; // address
  allowance: bigint; // uint160
  period: number; // uint48
  start: number; // uint48
  end: number; // uint48
};
