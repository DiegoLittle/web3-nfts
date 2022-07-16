import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateNFTInput } from "../inputs/CreateNFTInput";
import { NFT } from "../models/NFT";
import { User } from "../models/User";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Resolver()
export class TestResolver {
  @Query(() => String)
  async getPresignedURL(@Arg("filename") filename: string) {
    const s3 = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    const command = new PutObjectCommand({
      Bucket: "web3-nfts",
      Key: filename,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return url;
  }

  @Query(() => [NFT])
  async getNFTs(@Arg("user_address") user_address: string) {
    return NFT.find({
      where: {
        user: {
          address: user_address,
        },
      },
    });
  }

  @Mutation(() => NFT)
  async createNFT(
    @Arg("user_address") user_address: string,
    @Arg("title") title: string,
    @Arg("description") description: string,
    @Arg("image_url") image_url: string
  ) {
    console.log(user_address)
    let user = await User.findOne({ where: { address: user_address } });
    if (!user) {
      throw new Error("User not found");
    }
    const nft = new NFT();
    nft.user = user;
    nft.title = title;
    nft.description = description;
    nft.image_url = image_url;
    await nft.save();
    return nft;
  }

  @Mutation(() => NFT)
  async updateNFTContract(@Arg("id") id: string,@Arg("hash") hash: string, @Arg("data") data: string) {
    let nft = await NFT.findOne({ where: { id: id } });
    if (!nft) {
      throw new Error("NFT not found");
    }
    nft.hash = hash;
    nft.data = data;
    await nft.save();
    return nft;
  }
}
