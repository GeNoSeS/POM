// CREATE CONTRACT Metadata
import { config as loadEnv } from 'dotenv';
import { SDK, Auth, TEMPLATES, Metadata } from '@infura/sdk';
loadEnv();

const defaultImage = "https://ipfs.io/ipfs/bafybeicthqj4uiobzqdui7owgvp2ccemxhat4xtvhxjbxibrjtqvdtqkzq/T%20POM%20card%20111.jpg";
const defaultLink = "https://www.linkedin.com/in/vladislav-lenskii-393697237/";
const METADATA_PATH = './metadata/';

// Create Auth object
const auth = new Auth({
    projectId: process.env.INFURA_API_KEY,
    secretId: process.env.INFURA_API_KEY_SECRET,
    privateKey: process.env.WALLET_PRIVATE_KEY,
    rpcUrl: process.env.EVM_RPC_URL,
    chainId: 5, // Goerli
    ipfs: {
      projectId: process.env.INFURA_IPFS_PROJECT_ID,  // corrected mistake in a key
      apiKeySecret: process.env.INFURA_IPFS_PROJECT_SECRET,
    }
  });

// Instantiate SDK
const sdk = new SDK(auth);

// STORES FILES on IPFS
async function Store_File(filepath = METADATA_PATH + "0.json" ) {
    const storedFile = await sdk.storeFile({ metadata: filepath});
    console.log('storeImageUrl ----', storedFile);
    return storedFile; // returns IPFS hash of the stored file (string)
};

// STORES TOKEN METADATA on IPFS
async function Store_Metadata(name, image = defaultImage, link = defaultLink) {
    const collectionMetadata = Metadata.openSeaCollectionLevelStandard({
        name: `${name} POM`, 
        description: `Proof of Meet with ${name}`,
        image: await sdk.storeFile({
            metadata: image,
        }),
        external_link: link,  //'https://www.linkedin.com/in/vladislav-lenskii-393697237/'
    });
    const storeMetadata = await sdk.storeMetadata({ metadata: collectionMetadata });
    return storeMetadata;  // returns IPFS hash of the stored data (string)
};

// STORES ARRAY of medata on IPFS
async function storeFolder(names, imageLinks, link = defaultLink) { 
    const storeArrayMetadata = await sdk.createFolder({  // fixed problems with arguments
        metadata: [  // array - set of valid JSON metadata.
            Metadata.openSeaTokenLevelStandard({
                name: `${name} POM`, 
                description: `Proof of Meet with ${name}`,
                image: await sdk.storeFile({
                    metadata: image,
                }),
                 external_link: link,  //'https://www.linkedin.com/in/vladislav-lenskii-393697237/'
            }),
            Metadata.openSeaTokenLevelStandard({
                name: `${name} POM`, 
                description: `Proof of Meet with ${name}`,
                image: await sdk.storeFile({
                    metadata: image,
                }),
                 external_link: link,  //'https://www.linkedin.com/in/vladislav-lenskii-393697237/'
            })
        ],
        isErc1155: true,
    });
    console.log('storeArrayMetadata: ', storeArrayMetadata);
    return storeArrayMetadata;
}

//storeFolder(["Vlad","bob"], ["https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png","https://storage.googleapis.com/opensea-prod.appspot.com/puffs/4.png"]);
console.log(await Store_Metadata("Satoshi Nakamigo"));