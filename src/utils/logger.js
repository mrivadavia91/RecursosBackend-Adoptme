import winston from "winston";

// Definir niveles de logs
const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

// Crear transportes
const transports = {
  console: new winston.transports.Console({
    format: winston.format.simple(),
  }),
  file: new winston.transports.File({
    filename: "errors.log",
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
};

// Configurar el logger según el entorno
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: process.env.NODE_ENV === "production"
    ? [transports.console, transports.file]
    : [transports.console],
});

export default logger;
