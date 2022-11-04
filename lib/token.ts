import { ethers } from "ethers";
import { Address, erc20ABI } from "wagmi";

export function tokenTx(address: Address, func: string, args: any[]) {
  const iFace = new ethers.utils.Interface(erc20ABI);
  return {
    to: address,
    data: iFace.encodeFunctionData(func, args),
  };
}
