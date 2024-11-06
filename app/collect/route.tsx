import { NextRequest, NextResponse } from "next/server";
import { getSpenderBundlerClient } from "../../lib/spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "../../lib/abi/SpendPermissionManager";

export async function POST(request: NextRequest) {
  const spenderBundlerClient = await getSpenderBundlerClient();
  try {
    const body = await request.json();
    const { spendPermission, signature } = body;

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
          args: [spendPermission, "1"], // spend 1 wei
        },
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
