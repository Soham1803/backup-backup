import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import React, { useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream";
import { typeCastToMessage } from "@/utils/Chat";
import ChatContent from "./ChatConten";
const ppgchat = ({
  groupName,
  groupDescription,
  groupImage,
  recAddress,
  recAddress2,
  recAddress3,
  user,
  chatId,
}: {
  groupName: string;
  groupDescription: string;
  groupImage: string;
  recAddress: string;
  recAddress2: string;
  recAddress3: string;
  user: PushAPI;
  chatId: string;
}) => {
  const [message, setMessage] = React.useState<string>("");
  const [userStream, setUserStream] = React.useState<PushStream>();
  const [liveRequests, setLiveRequests] = React.useState<Message[]>([]);
  const [liveChats, setLiveChats] = React.useState<Message[]>([]);
  const [chats, setChats] = React.useState<Message[]>([]);

  useEffect(() => {
    const initStream = async () => {
      const stream = await user.initStream([CONSTANTS.STREAM.CHAT]);
      console.log(stream);
      setUserStream(stream);
      stream.connect();
    };
    initStream();
  }, [user]);

  useEffect(() => {
    userStream?.on(CONSTANTS.STREAM.CHAT, (message) => {
      console.log(message);
      if (message.event === "chat.message")
        setLiveChats((prev) => [...prev, message]);
      else if (message.event === "chat.request")
        setLiveRequests((prev) => [...prev, message]);
    });
  }, [userStream]);

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await user?.chat?.history(chatId);
      console.log(chats);
      const typeCastedChats = chats?.map((chat) => {
        return typeCastToMessage({
          content: chat,
          type: "ipfsFeed",
        });
      });
      setChats(typeCastedChats);
    };
    fetchChats();
  }, [user.chat, chatId]);

  const handleSendMessage = async () => {
    const senderMessage = await user.chat.send(chatId, {
      content: message,
      type: "Text",
    });
    console.log("message sent");
    console.log(senderMessage);
  };

  return (
    <div>
      <div className="grid w-full gap-2">
        <Textarea
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <Button onClick={handleSendMessage}>Send message</Button>
      </div>
      <hr />
      <hr />
      <ChatContent messages={[...chats, ...liveChats]} />
    </div>
  );
};

export default ppgchat;
