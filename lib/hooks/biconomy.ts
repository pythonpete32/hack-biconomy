import { useAccount } from "wagmi";
import SmartAccount from "@biconomy-sdk/smart-account";
import {
  SmartAccountState,
  SmartAccountVersion,
} from "@biconomy-sdk/core-types";
import { LocalRelayer, RestRelayer } from "@biconomy-sdk/relayer";

import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import { useWindowEthereum } from "./useWindowEthereum";
import { useState } from "react";
var Web3 = require("web3");

async function getSmartAccount(address: any, provider: any) {
  if (!provider || !address) return;
  const walletProvider = new ethers.providers.Web3Provider(provider);

  const wallet = new SmartAccount(walletProvider, {
    activeNetworkId: activeChainId,
    supportedNetworksIds: supportedChains,
    dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_KEY, // required for gasless userOps
  });

  // Wallet initialization to fetch wallet info
  return wallet.init();
}

export function useGetSmartAccount() {
  const [smartAccount, setSmartAccount] = useState<SmartAccount>();
  const windowEthereum = useWindowEthereum();
  const { address } = useAccount();
  const query = useQuery(
    [address, "getSmartAccount"],
    () => getSmartAccount(address, windowEthereum),
    {
      enabled: !!address && !!windowEthereum,
      onSuccess: (data) => {
        data?.setRelayer(
          new RestRelayer({
            url: "https://sdk-relayer.staging.biconomy.io/api/v1/relay",
          })
        );
        setSmartAccount(data);
        data
          ? console.log("Smart Account", data)
          : console.log("No Smart Account");
      },
    }
  );
  return {
    smartAccount,
    ...query,
  };
}

export function useSmartAccountsByConnected() {
  const { smartAccount } = useGetSmartAccount();
  return useQuery(
    ["smartAccounts"],
    async () =>
      smartAccount?.getSmartAccountsByOwner({
        owner: smartAccount?.owner,
        chainId: activeChainId,
      }),
    {
      enabled: !!smartAccount,
      onSuccess: (data) => {
        console.log("Smart Accounts", data);
      },
    }
  );
}

export function useSmartAccountState() {
  const { smartAccount } = useGetSmartAccount();
  return useQuery(
    ["smartAccountState"],
    async () => smartAccount?.getSmartAccountState(),
    {
      enabled: !!smartAccount,
      onSuccess: (data) => {
        console.log("SmartAccount State", data);
      },
    }
  );
}

export const ChainId = {
  MAINNET: 1, // Ethereum
  GOERLI: 5,
  POLYGON_MUMBAI: 80001,
  POLYGON_MAINNET: 137,
};

export let activeChainId = ChainId.GOERLI;
export const supportedChains = [ChainId.GOERLI, ChainId.POLYGON_MUMBAI];
