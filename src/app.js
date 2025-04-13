import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import logger from "./utils/logger.js";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";

// Configurar dotenv y __dirname
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => logger.info("✅ Conectado a MongoDB"))
  .catch((error) => logger.error(`❌ Error al conectar a MongoDB: ${error}`));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API de Adopciones",
      description: "Documentación de la API del proyecto",
    },
  },
  apis: [path.join(__dirname, "/docs/*.yaml")],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

// Endpoint de prueba para logs
app.get("/loggerTest", (req, res) => {
  logger.debug("Este es un mensaje debug");
  logger.http("Este es un mensaje http");
  logger.info("Este es un mensaje info");
  logger.warning("Este es un mensaje warning");
  logger.error("Este es un mensaje error");
  logger.fatal("Este es un mensaje fatal");

  res.send("Logs enviados a la consola y al archivo 'errors.log'");
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ status: "error", message: "Algo salió mal" });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
