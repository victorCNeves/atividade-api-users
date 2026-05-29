export default async (req, res, next) => {
  const { name, email, password } = req.body;
  const erros = {};

  if (!name || name.trim() === "") {
    erros.name = "O nome é obrigatório.";
  }

  const emailRegex = /^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || email.trim() === "") {
    erros.email = "O e-mail é obrigatório.";
  } else if (!email.match(emailRegex)) {
    erros.email = "Insira um e-mail válido.";
  }

  if (!password || password.trim() === "") {
    erros.password = "A senha é obrigatória.";
  } else if (password.length < 8) {
    erros.password = "A senha deve conter no mínimo 8 caracteres.";
  }

  if (Object.keys(erros).length > 0) {
    return res.status(400).json({ errors: erros });
  }

  next();
};
