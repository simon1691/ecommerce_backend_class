import * as fs from "fs";

class CartManager {
  // Global variables
  #cartsList = [];
  #dirPath;
  #fileName;
  #fileSystem;

  // listado de carritos
  constructor(products) {
    this.products = products;

    this.#dirPath = "./files";
    this.#fileName = this.#dirPath + "/carts.json";
    this.#fileSystem = fs;
  }

  #createFolder = async () => {
    await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
    // valida si el archivo existe
    if (!this.#fileSystem.existsSync(this.#fileName)) {
      // Se crea el archivo Carts con un array vacio
      await this.#fileSystem.promises.writeFile(
        this.#fileName,
        JSON.stringify(this.#cartsList, null, 2, "\t")
      );
    }
  };

  addCart = async () => {
    try {
      await this.#createFolder();
      let cartsJSON = await this.#fileSystem.promises.readFile(
        this.#fileName,
        "utf-8"
      );

      let cartsObj = JSON.parse(cartsJSON);
      this.#cartsList = cartsObj;

      let newCart = {
        products: [],
        id: Math.floor(Math.random() * 1000 + 1)
      };

      if (this.#cartsList.find((cart) => cart.id === newCart.id)) {
        console.log("carrito ya existe");
      } else {
        this.#cartsList.push(newCart);
        await this.#fileSystem.promises.writeFile(
          this.#fileName,
          JSON.stringify(this.#cartsList, null, 2, "\t")
        );
      }
      return this.#cartsList

    } catch (error) {}
  };

  getCarts = async () => {
    try {
      await this.#createFolder();
      // llama al array del JSON para pasarselo al this.#products y asi poder mostrar los productos
      let cartsJSON = await this.#fileSystem.promises.readFile(
        this.#fileName,
        "utf-8"
      );
      let cartsObj = JSON.parse(cartsJSON);
      this.#cartsList = cartsObj;
      return this.#cartsList;
    } catch (error) {
      console.error(error);
    }
  };

  getProductsInCart = async (cartId) => {
    let id = Number(cartId);
    try {
      await this.#createFolder();
      // llama al array del JSON para pasarselo al this.#cartsList y asi poder mostrar los productos
      let cartsJSON = await this.#fileSystem.promises.readFile(
        this.#fileName,
        "utf-8"
      );
      let cartsObj = JSON.parse(cartsJSON);
      this.#cartsList = cartsObj;
      // busca el index del carrito por el id
      let findIndexCart = this.#cartsList.findIndex(cart => cart.id === id);
      // con el index capturado se actualiza el cart correspondiente al index en el cartlist
      let products = this.#cartsList[findIndexCart].products
      return products

    } catch (error) {
      console.error(error);
    }
  };

  addProductsInCart = async (productToAdd, cartId, productId )  => {
    let cartIdNumber = Number(cartId);
    let productIdNumber = Number(productId);
    let {quantity} = productToAdd
    
    try {
      let cartsJSON = await this.#fileSystem.promises.readFile(
        this.#fileName,
        "utf-8"
      );
      let cartsObj = JSON.parse(cartsJSON);
      this.#cartsList = cartsObj;
      
      // devuelve true o false si el carrito existe
      let cartExists = this.#cartsList.filter(cart => cart.id === cartIdNumber).length > 0;

      // si el carrito existe procede a buscar el id del producto para sumar la cantidad si ya existe
      // o para agregarlo al carrito si no existe
      if (cartExists) {
        let indexCart = this.#cartsList.findIndex(cart => cart.id === cartIdNumber);

        let productExists = this.#cartsList[indexCart].products.filter(product => product.id === productIdNumber).length > 0;
        let productIndex = this.#cartsList[indexCart].products.findIndex(product => product.id === productIdNumber)
        
        // si el producto existe, toma la propiedad quantity y le agrega 1
        if(productExists) {
          this.#cartsList[indexCart].products[productIndex].quantity += 1

           await this.#fileSystem.promises.writeFile(
            this.#fileName,
            JSON.stringify(this.#cartsList, null, 2, "\t")
          );
        // si el producto no existe, lo crea dentro del carrito seleccionado
        }else{
          let newProduct = {id: Number(productId), quantity: 1}
          this.#cartsList[indexCart].products.push(newProduct);

          await this.#fileSystem.promises.writeFile(
            this.#fileName,
            JSON.stringify(this.#cartsList, null, 2, "\t")
          );
        }
      }else {
        console.log('El carrito no existe por ende no se puede agregar el producto')
      }
    } catch (error) {
      console.log(error)
    }
    
  }
}

// instancia del carrito
const cartsManager = new CartManager();

export default cartsManager;
