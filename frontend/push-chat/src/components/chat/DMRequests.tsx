"use client";

import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { IFeeds, PushAPI } from '@pushprotocol/restapi'

const DMRequests = ({ pushChatUser }: {
    pushChatUser: PushAPI
}) => {
    const [showRequest, setShowRequest] = React.useState<boolean>(false)
    const [requests, setRequests] = React.useState<IFeeds[]>([])


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

    return (
        <div>
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
        </div>
    )
}

export default DMRequests
