"use client";

import { getMetaMask } from "@/hooks/web";
import { ethers } from "ethers";

export const getWalletDetails = async (): Promise<{ signer: ethers.providers.JsonRpcSigner, address: string, network: ethers.providers.Network, provider: ethers.providers.Web3Provider }> => {
    const metamask = getMetaMask();
    await metamask.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(metamask);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    return { signer, address, network, provider };
}