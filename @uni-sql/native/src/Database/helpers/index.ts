import SQLite from "expo-sqlite";

interface QueryResult{
    transaction: SQLite.SQLTransaction;
    result: SQLite.SQLResultSet;
}
export class SQL {
  public localDb!: SQLite.WebSQLDatabase;

  query(sql: string) {
    return new Promise<QueryResult>((resolve, reject) => {
      this.localDb.transaction(
        this.callbackTX.bind({ resolve, reject, sql }),
        this.errorCallbackTX.bind(reject),
        this.successCallbackTX.bind(resolve)
      );
    });
  }

  private callbackTX(tx: SQLite.SQLTransaction) {
    return tx.executeSql(
      //@ts-ignore
      this.sql,
      undefined,
      (transaction, result) => {
        //@ts-ignore
        this.resolve({ transaction, result });
      },
      //@ts-ignore
      this.reject
    );
  }

  private errorCallbackTX(e?: SQLite.SQLError) {
    //@ts-ignore
    return this(e);
  }

  private successCallbackTX(success?: SQLite.SQLVoidCallback) {
    //@ts-ignore
    return this();
  }
}
