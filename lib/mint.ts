import { Address, encodeFunctionData, Hex, parseUnits } from "viem";

type PrepareMintDataProps = {
  recipientAddress: Address;
  tokenContract: Address;
  tokenId: bigint;
  mintCost?: bigint;
};

export function prepareMintCall({
  recipientAddress,
  tokenContract,
  tokenId,
  mintCost,
}: PrepareMintDataProps): { to: Address; value: bigint; data: Hex } {
  return {
    to: "0x777777722D078c97c6ad07d9f36801e653E356Ae",
    value: mintCost ?? parseUnits("0.000111", 18),
    data: prepareMintData({ recipientAddress, tokenContract, tokenId }),
  };
}

export function prepareMintData({
  recipientAddress,
  tokenContract,
  tokenId,
}: PrepareMintDataProps) {
  return encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "address", name: "mintTo", type: "address" },
          { internalType: "uint256", name: "quantity", type: "uint256" },
          { internalType: "address", name: "collection", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "address", name: "mintReferral", type: "address" },
          { internalType: "string", name: "comment", type: "string" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "mint",
    args: [
      recipientAddress,
      BigInt(1), // quantity
      tokenContract,
      tokenId,
      "0x0000000000000000000000000000000000000000", // blank mintReferral
      "", // comment
    ],
  });
}
