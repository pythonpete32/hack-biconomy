import { useState } from "react";
import { Transaction } from "@biconomy-sdk/core-types";
import { RestRelayer } from "@biconomy-sdk/relayer";
import SmartAccount from "@biconomy-sdk/smart-account";
import { useAccount, useMutation } from "wagmi";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import { useWindowEthereum } from "./useWindowEthereum";

async function getSmartAccount(address: any, provider: any) {
  if (!provider || !address) return;
  const walletProvider = new ethers.providers.Web3Provider(provider);

  const wallet = new SmartAccount(walletProvider, {
    activeNetworkId: 5,
    supportedNetworksIds: [5],
    dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_KEY,
  });

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
        chainId: 5,
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

export function useBatchTransaction() {
  const { smartAccount } = useGetSmartAccount();

  const BatchTransaction = async (transactions: Transaction[]) => {
    if (!smartAccount) return;
    const tx = await smartAccount.createTransactionBatch({ transactions });
    return smartAccount.sendTransaction({ tx });
  };

  return useMutation(BatchTransaction, {
    onSuccess: (data) => {
      console.log("✅ BatchTransaction", data);
    },
    onError: (error) => {
      console.log("❌ BatchTransaction", error);
    },
  });
}
