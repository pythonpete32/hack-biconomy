import React from "react";
import { useAccount } from "wagmi";
import {
  useBatchTransaction,
  useSmartAccountState,
} from "../lib/hooks/biconomy";
import { shortenAddress } from "../lib/shortenAddress";
import { tokenTx } from "../lib/token";

const USDC = "0x7fFb642D4927E9c2463F596367beFC81767997D8";

export default function HeroCode() {
  const { address } = useAccount();
  const { data: smartAccountData, isLoading } = useSmartAccountState();

  const { mutate, error } = useBatchTransaction();

  function handleClick() {
    mutate([
      // tokenTx(USDC, "mint", [address, "1000000000000000000000000"]),
      tokenTx(USDC, "approve", [address, "42000000006999999999"]),
    ]);
  }

  return (
    <>
      <div className="flex flex-col justify-center w-4/12 space-y-4 p-2">
        <div className="mockup-code ">
          <pre data-prefix="$" className="text-xl">
            <code>bico-smart-account</code>
          </pre>
          {!address ? (
            <pre data-prefix=">" className="text-warning text-xl">
              <code>Disconnected</code>
            </pre>
          ) : (
            <>
              <pre data-prefix=">" className="text-success text-xl">
                <code>EOA: {shortenAddress(address, 4)}</code>
              </pre>
              {!smartAccountData ? (
                <pre data-prefix=">" className="text-warning text-xl">
                  <code>Smart Account Data Loading...</code>
                </pre>
              ) : (
                <>
                  <pre data-prefix="$" className=" text-xl">
                    <code>Smart Account: </code>
                  </pre>
                  <pre data-prefix=">" className="text-error text-xl">
                    <code>Deployed ({`${smartAccountData.isDeployed}`})</code>
                  </pre>
                </>
              )}
            </>
          )}
        </div>
        <button
          className={isLoading ? "btn glass loading" : "btn glass"}
          disabled={!smartAccountData || smartAccountData?.isDeployed}
          onClick={() => handleClick()}
        >
          {isLoading ? "Loading..." : "Deploy Smart Account"}
        </button>
        {error && (
          <div className="card w-full bg-error p-4 text-primary-content">
            <code>Reason: {error?.reason}</code>
            <code>Method: {error?.method}</code>
            <code>{error?.body}</code>
          </div>
        )}
      </div>
    </>
  );
}
