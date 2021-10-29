import { Field, OneToOne, TableName, CreateDateColumn, DeleteDateColumn } from "../../../@uni-sql/native/src/decorators";
import { Model } from "../../../@uni-sql/native/src/Model";

@TableName("users")
export class User extends Model {
  @Field({ fieldName: "id", type: "integer", primaryKey: true })
  id?: string;

  @Field({ fieldName: "name", type: "string" })
  name!: string;

  @Field({ fieldName: "age", type: "number" })
  age!: number;

  post?: Post

  @CreateDateColumn()
  createdAt?: Date

  @DeleteDateColumn()
  deletedAt?: Date
}

@TableName("posts")
export class Post extends Model {
  @Field({ fieldName: "id", type: "string" })
  id!: string;

  @Field({ fieldName: "post", type: "string" })
  post!: string;

  @OneToOne(() => User)
  user!: User
}