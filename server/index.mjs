import express from 'express';
import mysql from 'mysql2'; // Si necesitas usar MySQL en el futuro
import usersRouter from './routes/user.mjs';
import cookieParser from "cookie-parser";
const app = express();

// Middleware para manejar JSON
app.use(express.json());
app.use(cookieParser());
app.use(usersRouter);





// Inicia el servidor en el puerto 3001
app.listen(3001, () => { 
    console.log("Servidor corriendo en el puerto 3001");
});