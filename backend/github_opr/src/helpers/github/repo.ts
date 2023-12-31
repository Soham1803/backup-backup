// import clone from 'git-clone';
import pinataSDK from '@pinata/sdk';
// @ts-ignore
// import zipDir from 'zip-dir';
import { DEFAULT_REPO_BRANCH } from '../../defaults/repo/clone';
import fs from 'fs';
import { WSServer } from '../../web-sockets/init';
import { exec } from 'child_process';

export const  cloneRepoAndPushToIPFS = async (repoUrl: string, branch: string | undefined , name: string, timestamp: string|number) => {
    try {
        const wss = WSServer.getInstance(null).wss;
        if (!repoUrl || !repoUrl.length || typeof repoUrl !== 'string') {
            throw new Error('Repo URL is required');
        }
        const currentPath = process.cwd();


        const repoName = repoUrl.split('/').pop()?.split('.')[0];
        // make folder if absent
        if (!fs.existsSync(`${currentPath}/data/clones`)) {
            fs.mkdirSync(`${currentPath}/data/clones`);
        }
        if (!fs.existsSync(`${currentPath}/data/clones/${repoName}`)) {
            fs.mkdirSync(`${currentPath}/data/clones/${repoName}`);
        }
        const repoPath = `${currentPath}/data/clones/${repoName}/${repoName}`;

        //creating new folder by repo name
        console.log(currentPath)

        const cloneRepoLink = repoUrl + `/archive/refs/heads/${branch || DEFAULT_REPO_BRANCH}.zip`;
        console.log(cloneRepoLink);

        // clone repo
        await cloneRepoAsync(cloneRepoLink, repoPath);
        console.log('Repo cloned successfully')
        //clone repo to path using curl



        // clone(repoUrl, repoPath, {
        //     checkout: branch || DEFAULT_REPO_BRANCH
        // }, async () => {
        //     console.log('Repo cloned successfully');
        // })

        // clg repo files
        console.log(fs.readdirSync(`${currentPath}/data/clones/${repoName}`));

        // zip dir
        // await zipDir(`${currentPath}/data/clones/${repoName}/${repoName}`, { saveTo: `${currentPath}/data/clones/${repoName}/${repoName}.zip` });

        // uploading the zip file to web3 storage
        const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATAJWT });

        const stream = fs.createReadStream(`${currentPath}/data/clones/${repoName}/${repoName}.zip`);
        // console.log(stream)
        const result = await pinata.pinFileToIPFS(stream, {
            pinataMetadata: {
                name: `${repoName}.zip`
            },
            pinataOptions: {
                cidVersion: 0
            },
        })

        // deleting the folder
        fs.rm(`${currentPath}/data/clones/${repoName}`, {
            recursive: true,
            force: true
        }, () => {
            console.log('Folder deleted successfully');
        })
        const ipfsHash = result.IpfsHash;
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        const ipfsUrl2 = `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`
        console.log(ipfsUrl);
        const clientMessage = {
            repoUrl,
            branch,
            name,
            inTime: timestamp,
            ipfsUrl,
            ipfsUrl2,
            outTime: result.Timestamp,
            size: result.PinSize
        }
        wss.clients.forEach((client) => {
            client.send(JSON.stringify(clientMessage));
        });
        return result;
    } catch (error) {
        console.log("Error in cloning repo")
        console.error(error);
        return null;
    } 
}

async function cloneRepoAsync(cloneRepoLink: string, repoPath: string): Promise<void> {
    const cmd = `curl -L ${cloneRepoLink} -o ${repoPath}.zip`;

    try {
        const { stdout, stderr } = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });

        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    } catch (error) {
        console.error('Error:', error);
    }
}