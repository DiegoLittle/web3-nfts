import "reflect-metadata";
import { DataSource } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolvers/BookResolver"; // add this
import { UserResolver } from "./resolvers/UserResolver";
import express from "express";
import bodyParser from "body-parser";
import { User } from "./models/User";
import cors from "cors";
import * as ethUtil from "ethereumjs-util";
import * as sigUtil from "@metamask/eth-sig-util";
import * as jwt from 'jsonwebtoken';
import { TestResolver } from "./resolvers/NFTResolver";
import { AuthResolver } from "./resolvers/AuthResolver";
require('dotenv').config()

async function main() {
  const port = 4000;
  const app = express();
  var jsonParser = bodyParser.json();

  app.use(cors());

  let dataSource = new DataSource({
    name: "development",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "diego",
    database: "web3_nfts",
    entities: ["./src/models/*.ts"],
    synchronize: true,
    logging: true,
  });
  let connection = await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [BookResolver, UserResolver,TestResolver,AuthResolver], // add this
  });
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app });

  // app.get("/:wallet_address/nonce", async (req, res) => {
  //   // req.params.wallet_address

  // });

  // app.post("/api/authentication",(req,res)=>{
  //   console.log(req)
  //   console.log("req.body",req.body)
  //   console.log(req.body)
  // })
  app.post("/api/authentication", jsonParser, async function (req, res) {
    let user = await User.findOne({ where: { address: req.body.address } });
    if (user) {
      type Body = {
        address: string;
        signature: string;
      }
      let body: Body = req.body;
      // const msg = `I am signing my one-time nonce: ${user.nonce}`;
      // We now are in possession of msg, publicAddress and signature. We
      // will use a helper from eth-sig-util to extract the address from the signature
      const msgBufferHex = ethUtil.bufferToHex(Buffer.from(user.nonce, "utf8"));
      const address = sigUtil.recoverPersonalSignature({
        data: msgBufferHex,
        signature: body.signature,
      });
      console.log(address);
      console.log(body.address)
      // The signature verification is successful if the address found with
      // sigUtil.recoverPersonalSignature matches the initial publicAddress
      if (address.toLowerCase() === req.body.address.toLowerCase()) {
        user.nonce = Math.floor(Math.random() * 1000000).toString();
        await user.save();
        let token =jwt.sign({
          id: user.id,
          address: user.address,
        },
        process.env.JWT_SECRET as string)
        res.send({
          access_token: token
        })
      } else {
        return res.status(401).send({ error: "Signature verification failed" });
      }
      //   const msgBuffer = ethUtil.toBuffer(Buffer.from(user.nonce,'hex'));
      // const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
      // const signatureBuffer = ethUtil.toBuffer(req.body.signature);
      // const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
      // const publicKey = ethUtil.ecrecover(
      //   msgHash,
      //   signatureParams.v,
      //   signatureParams.r,
      //   signatureParams.s
      // );
      // const addressBuffer = ethUtil.publicToAddress(publicKey);
      // const address = ethUtil.bufferToHex(addressBuffer);
      // if (address.toLowerCase() === req.body.address.toLowerCase()) {
      //   return user;
      // } else {
      //   return res
      //     .status(401)
      //     .send({ error: 'Signature verification failed' });
      // }
    } else {
      res.send({
        error: "User not found",
      });
    }
  });

  app.post("/:user/signature", (req, res) => {});

  app.get("/users/:id/nonce", (req, res) => {
    let nonce = Math.floor(Math.random() * 1000000);
    res.send("nonce: " + nonce);
  });

  app.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
}
main();
