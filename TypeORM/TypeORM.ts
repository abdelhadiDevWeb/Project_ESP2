import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "Projectesp",
  synchronize: false,
  logging: true,
  entities: ["./entity/*.ts"],
});
