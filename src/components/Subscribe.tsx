'use client';
import {cn, color, pressable, text} from "@coinbase/onchainkit/theme"
import { useEffect, useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi'
import { Address, Hex } from "viem"
import { useQuery } from '@tanstack/react-query';

export type Subscription = {
  chainId: number
  token: Address,
  start?: Date,
  end?: Date,
  period: number // seconds,
  price: bigint
}

const MAX_UINT48 = 281474976710655 // 2 ** 48 - 1

async function collectSubscription() {
  const response = await fetch('/collect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nonce: Math.ceil(Math.random() * 100) }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data
}

export default function Subscribe({chainId, token, start, end, period, price}: Subscription) {
  const [isDisabled, setIsDisabled] = useState(false)
  const [signature, setSignature] = useState<Hex>()
  const [transactions, setTransactions] = useState<Hex[]>([])
  
  const {signTypedDataAsync} = useSignTypedData()
  const account = useAccount()
  
  console.log({signature})
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['collectSubscription'],
    queryFn: collectSubscription,
    refetchInterval: 5000, // 5 seconds       
    refetchOnWindowFocus: false, 
    enabled: !!signature,
  });
  
  useEffect(() => {
    if (!data) return
    console.log('new data', data)
    if (transactions.length > 9) {
      setTransactions([data?.transactionHash, ...transactions.slice(0,10)])
    } else {
      setTransactions([data?.transactionHash, ...transactions])
    }
  }, [data])

  console.log({transactions})

  async function handleSubmit() {
    setIsDisabled(true)
    try {
      const signature = await signTypedDataAsync({
        domain: {name: "Spend Permission Manager", chainId: chainId}, 
        types: {
          SpendPermission: [
            {name: 'account', type: 'address'},
            {name: 'spender', type: 'address'},
            {name: 'token', type: 'address'},
            {name: 'start', type: 'uint48'},
            {name: 'end', type: 'uint48'},
            {name: 'period', type: 'uint48'},
            {name: 'allowance', type: 'uint160'},
          ]
        },
        primaryType: "SpendPermission",
        message: {
          account: account.address!,
          spender: account.address!,
          token,
          start: Math.floor(start?.valueOf() ?? Date.now() / 1000),
          end: !!end ? Math.floor(end.valueOf() / 1000) : MAX_UINT48,
          period,
          allowance: price
        }
      })
      setSignature(signature)
    } catch (e) {
      console.log('catch', e)
    }
    setIsDisabled(false)
  }

  return !signature ? (
    <div className="flex w-[450px]">
      <button
        className={cn(
          pressable.primary,
          'w-full rounded-xl',
          'px-4 py-3 font-medium text-base text-white leading-6',
          isDisabled && pressable.disabled,
          text.headline,
        )}
        onClick={handleSubmit}
        type="button"
        disabled={isDisabled}
        data-testid="ockTransactionButton_Button"
      >
          <span
            className={cn(text.headline, color.inverse, 'flex justify-center')}
            >
            Subscribe
          </span>
      </button>
    </div>
  ) : (
    <div className="h-80 space-y-4 relative">
      <div className="text-lg font-bold">
        Subscription Payments
      </div>
      <div className="">
        {transactions.map((transactionHash, i) => (
          <div className="hover:underline">View transaction</div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
    </div>
  );
}
