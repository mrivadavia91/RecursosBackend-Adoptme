import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js"; // Importamos el logger

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a MongoDB
mongoose
  .connect(`URL DE MONGO`)
  .then(() => logger.info("✅ Conectado a MongoDB"))
  .catch((error) => logger.error(`❌ Error al conectar a MongoDB: ${error}`));

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

// Endpoint para probar los logs
app.get("/loggerTest", (req, res) => {
  logger.debug("Este es un mensaje debug");
  logger.http("Este es un mensaje http");
  logger.info("Este es un mensaje info");
  logger.warning("Este es un mensaje warning");
  logger.error("Este es un mensaje error");
  logger.fatal("Este es un mensaje fatal");

  res.send("Logs enviados a la consola y al archivo 'errors.log'");
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(` Servidor corriendo en http://localhost:${PORT}`);
});




