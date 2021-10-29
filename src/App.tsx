import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Database } from "../@uni-sql/native/src/Database";
import { SQL } from "../@uni-sql/native/src/Database/helpers";
import { db } from "./database";
import { Post, User } from "./database/Entity";
import { log } from "./utils";

export default function App() {
  const [users, setUsers] = useState<any[]>([]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       log.timer("CREATE_DB");
  //       const database = await db.create();
  //       log.timerEnd("CREATE_DB");

  //       log.timer('INSERT_USER')
  //       await database.entity('users').insert({age: 23, name: 'Leonardo'})
  //       log.timerEnd('INSERT_USER')

  //       log.timer("SELECT_USERS");
  //       //await database.entity('users').dropAllData()

  //       const users = await database
  //         .entity("users")
  //         .select(["*"], { only: { id: 1 } });

  //       log.timerEnd("SELECT_USERS");

  //       console.log(users);

  //       setUsers(users);
  //     } catch (error) {
  //       console.log("[DELETE]", error);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      log.timer("DB_CREATE");
      const database = await db.create();
      log.timerEnd("DB_CREATE");
      //await database.entity('users').dropAllData()
      log.timer("SELECT_USER");
      const users = await database.entity("users").select(['*']);
      log.timerEnd("SELECT_USER");

      setUsers(users);
    })();
  }, []);

  useEffect(() => {
    const { remove } = db.changes("users", (data) => {
      setUsers(data);
    });

    return () => {
      remove();
    };
  }, []);

  async function handleAdd() {
    try {
      console.clear();
      log.timer("DB_CREATE");
      const database = await db.create();
      log.timerEnd("DB_CREATE");
      log.timer("INSERT_USER");
      await database.entity("users").insert({ age: 26, name: "Leonardo" });
      log.timerEnd("INSERT_USER");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>This is UniSQL, realtime database and sync SQL!!!</Text>
      {!!users &&
        users.map((user, i) => <Text key={i.toString()}>{user?.name}</Text>)}
      <Button title="Add User" onPress={handleAdd} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
