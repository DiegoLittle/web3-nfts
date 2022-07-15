import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class NFT extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(()=>String)
  @Column()
  hash: string;
  
  @Field(()=>String)
  @Column()
  data: string;

  @ManyToOne(()=>User,user=>user.nfts,{onDelete:'SET NULL'})
  user: User
}
