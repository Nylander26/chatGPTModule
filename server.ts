import express from "express";
import cors from "cors";
import chatGPTRouter from "./routes/chatGPT.routes";

class Server {
  private app;
  private port: string;
  private apiPaths = { gpt: "/gpt" };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "7777";
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors()); 
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.apiPaths.gpt, chatGPTRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
