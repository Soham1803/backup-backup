"use client";
import React, { useEffect } from 'react'
import InputFormEthAddress from './InputFormEthAddress';
import Pppchat from './Pppchat';
import { getWalletDetails } from '@/utils/Web3';
import { PushAPI, CONSTANTS, IFeeds, IMessageIPFS } from "@pushprotocol/restapi";

const PushChatNoGroup = () => {
    const [recAddress, setRecAddress] = React.useState<string>("")
    const [address, setAddress] = React.useState<string>("")
    const [user, setUser] = React.useState<PushAPI>({} as PushAPI)
    useEffect(() => {
        const initUser = async () => {
            const { address, signer } = await getWalletDetails();
            setAddress(address);
            console.log(address)
            if (!address) return;
            const user = await PushAPI.initialize(signer, {
                account: address,
                env: CONSTANTS.ENV.STAGING,
            })
            console.log(user)
            if (!user) return;
            setUser(user);
        }
        initUser();
    }, [address])
    return (
        <div>
            <h1>PPP Chat</h1>
            <h2>{address}</h2>
            <br />
            {
                recAddress === "" ? <InputFormEthAddress setValue={setRecAddress} /> : <Pppchat receiver={recAddress} user={user} />
            }

        </div>
    )
}

export default PushChatNoGroup
