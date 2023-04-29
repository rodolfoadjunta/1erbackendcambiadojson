import { Router } from "express";
//import { products } from "../models/products.js";
//import { carts } from "../models/carts.json";
import fs from "fs"; 
// Rutas
const router = Router();

//solicitud POST para crear un nuevo carrito
router.post("/", async (req, res) => {
  const { products } = req.body;
  try {
    // Verificar que los productos se hayan proporcionado y sean un array
    if (!products || !Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar una lista de productos" });
    }
    // Verificar que los productos sean objetos con propiedades "id" y "quantity"
    for (const product of products) {
      if (!product.id || !product.quantity) {
        return res
          .status(400)
          .json({ error: "Cada producto debe tener un id y una cantidad" });
      }
    }

    // Leer los datos del archivo Cart.json
    const data = fs.readFileSync("./models/carts.json", "utf-8");
    const carts = JSON.parse(data).carts;

    // Obtener el último carrito creado
    const lastCart = carts[carts.length - 1];
    // Crear el nuevo id consecutivo
    let newId;
    if (!lastCart) {
      // Si no hay carritos previos, crear el primer carrito con ID 1
      newId = "1";
    } else {
      // Si hay carritos previos, crear un nuevo ID sumando 1 al último ID
      const lastId = parseInt(lastCart.id);
      newId = (lastId + 1).toString();
    }
    // Verificar que no exista un carrito con el mismo id
    if (carts.some((cart) => cart.id === newId)) {
      return res
        .status(400)
        .json({ error: "Ya existe un carrito con este id" });
    }
    // Crear el nuevo carrito y agregarlo al arreglo de carritos
    const newCart = { id: newId, products };
    carts.push(newCart);

    // Escribir los datos actualizados en el archivo Cart.json
    fs.writeFileSync("./models/carts.json", JSON.stringify({ carts }));

    // Cambiar la respuesta que se envía en el caso de éxito
    res.status(201).json({
      message: "Carrito creado",
      data: {
        id: newCart.id,
        products: newCart.products.map(product => ({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          price: product.price
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al crear el carrito." });
  }
});


//agregar un producto a un carrito existente
router.post('/:id/productoagre', async (req, res) => {
  const data = fs.readFileSync('./models/carts.json', 'utf-8');
  const carts = JSON.parse(data).carts;
  const { id, quantity } = req.body;
  const cartId = req.params.id;
  try {
    // Buscar el carrito por su id
    const cart = carts.find(cart => cart.id == Number(cartId));
    // Si no se encuentra el carrito, devolver un error
    if (!cart) {
      return res.status(404).json({ error: 'El carrito no existe' });
    }
    // Buscar el producto en el carrito
    const productIndex = cart.products.findIndex(product => product.id == id);
    // Si no se encuentra el producto, agregarlo al carrito
    if (productIndex === -1) {
      const newProduct = { id: id, quantity: Number(quantity) };
      cart.products.push(newProduct);
    } else { // Si se encuentra el producto, actualizar la cantidad
      const product = cart.products[productIndex];
      product.quantity += Number(quantity);
    }
    res.status(200).json({ message: 'Producto agregado al carrito', data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al agregar el producto al carrito' });
  }
});

 //Trae los carritos que seleccione con el numero de identificacion

 router.get('/:cid', async (req, res) => {
  const data = fs.readFileSync('./models/carts.json', 'utf-8');
  const carts = JSON.parse(data).carts;
  try {
    const cartsid = req.params.cid;
    const seleccion = carts.find(u => u.id == cartsid);
    if (seleccion) {
      res.send(seleccion);
    } else {
      return res.status(404).json({ message: 'El carrito no existe.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al obtener el carrito.' });
  }
});

//traer todos los carritos
router.get('/', async (req, res) => {
  try {
    // Leer los datos del archivo carts.json
    const data = fs.readFileSync('./models/carts.json', 'utf-8');
    const carts = JSON.parse(data).carts;
    // Enviar los carritos como respuesta
    res.send(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al obtener los carritos.' });
  }
});

//Agrega producto al carrito por identificacion
router.post('/:cid/product/:pid', async (req, res) => {
  const data = fs.readFileSync('./models/carts.json', 'utf-8');
  const carts = JSON.parse(data).carts;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  try {
    // Buscar el carrito por su id
    const cartIndex = carts.findIndex(cart => cart.id == Number(req.params.cid));
    // Si no se encuentra el carrito, devolver un error
    if (cartIndex === -1) {
      return res.status(404).json({ error: 'El carrito no existe' });
    }
    // Buscar el producto en el carrito
    const productIndex = carts[cartIndex].products.findIndex(product => product.id == Number(productId));
    // Si no se encuentra el producto, agregarlo al carrito
    if (productIndex === -1) {
      const newProduct = { id: Number(productId), quantity: Number(quantity) };
      carts[cartIndex].products.push(newProduct);
    } else { // Si se encuentra el producto, actualizar la cantidad
      carts[cartIndex].products[productIndex].quantity += Number(quantity);
    }
    fs.writeFileSync("./models/carts.json", JSON.stringify({ carts }))
    res.status(200).json({ message: 'Producto agregado al carrito', data: carts[cartIndex] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al agregar el producto al carrito' });
  }
});

export { router as cartsRouter };
