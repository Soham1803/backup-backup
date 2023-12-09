//lighthouse API:29d7a66c.24ab11b5bd844245977fd038ea79d454

import lighthouse from '@lighthouse-web3/sdk'

const apiKey = '29d7a66c.24ab11b5bd844245977fd038ea79d454'

export const uploadResponse = async (path?: string, dealParams?: any ) => {
    try {
        const data = await lighthouse.upload(path, apiKey, dealParams );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// const dealParams = {
//     num_copies: 2,
//     repair_threshold: 28800,
//     renew_threshold: 240,
//     miner: ["t017840"],
//     network: 'calibration',
//     add_mock_data: 2
//   };

// export const getFilecoinDeal = async (hashId: string) => { 
//     try { 
//         const data = await lighthouse.dealStatus(hashId);
//         console.log(data)
//     }
//     catch (error) {
//         console.log(error);
//         return error;
//     }
// }