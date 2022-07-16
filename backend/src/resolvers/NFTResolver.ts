import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateNFTInput } from "../inputs/CreateNFTInput";
import { NFT } from "../models/NFT";
import { User } from "../models/User";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
// import AWS from "aws-sdk";


// AWS.config = new AWS.Config({
//     accessKeyId: settings?.aws?.akid,
//     secretAccessKey: settings?.aws?.sak,
//     region: "us-east-1",
//     signatureVersion: "v4",
//   });
  
//   const s3 = new AWS.S3();

@Resolver()
export class TestResolver {

    @Query(()=>String)
    async getPresignedURL(@Arg("filename") filename: string) {

        const s3 = new S3Client({
            region: "us-east-1",
            credentials:{
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
        const command = new PutObjectCommand({Bucket: 'web3-nfts', Key: filename });
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return url;
    }

    @Query(() => [NFT])
    async getNFTs(@Arg("user_address") user_address: string) {
        return NFT.find({
            where: {
                user: {
                    address: user_address
                }
            }
        });
    }

    @Mutation(()=> NFT)
    async createNFT(@Arg("user_address") user_address: string, @Arg("hash") hash: string, @Arg("data") data: string) {
        let user = await User.findOne({where:{address:user_address}})
        if(!user) {
            throw new Error("User not found")
        }

        const nft = new NFT();
        nft.hash = hash;
        nft.user = user;
        nft.data = data;
        await nft.save();
        return nft;

    }
}