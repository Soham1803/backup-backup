"use client";
import { getWalletDetails } from "@/utils/Web3";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  CONSTANTS,
  GroupDTO,
  GroupInfoDTO,
  PushAPI,
} from "@pushprotocol/restapi";
import { set } from "react-hook-form";
import InputFormGroupDetails from "./InputFormGroupDetails";
import Ppgchat from "./ppgchat";
import DMGroupRequests from "./DMGroupRequest";

const PushChatGroup = () => {
  const [recAddress, setRecAddress] = useState<string>("");
  const [recAddress2, setRecAddress2] = useState<string>("");
  const [recAddress3, setRecAddress3] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [groupImage, setGroupImage] = useState<string>("");
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [user, setUser] = useState<PushAPI>({} as PushAPI);
  const [groupChat, setGroupChat] = useState<GroupInfoDTO | GroupDTO>(
    {} as GroupInfoDTO | GroupDTO
  );
  const [groupChatId, setGroupChatId] = useState<string>("");
  const userInit = async () => {
    const { address, signer } = await getWalletDetails();
    setSenderAddress(address);
    console.log("Address received: ", address);
    const pushUser = await PushAPI.initialize(signer, {
      account: address,
      env: CONSTANTS.ENV.STAGING,
    });
    setUser(pushUser);
    console.log(user);
    if (!address) throw new Error("Address not initialized");
  };

  const groupInit = async () => {
    const newGroup = await user.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [recAddress, recAddress2, recAddress3],
      admins: [],
      private: false,
      rules: {
        entry: { conditions: [] },
        chat: { conditions: [] },
      },
    });
    console.log(newGroup.chatId);
    setGroupChat(newGroup);
    setGroupChatId(newGroup.chatId);
  };
  return walletConnected ? (
    <div className="relative h-full w-full flex flex-col items-center justify-start">
      {user !== null && user !== undefined && (
        <DMGroupRequests pushChatUser={user} setGroupChatId={setGroupChatId} />
      )}
      <h1>Group chat</h1>
      <h1>sender address is {senderAddress}</h1>
      <br />
      {groupChatId === "" ? (
        <div>
          <div>
            <InputFormGroupDetails
              setGroupName={setGroupName}
              setGroupDescription={setGroupDescription}
              setGroupImage={setGroupImage}
              setRecAddress={setRecAddress}
              setRecAddress2={setRecAddress2}
              setRecAddress3={setRecAddress3}
            />
          </div>
          <div>
            <Button
              onClick={async () => {
                await groupInit();
              }}
            >
              {" "}
              Create Group{" "}
            </Button>
          </div>
        </div>
      ) : (
        <Ppgchat
          groupName={groupName}
          groupDescription={groupDescription}
          groupImage={groupImage}
          recAddress={recAddress}
          recAddress2={recAddress2}
          recAddress3={recAddress3}
          user={user}
          chatId={groupChatId}
        />
      )}
    </div>
  ) : (
    <div className="mt-6 h-full w-full flex flex-col items-center justify-start">
      <div className="flex flex-col w-4/6 items-start rounded-[6px]">
      <h1 className="text-lg px-3 py-1 text-start"> Group chat</h1>
      <h1 className="text-lg px-3 py-1 text-start"> Connect wallet</h1>
      </div>
      <br />
      <Button
        className="w-4/6 px-3 py-1"
        onClick={async () => {
          await userInit();
          setWalletConnected(true);
        }}
      >
        connect
      </Button>
    </div>
  );
};
export default PushChatGroup;
