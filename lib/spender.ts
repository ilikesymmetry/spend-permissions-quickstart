import { createPublicClient, Hex, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import {
  createBundlerClient,
  createPaymasterClient,
  toCoinbaseSmartAccount,
} from "viem/account-abstraction";

export async function getSpenderBundlerClient() {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  console.log({ privateKey: process.env.SPENDER_OWNER_PRIVATE_KEY! as Hex });

  const spenderAccountOwner = privateKeyToAccount(
    process.env.SPENDER_OWNER_PRIVATE_KEY! as Hex
  );
  console.log({ spenderAccountOwner });

  // console.log({ spenderAccountOwner });

  const spenderAccount = await toCoinbaseSmartAccount({
    client,
    owners: [spenderAccountOwner],
  });

  // console.log({ spenderAccount });
  const paymasterClient = createPaymasterClient({
    transport: http(process.env.BASE_SEPOLIA_PAYMASTER_URL),
  });
  // console.log({ paymasterClient });

  const spenderBundlerClient = createBundlerClient({
    account: spenderAccount,
    client,
    paymaster: paymasterClient,
    transport: http(process.env.BASE_SEPOLIA_PAYMASTER_URL),
  });

  // console.log({ spenderBundlerClient });
  return spenderBundlerClient;
}
