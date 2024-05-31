import express from "express";
import morgan from "morgan";
import cors from "cors";
import { getConnection } from "./data.js";
import dotenv from "dotenv";

//Configuracion inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.set("port", PORT);
app.listen(app.get("port"), () => {
  console.log("Escuchando comunicaciones al puerto " + app.get("port"));
});

//middlewares
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5501",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
    ],
  })
);
app.use(morgan("dev"));
app.use(express.json());

//endpoints
app.get("/productos", async (req, res) => {
  try {
    const conection = await getConnection();
    const [resultado] = await conection.query("SELECT * FROM listarproducto");
    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something goes wrong",
    });
  }
});

app.get("/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const conection = await getConnection();
    const [resultado] = await conection.query(
      "SELECT * FROM listarproducto WHERE id = ?",
      [id]
    );
    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something goes wrong",
    });
  }
});

app.post("/productos", async (req, res) => {
  try {
    const { nombre, precio, url_imagen } = req.body;
    const conection = await getConnection();
    await conection.query(
      "INSERT INTO listarproducto (nombre, precio, url_imagen, deleted) VALUES (?, ?, ?, 0)",
      [nombre, precio, url_imagen]
    );
    res.json({ message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something goes wrong",
    });
  }
});

app.put("/productos/:id", async (req, res) => {
  try {
    const { nombre, precio, url_imagen } = req.body;
    const id = parseInt(req.params.id);
    const conection = await getConnection();
    const [response] = await conection.query(
      "UPDATE listarproducto SET nombre = ?, precio = ?, url_imagen = ? WHERE id = ?",
      [nombre, precio, url_imagen, id]
    );
    if (response.affectedRows === 0) {
      res.status(404).json({ message: "Not Found" });
    } else {
      res.json({ message: "Product updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something goes wrong",
    });
  }
});

app.delete("/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const conection = await getConnection();
    const [response] = await conection.query(
      "DELETE FROM listarproducto WHERE id = ?",
      [id]
    );
    if (response.affectedRows === 0) {
      res.status(404).json({ message: "Not Found" });
    } else {
      res.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something goes wrong",
    });
  }
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "not found",
  });
});
