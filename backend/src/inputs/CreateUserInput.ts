import { InputType, Field } from "type-graphql";

@InputType()
export class CreateUserInput {

  @Field()
  address: string;

  @Field({nullable:true})
  username?: string;

  @Field({nullable:true})
  email?: string;
}