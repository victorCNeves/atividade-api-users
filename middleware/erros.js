export default (error, req, res, next) => {
  if (error.name === "CastError")
    return res.status(400).json({ error: "ID inválido." });

  if (error.code === 11000)
    return res
      .status(400)
      .json({ error: { email: "Este email já está cadastrado no sistema." } });

  res.status(500).json({ error: "Ocorreu um erro inesperado no servidor." });
};
