import { InputType, Field } from "type-graphql";
import { User } from "../models/User";

@InputType()
export class CreateNFTInput {
  @Field()
  hash: string;

  @Field()
  data: string;

  @Field()
  user: User

}