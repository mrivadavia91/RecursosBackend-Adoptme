import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export const generateMockUsers = (numUsers = 1) => {
  return Array.from({ length: numUsers }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("coder123", 10), // Contraseña encriptada
    role: faker.helpers.arrayElement(["user", "admin"]), // Aleatorio entre "user" y "admin"
    pets: [],
  }));
};
