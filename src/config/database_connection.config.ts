import mongoose from "mongoose";

export class DatabaseConnection {
  constructor() {
    this.createConnection();
  }
  connection: mongoose.Connection;
  private createConnection = () => {
    if (this.connection) return this.connection;
    else {
      mongoose.connect(process.env.CONNECTION_STRING ?? "");
      this.connection = mongoose.connection;
      this.connection.once("open", async () => {
        console.log("Connected to database");
      });
      this.connection.on("error", () => {
        console.log("Error connecting to database");
      });

      return this.connection;
    }
  };
}
