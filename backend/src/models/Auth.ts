import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class AuthenticateResponseModel {
  @Field(() => ID)
  access_token: string;

  @Field(() => String)
  error: string;
}