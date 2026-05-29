export default async (req, res, next) => {
  const { name, email, password } = req.body;
  const erros = {};

  if (typeof name !== "string") {
    erros.name = "O nome deve ser um texto.";
  } else if (name.trim() === "") {
    erros.name = "O nome é obrigatório.";
  }

  const emailRegex = /^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (typeof email !== "string") {
    erros.email = "O e-mail deve ser um texto.";
  } else if (email.trim() === "") {
    erros.email = "O e-mail é obrigatório.";
  } else if (!email.match(emailRegex)) {
    erros.email = "Insira um e-mail válido.";
  }

  if (typeof password !== "string") {
    erros.password = "A senha deve ser um texto.";
  } else if (password === "") {
    erros.password = "A senha é obrigatória.";
  } else if (password.length < 8) {
    erros.password = "A senha deve conter no mínimo 8 caracteres.";
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({ errors: erros });
  }

  next();
};
