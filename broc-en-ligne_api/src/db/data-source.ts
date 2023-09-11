import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "user",
  password: "paris",
  database: "db_test",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: [],
});

try {
  const connected = AppDataSource.initialize();
  if (connected) console.log("Database connected");
} catch (error) {
  console.log(error);
}
