import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import {
  NEXT_PUBLIC_BUNDLER_URL_SEPOLIA,
  NEXT_PUBLIC_MNEMONIC,
} from "src/config";
import { mnemonicToAccount } from "viem/accounts";
import {
  createBundlerClient,
  createPaymasterClient,
  toCoinbaseSmartAccount,
} from "viem/account-abstraction";

// export const anExportedAddress = "0x4ba47ee994d7fd63e8e8029431c35afa8487b8a5";

export async function getSpenderBundlerClient() {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const spenderAccountOwner = mnemonicToAccount(NEXT_PUBLIC_MNEMONIC!);

  const spenderAccount = await toCoinbaseSmartAccount({
    client,
    owners: [spenderAccountOwner],
  });

  const paymasterClient = createPaymasterClient({
    transport: http(NEXT_PUBLIC_BUNDLER_URL_SEPOLIA),
  });

  const spenderBundlerClient = createBundlerClient({
    account: spenderAccount,
    client,
    paymaster: paymasterClient,
    transport: http(NEXT_PUBLIC_BUNDLER_URL_SEPOLIA),
  });

  return spenderBundlerClient;
}
