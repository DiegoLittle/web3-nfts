import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "../models/User";
import { CreateUserInput } from "../inputs/CreateUserInput";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  books() {
    return User.find();
  }

  @Query(() => User)
  book(@Arg("id") id: string) {
    return User.findOne({ where: { id } });
  }

  @Mutation(()=> User)
  async createUser(@Arg("data") data: CreateUserInput) {
    const user = new User();
    Object.assign(user, data);
    let nonce = Math.floor(Math.random() * 1000000);
    user.nonce = nonce.toString();
    await user.save();
    return user;
  }
}
