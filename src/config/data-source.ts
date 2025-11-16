import "reflect-metadata";
import { DataSource } from "typeorm";

// conexão com o banco de dados MySQL
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "senha",
    database: "NotaDez",
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
})


