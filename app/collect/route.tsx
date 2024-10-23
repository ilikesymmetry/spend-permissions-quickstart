import { NextRequest, NextResponse } from "next/server";
import { getSpenderBundlerClient } from "../../lib/spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "../../lib/abi/SpendPermissionManager";
import { encodeFunctionData } from "viem";
import { clickAbi, clickAddress } from "@/lib/abi/Click";

export async function POST(request: NextRequest) {
  console.log("pinged!");
  const spenderBundlerClient = await getSpenderBundlerClient();
  try {
    const body = await request.json();
    // console.log(body);
    const { spendPermission, signature } = body;

    const hash = await spenderBundlerClient.sendUserOperation({
      calls: [
        {
          abi: clickAbi,
          functionName: "click",
          to: clickAddress,
          args: [],
        },
      ],
    });
    const receipt = await spenderBundlerClient.waitForUserOperationReceipt({
      hash,
    });
    console.log({ receipt });

    return NextResponse.json({
      status: receipt.success ? "success" : "failure",
      hash,
      transactionUrl: `https://sepolia.basescan.org/tx/${hash}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
