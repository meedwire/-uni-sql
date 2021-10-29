import { Database } from "../../@uni-sql";
import { Post, User } from "./Entity";

export const db = new Database({
  name: "teste",
  entities: {
    posts: Post,
    users: User,
  },
  syncConfig:{
    host: '',
    entities:{
      posts: '',
      users: ''
    }
  }
});
