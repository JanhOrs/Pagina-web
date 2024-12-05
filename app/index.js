import express from "express";
//Fix para _dirname
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authentication } from "./controllers/authentication.controller.js";

//Server
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en puerto", app.get("port"));

//Configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json());

//Rutas
app.get("/",(req,res)=>res.sendFile(__dirname + "/pages/index.html"))
app.get("/register",(req,res)=>res.sendFile(__dirname + "/pages/register.html"))
app.get("/login",(req,res)=>res.sendFile(__dirname + "/pages/login.html"))
app.get("/accesorios",(req,res)=>res.sendFile(__dirname + "/pages/accesorios.html"))
app.get("/carrito",(req,res)=>res.sendFile(__dirname + "/pages/carrito.html"))
app.get("/hombre",(req,res)=>res.sendFile(__dirname + "/pages/hombre.html"))
app.get("/mujer",(req,res)=>res.sendFile(__dirname + "/pages/mujer.html"))
app.get("/sobrenosotros",(req,res)=>res.sendFile(__dirname + "/pages/sobrenosotros.html"))
app.get("/tallas",(req,res)=>res.sendFile(__dirname + "/pages/tallas.html"))
app.get("/tienda",(req,res)=>res.sendFile(__dirname + "/pages/tienda.html"))
app.get("/favorito",(req,res)=>res.sendFile(__dirname + "/pages/favoritos.html"))
app.post("api/register", authentication.register);
app.post("api/login", authentication.login);
