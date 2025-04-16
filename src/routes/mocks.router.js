import { Router } from "express";
import { generateMockUsers } from "../utils/mocking.js";
import User from "../dao/models/User.js";
import Pet from "../dao/models/Pet.js";

const router = Router();

// Endpoint GET: Generar 50 usuarios mockeados
router.get("/mockingusers", async (req, res) => {
  try {
    const users = generateMockUsers(50);
    res.json({ status: "success", users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Endpoint POST: Generar e insertar datos en la DB
router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    // Generar usuarios y mascotas mockeadas
    const mockUsers = generateMockUsers(users);
    const mockPets = Array.from({ length: pets }, (_, i) => ({
      name: `Mascota ${i + 1}`,
      species: "Perro",
    }));

    // Insertar en MongoDB
    await User.insertMany(mockUsers);
    await Pet.insertMany(mockPets);

    res.json({ status: "success", message: `Se generaron ${users} usuarios y ${pets} mascotas.` });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/mockingpets", (req, res) => {
  res.json({ message: "Aquí irían las mascotas mockeadas" });
});

export default router;
