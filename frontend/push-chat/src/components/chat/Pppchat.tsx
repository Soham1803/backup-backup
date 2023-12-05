"use client";

import { getWalletDetails } from '@/utils/Web3'
import React, { use } from 'react'
import { useEffect } from 'react';
import { Input } from '../ui/input';
import { PushAPI, CONSTANTS, IFeeds, IMessageIPFS } from "@pushprotocol/restapi";
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import ChatContent from './ChatConten';
import { typeCastToMessage } from '@/utils/Chat';

const Pppchat = ({ receiver }: {
    receiver: string
}) => {
    const [address, setAddress] = React.useState<string>("")
    const [signer, setSigner] = React.useState<any>(null)
    // const [receiver, setReceiver] = React.useState<string>("")
    const [showRequest, setShowRequest] = React.useState<boolean>(false)
    const [message, setMessage] = React.useState<string>("")
    const [pushChatUser, setPushChatUser] = React.useState<PushAPI>({} as PushAPI)
    const [chats, setChats] = React.useState<Message[]>([])
    const [requests, setRequests] = React.useState<IFeeds[]>([])
    const [liveChats, setLiveChats] = React.useState<Message[]>([])
    const [liveRequests, setLiveRequests] = React.useState<Message[]>([])

    useEffect(() => {
        const initUser = async () => {
            const getAddress = async () => {
                const { address, signer } = await getWalletDetails();
                setSigner(signer);
                setAddress(address);
            }
            const setUser = async () => {
                await getAddress();
                if (!address) return;
                const user = await PushAPI.initialize(signer, {
                    account: address,
                    env: CONSTANTS.ENV.STAGING,
                })
                console.log(user)
                setPushChatUser(user)
                return user;
            }
            const user = await setUser();
            if (!user) return;
            const stream = await user.initStream([CONSTANTS.STREAM.CHAT]);
            console.log(stream)
            stream.on(CONSTANTS.STREAM.CHAT, (message) => {
                console.log(message);
                if (message.event === 'chat.message')
                    setLiveChats((prev) => [...prev, message])
                else if (message.event === 'chat.request')
                    setLiveRequests((prev) => [...prev, message])
            })
            stream.connect();
        }
        initUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address])

    const handleSendMessage = async () => {
        const senderMessage = await pushChatUser.chat.send(receiver, {
            content: message,
            type: 'Text'
        })
        console.log(senderMessage)
    }

    useEffect(() => {
        const fetchRequests = async () => {
            const requests = await pushChatUser.chat?.list('REQUESTS');
            console.log(requests)
            console.log("requests")
            setRequests(requests)
            if (requests?.length > 0) {
                setShowRequest(true)
            }
        }
        fetchRequests();
    }, [pushChatUser.chat])

    useEffect(() => {
        const fetchChats = async () => {
            const chats = await pushChatUser.chat?.history(receiver)
            console.log(chats)
            const typeCastedChats = chats?.map((chat) => {
                return typeCastToMessage({
                    content: chat,
                    type: 'ipfsFeed'
                })
            })
            setChats(typeCastedChats)
        }
        fetchChats()
    }, [pushChatUser.chat, receiver])


    return (
        <div>
            <h1>PPP Chat</h1>
            <h2>{address}</h2>
            {/* <Input onChange={(e) => setReceiver(e.target.value)} value={receiver} type='email' placeholder='Receiver Eth Address' /> */}
            <div className="grid w-full gap-2">
                <Textarea onChange={(e) => setMessage(e.target.value)} value={message} placeholder='Message' />
                <Button onClick={handleSendMessage}>Send message</Button>
            </div>

            {showRequest &&
                (
                    <div>
                        Old Requests
                        {
                            requests?.map((request) => {
                                return (
                                    <div key={request.chatId}>
                                        {
                                            JSON.stringify(request.msg.messageObj)
                                        }
                                        {':'} {request.msg.fromDID?.split(':')[1]}
                                        <Button onClick={() => {
                                            pushChatUser.chat?.accept(request.msg.fromDID?.split(':')[1])
                                            alert("Accepted")
                                            setShowRequest(false)
                                        }
                                        }>: Accept</Button>
                                        <Button onClick={() => { pushChatUser.chat?.reject(request.msg.fromDID?.split(':')[1]) }}>: Reject</Button>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
            <hr />
            {/* Live Requests
            {
                liveRequests?.map((request) => {
                    return (
                        <div key={request.chatId}>
                            {
                                JSON.stringify(request.message)
                            }
                            <Button onClick={() => pushChatUser.chat?.accept(request.from.split(':')[1])}>{request.from?.split(':')[1]}: Accept</Button>
                            <Button onClick={() => pushChatUser.chat?.reject(request.from?.split(':')[1])}>{request.from?.split(':')[1]}: Reject</Button>
                        </div>
                    )
                })
            } */}
            <hr />
            {/* Old Chats */}
            {/* {
                chats?.map((chat) => {
                    return (
                        <div key={chat.chatId}>
                            {
                                JSON.stringify(chat.msg.messageObj)
                            }
                        </div>
                    )
                })
            } */}
            Chats
            <ChatContent messages={chats} />
            <hr />
            {/* Live Chats */}
            {/* {
                liveChats?.map((chat) => {
                    return (
                        <div key={chat.chatId}>
                            {
                                chat.origin === 'self' ? 'By Me' : 'By Other'
                            }
                            {
                                JSON.stringify(chat.message)
                            }
                        </div>
                    )
                })
            } */}
            <ChatContent messages={liveChats} />
        </div>
    )
}

export default Pppchat
