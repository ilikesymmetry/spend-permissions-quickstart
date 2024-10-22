
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log({body});

    const transactionHash = '0x' + body.nonce
    return NextResponse.json({status: 'success', transactionHash, transactionUrl: `https://sepolia.basescan.org/tx/${transactionHash}`});
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}