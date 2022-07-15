import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../models/User";
import * as ethUtil from "ethereumjs-util";
import * as sigUtil from "@metamask/eth-sig-util";
import * as jwt from "jsonwebtoken";
import { AuthenticateResponseModel } from "../models/Auth";

type NonceResponse = {
  nonce: string;
};
type AuthenticateResponse = {
  access_token?: string;
  error?: string;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => User)
  async user_nonce(@Arg("address") address: string): Promise<User> {
    let user = await User.findOne({
      where: { address: address },
    });
    if (user) {
      console.log(user);
      return user;
    } else {
      const user = new User();
      user.address = address;
      let nonce = Math.floor(Math.random() * 1000000).toString();
      user.nonce = nonce;
      await user.save();
      return user;
    }
  }

  @Mutation(()=> AuthenticateResponseModel)
  async authenticate(
    @Arg("address") address: string,
    @Arg("signature") signature: string
  ): Promise<AuthenticateResponse> {
    let user = await User.findOne({ where: { address: address } });
    if (user) {
      // const msg = `I am signing my one-time nonce: ${user.nonce}`;
      // We now are in possession of msg, publicAddress and signature. We
      // will use a helper from eth-sig-util to extract the address from the signature
      const msgBufferHex = ethUtil.bufferToHex(Buffer.from(user.nonce, "utf8"));
      const address = sigUtil.recoverPersonalSignature({
        data: msgBufferHex,
        signature: signature,
      });
      // The signature verification is successful if the address found with
      // sigUtil.recoverPersonalSignature matches the initial publicAddress
      if (address.toLowerCase() === address.toLowerCase()) {
        user.nonce = Math.floor(Math.random() * 1000000).toString();
        await user.save();
        let token = jwt.sign(
          {
            id: user.id,
            address: user.address,
          },
          process.env.JWT_SECRET as string
        );
        return {
          access_token: token,
          // error: null,
        };
        // res.send({
        //   access_token: token
        // })
      } else {
        return {
          // access_token: null,
          error: "Signature verification failed" };
      }
    } else {
      return {
        // access_token: null,
        error: "User not found",
      };
    }
  }
}
