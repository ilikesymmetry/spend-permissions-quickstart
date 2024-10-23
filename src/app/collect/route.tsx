import { NextRequest, NextResponse } from "next/server";
import { getSpenderBundlerClient } from "../../spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "../../abi/SpendPermissionManager";

export async function POST(request: NextRequest) {
  const spenderBundlerClient = await getSpenderBundlerClient();
  try {
    const body = await request.json();
    console.log(body);
    const { spendPermission, signature } = body;

    const value = BigInt(Math.floor(spendPermission.allowance / 1000));

    const hash = await spenderBundlerClient.sendUserOperation({
      calls: [
        {
          abi: spendPermissionManagerAbi,
          functionName: "spendWithSignature",
          to: spendPermissionManagerAddress,
          args: [spendPermission, signature, value], // TODO do these need to be encoded prior to this?
        },
      ],
    });
    const receipt = await spenderBundlerClient.waitForUserOperationReceipt({
      hash,
    });

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
