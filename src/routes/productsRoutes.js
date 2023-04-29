import {Router} from "express";
import fs from "fs"; 
//import {products} from "../models/products2.js";
//rutas
const router = Router();

//query limit
router.get("/", (req,res)=>{
  const data = fs.readFileSync('./models/products.json', 'utf-8');
  const products = JSON.parse(data).products;
    const limit = parseInt(req.query.limit)||products.length;
    const resultado = products.slice(0,limit); //limit "numero de id" ingresando desde la url
    res.json( {status:"success", data:resultado} );
})

//obtener un producto en especifico
router.get('/:pid', async(req, res) => {
  const data = fs.readFileSync('./models/products.json', 'utf-8');
  const products = JSON.parse(data).products;
    try{
        const productid = await(req.params.pid);
        const seleccion = products.find(u=>u.id ==productid);
        if (seleccion){res.send(seleccion)}
        else{
            return res.status(404).json({ message: 'El producto no existe.' });
        }} 
    catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al obtener el producto.' });
    }
  });

//Crear un prodcuto
router.post('/', (req, res) => {
    const data = fs.readFileSync('./models/products.json', 'utf-8');
    const products = JSON.parse(data).products;
    const { titulo, description, price, stock, codigo, category } = req.body;
    try{
    if (typeof titulo !== 'string' || typeof description !== 'string' || typeof codigo !== 'string' || typeof category !== 'string') {
        return res.status(400).json({ error: 'El nombre, descripción, codigo y category deben ser de tipo string' });
        } // Validar de tipo string
    if (isNaN(price)) {
        return res.status(400).json({ error: 'El precio debe ser de tipo Numerico' });
        }// Validar que el precio sea de tipo Number
    if (isNaN(stock)) {
            return res.status(400).json({ error: 'El Stock debe ser de tipo Numerico' });
            }    
            
         //Obtener el último ID del arreglo products
        const lastId = products.length > 0 ? products[products.length - 1].id : 0;
        // Generar un nuevo ID sumando 1 al último ID
        const newId = Number(lastId) + 1;
        // Crear el nuevo producto con el nuevo ID y los valores validados
        const newProduct = { id: newId, titulo, description, price, stock, codigo, category, status:"true"};
        // Agregar el nuevo producto al final del arreglo products
        products.push(newProduct);
         // Escribir los datos actualizados en el archivo Cart.json
        fs.writeFileSync("./models/products.json", JSON.stringify({ products }));

        // Enviar una respuesta JSON que incluya el mensaje de éxito y el nuevo producto agregado
        res.json({ message: 'Producto creado correctamente.', product: newProduct });
    }
  
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al crear el producto.' });
      }
      });

//Actualizar un producto por ID
    router.put('/:id', async(req, res) => {
    const data = fs.readFileSync('./models/products.json', 'utf-8');
    const products = JSON.parse(data).products;
    const { id } = await(req.params);
    const { titulo, description, price, status, stock, codigo, category } = req.body;
    try{
    const productIndex = products.findIndex(p => p.id === id);// Buscar el producto correspondiente en el arreglo products
    if (productIndex === -1) {
      return res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
    }
  
    // Crear un nuevo objeto con los valores actualizados
    const updatedProduct = {
      ...products[productIndex],
      titulo: titulo || products[productIndex].titulo,
      description: description || products[productIndex].description,
      price: price || products[productIndex].price,
      status: status || products[productIndex].status,
      stock: stock || products[productIndex].stock,
      codigo: codigo || products[productIndex].codigo,
      category: category || products[productIndex].category
    };
  
    // Reemplazar el producto antiguo con el nuevo producto en el arreglo products
    products.splice(productIndex, 1, updatedProduct);
  
    // Enviar una respuesta JSON que incluya el mensaje de éxito y el producto actualizado
    res.json({ message: 'Producto actualizado correctamente.', product: updatedProduct });
    // Escribir los datos actualizados en el archivo products.json
    fs.writeFileSync("./models/products.json", JSON.stringify({ products }));

    }
    catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al actualizar el producto.' });
      }
    
  });
  
//Eliminar un producto
router.delete('/:id',async(req, res) => {
  const data = fs.readFileSync('./models/products.json', 'utf-8');
  const products = JSON.parse(data).products;
    const { id } =  await(req.params);
  try{
    // Buscar el producto correspondiente en el arreglo products
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
    return res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
    }
    // Eliminar el producto del arreglo products
    products.splice(productIndex, 1);
   // Enviar una respuesta JSON que incluya el mensaje de éxito
    res.json({ message: 'Producto eliminado correctamente.' });
    // Escribir los datos actualizados en el archivo products.json
    fs.writeFileSync("./models/products.json", JSON.stringify({ products }));

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al eliminar el producto.' });
    }
  });
  


export {router as productsRouter}