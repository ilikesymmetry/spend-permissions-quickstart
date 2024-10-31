import { NextRequest, NextResponse } from "next/server";
import { getSpenderBundlerClient } from "../../lib/spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "../../lib/abi/SpendPermissionManager";
import { clickAbi, clickAddress } from "@/lib/abi/Click";

export async function POST(request: NextRequest) {
  console.log("pinged!");
  const spenderBundlerClient = await getSpenderBundlerClient();
  try {
    const body = await request.json();
    const { spendPermission, signature } = body;
    const value = "1";

    console.log({ spenderAddress: spenderBundlerClient.account.address });
    const userOpHash = await spenderBundlerClient.sendUserOperation({
      calls: [
        // {
        //   abi: clickAbi,
        //   functionName: "click",
        //   to: clickAddress,
        //   args: [],
        // },
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
          args: [spendPermission, value],
        },
      ],
    });

    const userOpReceipt =
      await spenderBundlerClient.waitForUserOperationReceipt({
        hash: userOpHash,
      });
    console.log({ userOpReceipt });

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
