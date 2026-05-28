import express from "express";
import conectar from "./model/db.js";
import { User } from "./model/user.js";

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ erro: "Usuário não encontrado." });
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ erro: erro.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ erro: "Usuário não encontrado." });

    res.json(user);
  } catch (error) {
    res.status(400).json({ erro: erro.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

  res.status(204).send();
});

(async () => {
  await conectar();
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
})();
