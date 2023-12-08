"use client";
import React, { useEffect } from "react";
import InputFormEthAddress from "./InputFormEthAddress";
import Pppchat from "./Pppchat";
import { getWalletDetails } from "@/utils/Web3";
import {
  PushAPI,
  CONSTANTS,
  IFeeds,
  IMessageIPFS,
} from "@pushprotocol/restapi";
import DMRequests from "./DMRequests";
import { Button } from "../ui/button";

const PushChatNoGroup = () => {
  const [recAddress, setRecAddress] = React.useState<string>("");
  const [senderAddress, setSenderAddress] = React.useState<string>("");
  const [user, setUser] = React.useState<PushAPI>({} as PushAPI);
  const [walletConnected, setWalletConnected] = React.useState<boolean>(false);
  const initUser = async () => {
    console.log("init user");
    const { address, signer } = await getWalletDetails();
    setSenderAddress(address);
    console.log("Address received: ", address);
    if (!address) throw new Error("Address not initialized");
    const pushUser = await PushAPI.initialize(signer, {
      account: address,
      env: CONSTANTS.ENV.STAGING,
    });
    setUser(pushUser);
    console.log(user);
    if (!user) throw new Error("User not initialized");
  };
  return walletConnected ? (
    <div>
      {user !== null && user !== undefined && (
        <DMRequests pushChatUser={user} />
      )}
      <h1>PPP Chat</h1>
      <h2>{senderAddress}</h2>
      <br />
      {recAddress === "" || user === null || user === undefined ? (
        <InputFormEthAddress setValue={setRecAddress} />
      ) : (
        <Pppchat receiver={recAddress} user={user} />
      )}
    </div>
  ) : (
    <div>
      <h1>PPP Chat</h1>
      <h2>Connect Wallet</h2>
      <Button
        onClick={async () => {
          await initUser();
          setWalletConnected(true);
        }}
      >
        Connect
      </Button>
    </div>
  );
};

export default PushChatNoGroup;
