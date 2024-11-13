import { NextRequest, NextResponse } from "next/server";
import { getPublicClient, getSpenderWalletClient } from "../../lib/spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "../../lib/abi/SpendPermissionManager";
import { getSpenderBundlerClient } from "@/lib/smartSpender";
import { parseUnits, prepareEncodeFunctionData } from "viem";
import { prepareMintCall } from "@/lib/mint";

export async function POST(request: NextRequest) {
  const spenderBundlerClient = await getSpenderBundlerClient();
  try {
    const body = await request.json();
    const { spendPermission, signature } = body;
    const tokenContract = "0xbc30eab6ce1c773ef65ef8c3337e595db2ac8199";
    const tokenId = BigInt(1);
    const mintCost = parseUnits("0.000111", 18);

    const userOpHash = await spenderBundlerClient.sendUserOperation({
      calls: [
        {
          abi: spendPermissionManagerAbi,
          functionName: "approveWithSignature",
          to: spendPermissionManagerAddress,
          args: [spendPermission, signature],
        },
        {
          abi: spendPermissionManagerAbi,
          functionName: "spend",
          to: spendPermissionManagerAddress,
          args: [spendPermission, mintCost], // spend 1 wei
        },
        prepareMintCall({
          recipientAddress: spendPermission.account,
          tokenContract,
          tokenId,
          mintCost,
        }),
      ],
    });

    const userOpReceipt =
      await spenderBundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });

    return NextResponse.json({
      status: userOpReceipt.success ? "success" : "failure",
      transactionHash: userOpReceipt.receipt.transactionHash,
      transactionUrl: `https://sepolia.basescan.org/tx/${userOpReceipt.receipt.transactionHash}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
