"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { IFeeds, PushAPI } from "@pushprotocol/restapi";

const DMGroupRequests = ({
  pushChatUser,
  setGroupChatId,
}: {
  pushChatUser: PushAPI;
  setGroupChatId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [showRequest, setShowRequest] = React.useState<boolean>(false);
  const [requests, setRequests] = React.useState<IFeeds[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await pushChatUser.chat?.list("REQUESTS");
      //   console.log(requests);
      //   console.log("requests");
      setRequests(requests);
      if (requests?.length > 0) {
        setShowRequest(true);
      }
    };
    fetchRequests();
  }, [pushChatUser.chat]);

  return (
    <div>
      {showRequest && (
        <div>
          Old Requests
          {requests?.map((request) => {
            return (
              <div key={request.chatId}>
                console.log(request)
                <Button
                  onClick={async () => {
                    console.log(request.chatId);
                    const res = await pushChatUser.chat.group.join(
                      request.chatId || ""
                    );
                    console.log(res);
                    setGroupChatId(request.chatId || "");
                    setShowRequest(false);
                  }}
                >
                  : Accept
                </Button>
                <Button
                  onClick={() => {
                    if (request.chatId !== undefined)
                      pushChatUser.chat.group?.leave(request.chatId);
                  }}
                >
                  : Reject
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DMGroupRequests;
