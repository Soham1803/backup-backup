"use client";
import React from 'react'
import InputFormEthAddress from './InputFormEthAddress';
import Pppchat from './Pppchat';

const PushChatNoGroup = () => {
    const [address, setAddress] = React.useState<string>("")
    return (
        <div>
            
            <br />
            {
                address === "" ? <InputFormEthAddress setValue={setAddress} /> : <Pppchat receiver={address} />
            }
            
        </div>
    )
}

export default PushChatNoGroup
