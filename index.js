import express from "express";
import conectar from "./model/db.js";
import { User } from "./model/user.js";
import bcrypt from "bcrypt";
import validarBodyUsuario from "./middleware/validarBodyUsuario.js";

const app = express();
const salt = 12;

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro inesperado no servidor." });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro inesperado no servidor." });
  }
});

app.post("/users", validarBodyUsuario, async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({
        error: { email: "Este email já está cadastrado no sistema." },
      });

    res.status(500).json({ error: error.message });
  }
});

app.put("/users/:id", validarBodyUsuario, async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(user);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({
        error: { email: "Este email já está cadastrado no sistema." },
      });

    res.status(500).json({ error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro inesperado no servidor." });
  }
});

(async () => {
  await conectar();
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
})();
