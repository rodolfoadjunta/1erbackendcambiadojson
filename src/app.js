import express from "express";


import {cartsRouter} from "./routes/cartsRoutes.js";
import {productsRouter} from "./routes/productsRoutes.js";


const app = express ();

const port = 8080;

app.listen(port,()=>console.log(`Server listening on port ${port}`));

app.use(express.json());
//ruta de los productos
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);