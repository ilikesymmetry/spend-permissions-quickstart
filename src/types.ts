export type SpendPermission = {
  account: string; // address
  spender: string; // address
  token: string; // address
  start: number; // uint48
  end: number; // uint48
  period: number; // uint48
  allowance: bigint; // uint160
};
