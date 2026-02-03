import "module-alias/register";

import express, { Response, Request } from "express";
import dotenv from "dotenv";
import createRouter from "express-file-routing";
import { securityMiddleware } from "./middlewares/security";
import { errorHandler } from "./middlewares/errorHandler";
import { config } from "./config";
import path from "path";
import fileUpload from "express-fileupload";
import { connectWebSocket } from "./websocket";

const main = async () => {
  process.title = "Todos API";
  dotenv.config();

  const app = express();
  const router = express.Router();
  
  app.use(
    fileUpload({
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for large Excel files
      abortOnLimit: true,
      useTempFiles: false,
    })
  );
  
  app.use(securityMiddleware);
  app.use(
    "/storage/uploads",
    express.static(path.join(process.cwd(), "storage/uploads"))
  );

  await createRouter(router, {
    directory: path.join(__dirname, "routes"),
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", router);

  app.use(errorHandler);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World" });
  });

  // connectWebSocket();

  app.listen(config.port, () =>
    console.log(`🚀 Server running on http://localhost:${config.port}`)
  );
};

main();
