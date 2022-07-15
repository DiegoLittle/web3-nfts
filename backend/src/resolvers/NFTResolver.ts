import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateNFTInput } from "../inputs/CreateNFTInput";
import { NFT } from "../models/NFT";
import { User } from "../models/User";


@Resolver()
export class TestResolver {
    @Query(() => String)
    hello() {
        return "Hello World!";
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

    @Mutation(() => String)
    async testMutation(@Arg("id") id: string) {
        console.log(id)
        let user = await User.find({where:{id}})
        return "Hello World!";
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