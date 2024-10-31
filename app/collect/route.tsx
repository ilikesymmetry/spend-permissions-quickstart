import { NextRequest, NextResponse } from "next/server";
import { getSpenderBundlerClient } from "../../lib/spender";
import {
  spendPermissionManagerAbi,
  spendPermissionManagerAddress,
} from "../../lib/abi/SpendPermissionManager";
import { clickAbi, clickAddress } from "@/lib/abi/Click";
import { readContract } from "viem/actions";

export async function POST(request: NextRequest) {
  console.log("pinged!");
  const spenderBundlerClient = await getSpenderBundlerClient();
  try {
    const body = await request.json();
    const { spendPermission, signature } = body;
    const value = "1";
    console.log({ spendPermission, signature });
    // const permissionHash = await readContract(spenderBundlerClient, {
    //   address: spendPermissionManagerAddress,
    //   abi: spendPermissionManagerAbi,
    //   functionName: "getHash",
    //   args: [spendPermission],
    // });

    // console.log({ spendPermission, permissionHash });
    console.log({ spenderAddress: spenderBundlerClient.account.address });
    const approvalHash = await spenderBundlerClient.sendUserOperation({
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
      ],
    });
    console.log({ approvalHash });
    const approvalReceipt =
      await spenderBundlerClient.waitForUserOperationReceipt({
        hash: approvalHash,
      });
    console.log({ approvalReceipt });
    const spendHash = await spenderBundlerClient.sendUserOperation({
      calls: [
        {
          abi: spendPermissionManagerAbi,
          functionName: "spend",
          to: spendPermissionManagerAddress,
          args: [spendPermission, value],
        },
      ],
    });
    console.log({ spendHash });
    const spendReceipt = await spenderBundlerClient.waitForUserOperationReceipt(
      {
        hash: spendHash,
      }
    );
    console.log({ spendReceipt });

    return NextResponse.json({
      status: spendReceipt.success ? "success" : "failure",
      transactionHash: spendReceipt.receipt.transactionHash,
      transactionUrl: `https://sepolia.basescan.org/tx/${receipt.receipt.transactionHash}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
