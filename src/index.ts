import { config } from 'dotenv';
import express, { Response } from "express";
import fileUpload from "express-fileupload";
import HttpStatus from "http-status-codes";
import passport from "passport";
import "reflect-metadata";
import { IAPIResponse } from "./api/v1/interfaces/IAPIResponse";
import router from "./api/v1/routes";
import { DatabaseConnection } from "./config/database_connection.config";
import { jwt_strategy } from "./config/passport.config";
const app = express();
config()
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(fileUpload());
new DatabaseConnection();
app.use(passport.initialize());

jwt_strategy(passport);

app.use("/api/v1", router);
app.use((err: Error, req, res: Response<IAPIResponse>, next) => {
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    status_code: HttpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    errors: { message: err?.message, error: "Internal Server Error" },
  });
});

let PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
