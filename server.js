const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 80;

app.use(express.json());
app.use(express.static(".")); // Servir arquivos estáticos (index.html, script.js, etc.)

// Ler o arquivo JSON
app.get( (req, res) => {
  try {
    const data = fs.readFileSync("./dados.json", "utf8");
    res.json(JSON.parse(data));
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao ler dados.json" });
  }
});

// Salvar os dados atualizados
app.post((req, res) => {
  try {
    fs.writeFileSync("./dados.json", JSON.stringify(req.body, null, 2));
    res.json({ message: "Dados salvos com sucesso!" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao salvar dados.json" });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));