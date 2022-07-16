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
import { NFT } from "./models/NFT";
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

  app.get("/tokens/:id", async (req, res) => {
    const nft = await NFT.findOne({ where: { id: req.params.id } })
    if (nft) {
      res.send(nft)
    }
    else{
    res.send("Not found")
  }
  });

  app.listen({ port }, () =>
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
}
main();
