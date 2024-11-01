"use client";
import { cn, color, pressable, text } from "@coinbase/onchainkit/theme";
import { useEffect, useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectors,
  useSignTypedData,
} from "wagmi";
import { Address, Hex } from "viem";
import { useQuery } from "@tanstack/react-query";
import { SpendPermission } from "../lib/types";
import { spendPermissionManagerAddress } from "@/lib/abi/SpendPermissionManager";

export type Subscription = {
  chainId: number;
  token: Address;
  start?: Date;
  end?: Date;
  period: number; // seconds,
  price: bigint;
  spender: Address | undefined;
};

const MAX_UINT48 = 281474976710655; // 2 ** 48 - 1

export default function Subscribe({
  chainId,
  token,
  start,
  end,
  period,
  price,
  spender,
}: Subscription) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [signature, setSignature] = useState<Hex>();
  const [transactions, setTransactions] = useState<Hex[]>([]);
  const [spendPermission, setSpendPermission] = useState<SpendPermission>();

  const { signTypedDataAsync } = useSignTypedData();
  const account = useAccount();
  const { connectAsync } = useConnect();
  const connectors = useConnectors();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["collectSubscription"],
    queryFn: handleCollectSubscription,
    refetchOnWindowFocus: false,
    enabled: !!signature,
  });

  useEffect(() => {
    if (!data) return;
    console.log("new data", data);
    if (transactions.length > 9) {
      setTransactions([data?.transactionHash, ...transactions.slice(0, 10)]);
    } else {
      setTransactions([data?.transactionHash, ...transactions]);
    }
  }, [data]);

  async function handleCollectSubscription() {
    setIsDisabled(true);
    let data;
    try {
      console.log("calling handleCollectSubscription");
      console.log({ spendPermission, signature });
      const replacer = (key: string, value: any) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
      const response = await fetch("/collect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            spendPermission,
            signature,
            dummyData: Math.ceil(Math.random() * 100),
          },
          replacer
        ),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log({ response });
      data = await response.json();
    } catch (e) {
      console.log("catch", e);
    }
    setIsDisabled(false);
    return data;
  }

  // ====================================================
  // Batch example
  // const signature = await signTypedDataAsync({
  //   domain: {
  //     name: "Spend Permission Manager",
  //     version: "1",
  //     chainId: chainId,
  //     verifyingContract: spendPermissionManagerAddress,
  //   },
  //   types: {
  //     PermissionDetails: [
  //       { name: "spender", type: "address" },
  //       { name: "token", type: "address" },
  //       { name: "allowance", type: "uint160" },
  //       { name: "salt", type: "uint256" },
  //       { name: "extraData", type: "bytes" },
  //     ],
  //     SpendPermissionBatch: [
  //       { name: "account", type: "address" },
  //       { name: "period", type: "uint48" },
  //       { name: "start", type: "uint48" },
  //       { name: "end", type: "uint48" },
  //       { permissions: "PermissionDetails[]" },
  //     ],

  //   },
  //   primaryType: "SpendPermission",
  //   message: {
  //     account: "0xa10Aac6675b5d2870647cE840fE7280F49fb0B13",
  //     period: 86400,
  //     start: 1730236033,
  //     end: 1761797231,
  //     permissions: [
  //       {
  //         spender: "0xeAFEB47faa42e86580ffdf5AFE2b350A5B197955",
  //         token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //         allowance: 1000000000000000000,
  //         salt: 0,
  //         extraData: "0x",
  //       },
  //       {
  //         spender: "0xeAFEB47faa42e86580ffdf5AFE2b350A5B197955",
  //         token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //         allowance: 1000000000000000000,
  //         salt: 1,
  //         extraData: "0x",
  //       },
  //     ],
  //   },
  // });
  // ====================================================

  console.log({ connectors });

  async function handleSubmit() {
    setIsDisabled(true);
    let accountAddress = account?.address;
    if (!accountAddress) {
      try {
        const requestAccounts = await connectAsync({
          connector: connectors[0],
        });
        accountAddress = requestAccounts.accounts[0];
      } catch {
        return;
      }
    }

    const spendPermission = {
      account: accountAddress,
      spender: process.env.NEXT_PUBLIC_SUBSCRIPTION_SPENDER! as Address,
      token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" as Address,
      allowance: price,
      period: 86400,
      start: Math.floor(start?.valueOf() ?? Date.now() / 1000),
      end: !!end ? Math.floor(end.valueOf() / 1000) : MAX_UINT48,
      salt: BigInt(0),
      extraData: "0x" as Hex,
    };

    try {
      const signature = await signTypedDataAsync({
        domain: {
          name: "Spend Permission Manager",
          version: "1",
          chainId: chainId,
          verifyingContract: spendPermissionManagerAddress,
        },
        types: {
          SpendPermission: [
            { name: "account", type: "address" },
            { name: "spender", type: "address" },
            { name: "token", type: "address" },
            { name: "allowance", type: "uint160" },
            { name: "period", type: "uint48" },
            { name: "start", type: "uint48" },
            { name: "end", type: "uint48" },
            { name: "salt", type: "uint256" },
            { name: "extraData", type: "bytes" },
          ],
        },
        primaryType: "SpendPermission",
        message: spendPermission,
      });
      console.log({ spendPermission, signature });
      setSpendPermission(spendPermission);
      setSignature(signature);
    } catch (e) {
      console.log("catch", e);
    }
    setIsDisabled(false);
  }
  return (
    <div>
      {!signature ? (
        <div className="flex w-[450px]">
          <button
            className={cn(
              pressable.primary,
              "w-full rounded-xl",
              "px-4 py-3 font-medium text-base text-white leading-6",
              isDisabled && pressable.disabled,
              text.headline
            )}
            onClick={handleSubmit}
            type="button"
            disabled={isDisabled}
            data-testid="ockTransactionButton_Button"
          >
            <span
              className={cn(
                text.headline,
                color.inverse,
                "flex justify-center"
              )}
            >
              Subscribe
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-8 w-[450px]">
          <div className="flex">
            <button
              className={cn(
                pressable.primary,
                "w-full rounded-xl",
                "px-4 py-3 font-medium text-base text-white leading-6",
                isDisabled && pressable.disabled,
                text.headline
              )}
              onClick={() => refetch()}
              type="button"
              disabled={isDisabled}
              data-testid="collectSubscriptionButton_Button"
            >
              <span
                className={cn(
                  text.headline,
                  color.inverse,
                  "flex justify-center"
                )}
              >
                Collect Subscription
              </span>
            </button>
          </div>
          <div className="h-80 space-y-4 relative">
            <div className="text-lg font-bold">Subscription Payments</div>
            <div className="flex flex-col">
              {transactions.map((transactionHash, i) => (
                <a
                  key={i}
                  className="hover:underline text-ellipsis truncate"
                  target="_blank"
                  href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                >
                  View transaction {transactionHash}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
