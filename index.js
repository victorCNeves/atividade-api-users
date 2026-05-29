import express from "express";
import bcrypt from "bcrypt";
import conectar from "./model/db.js";
import { User } from "./model/user.js";
import validarBodyUsuario from "./middleware/validarBodyUsuario.js";
import erros from "./middleware/erros.js";

const app = express();
const salt = 12;

app.use(express.json());

app.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.post("/users", validarBodyUsuario, async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create(req.body);
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.put("/users/:id", validarBodyUsuario, async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select(
      "-password",
    );

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use(erros);

(async () => {
  await conectar();
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
})();
