import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { NFT } from "./NFT";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(()=>String)
  @Column()
  address: string;

  @Field(() => String,{nullable:true})
  @Column({nullable:true})
  username: string;

  @Field(() => String,{nullable:true})
  @Column({nullable:true})
  email: string;

  @Field(() => Number,{nullable:true})
  @Column({nullable:true})
  nonce: string;

  @OneToMany(()=> NFT, nft => nft.user)
  nfts: NFT[];
}