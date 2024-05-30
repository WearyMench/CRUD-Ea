import express from "express";
import morgan from "morgan";
import cors from "cors";
import { getConnection } from "./data.js";
import dotenv from "dotenv";

//Configuracion inicial
dotenv.config();
const app = express();
app.set("port", process.env.PORT);
app.listen(app.get("port"));
console.log("Escuchando comunicaciones al puerto " + app.get("port"));

//middlewares
app.use(
  cors({
    origin: ["127.0.0.1:5501", "127.0.0.1:5500", "http://localhost:5173"],
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/productos", async (req, res) => {
  try {
    const conection = await getConnection();
    const resultado = await conection.query(
      "SELECT * FROM product.listarproducto"
    );
    res.json(resultado);
  } catch (error) {
    res.json({
      message: "Something goes wrong",
    });
  }
});

app.get("/productos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const conection = await getConnection();
  const resultado = await conection.query(
    `SELECT * FROM product.listarproducto WHERE id = ${id}`
  );
  res.json(resultado);
});

app.post("/productos", async (req, res) => {
  const body = req.body;
  const conection = await getConnection();
  await conection.query(
    `INSERT INTO product.listarproducto (nombre, precio, url_imagen, deleted) VALUES ("${body.nombre}", ${body.precio}, "${body.url_imagen}", 0)`
  );
  res.json({ message: "Product added successfully" });
});

app.put("/productos/:id", async (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.id);
  const conection = await getConnection();
  const response = await conection.query(
    `UPDATE product.listarproducto SET nombre="${body.nombre}", precio=${body.precio}, url_imagen="${body.url_imagen}" WHERE id = ${id}`
  );
  if (response.affectedRows === 0) {
    res.json({ message: "Not Found" });
  } else {
    res.json(response);
  }
});

app.delete("/productos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const conection = await getConnection();
  const response = await conection.query(
    `DELETE FROM product.listarproducto WHERE id = ${id}`
  );
  if (response.affectedRows === 0) {
    res.json({ message: "Not Found" });
  } else {
    res.json({ message: "Product deleted successfully" });
  }
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "not found",
  });
});
