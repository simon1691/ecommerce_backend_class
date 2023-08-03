import * as fs from 'fs';

class ProductManager {
  // listado de productos
  #products = [];
  #dirPath;
  #fileName;
  #fileSystem;

  // constructor de objecto
  constructor(title, description, price, thumbnail, code, stock, status, category) {
    (this.title = title),
    (this.description = description),
    (this.price = price),
    (this.thumbnail = thumbnail),
    (this.code = code),
    (this.stock = stock),
    (this.status = status),
    (this.category = category)

    this.#dirPath = "./src/files";
    this.#fileName = this.#dirPath + "/products.json";
    this.#fileSystem = fs;
  }

  // Methods addProduct, getProducts, getProductById
  //createFolder crear el folder files y el pruducts file, ademas
  // valida que el producto file no exista, si no existe lo crea

  #createFolder = async () => {
    await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
    // valida si el archivo existe
    if (!this.#fileSystem.existsSync(this.#fileName)) {
      // Se crea el archivo products con un array vacio
      await this.#fileSystem.promises.writeFile(
        this.#fileName,
        JSON.stringify(this.#products, null, 2, "\t")
      );
    }
  };

  // addProduct permite agregar un producto que no este en el array products
  // ademas permite agregar un id incremental basado en la longitud del array products
  addProduct = async (productToAdd) => {
    try {
      await this.#createFolder();
      // Esto llama al json (en donde se estan guardando los productos)
      // lo convierte en objeto y se lo pasa al this.produtc, para de esa manera, poder usar el lenght del arrray y general el id
      let productsJSON = await this.#fileSystem.promises.readFile(
        this.#fileName,
        "utf-8"
      );
      let productsObj = JSON.parse(productsJSON);
      this.#products = productsObj;

      let newProduct = {
        ...productToAdd,
        id: Math.floor(Math.random() * 1000 + 1), // El id empieza en 1 no en 0
      };
      // verifica si el array products esta vacio para agegar el primer producto
      // si no esta vacio entonces verifica que el producto no exista y lo agrega, ademas devuelve por consola
      // un error que informa que el producto ya existe
      if (this.#products.find((product) => product.code == newProduct.code)) {
        console.log("producto ya existe");
      } else {
        this.#products.push(newProduct);
        await this.#fileSystem.promises.writeFile(
          this.#fileName,
          JSON.stringify(this.#products, null, 2, "\t")
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  // getProducts devuelve la lista de productos
  getProducts = async () => {
    try {
      await this.#createFolder();
      // llama al array del JSON para pasarselo al this.#products y asi poder mostrar los productos
      let productsJSON = await this.#fileSystem.promises.readFile(
        this.#fileName,
        "utf-8"
      );
      let productsObj = JSON.parse(productsJSON);
      this.#products = productsObj;
      return this.#products;
    } catch (error) {
      console.error(error);
    }
  };

  // getProductById permite buscar y devolver el producto mediante el id
  getProductById = async (idProduct) => {
    let id = Number(idProduct)
    let productsJSON = await this.#fileSystem.promises.readFile(
      this.#fileName,
      "utf-8"
    );
    let productsObj = JSON.parse(productsJSON);
    this.#products = productsObj;

    // recorre el arrays products comparando los ids de cada producto con el id pasado como parametro
    let productById = this.#products.find((product) => product.id === id);
    return productById
  };

  // updateProduct permite actualizar los datos del producto usando el id como referencia
  updateProduct = async (idProduct, productToUpdate) => {
    let id = Number(idProduct)
    try {
      let productsJSON = await this.#fileSystem.promises.readFile( this.#fileName, "utf-8" );
      let productsObj = JSON.parse(productsJSON);
      this.#products = productsObj;

      // evalua si el producto existe y devuelve su index
      let productIndex = this.#products.findIndex((product) => product.id === id );

      // evalua si el index es mayor o igual a 0, toma el valor del index devuelto y lo pasa a la lista de productos
      // para identificar el producto a actualizar y posteriormente actualizarlo, ademas evalua si el id del producto se esta intentando
      // actualizar para evitarlo
      if(productIndex >= 0 && id === productToUpdate.id ){
        this.#products[productIndex] = {...productToUpdate, id:id}
      }else{
        console.log("El producto no existe, o el esta intentando actualizar el id del producto")
      }

      await this.#fileSystem.promises.writeFile(
        this.#fileName,
        JSON.stringify(this.#products, null, 2, "\t")
      );
    } catch (error) {
      console.error(error);
    }
  };

  deleteProduct = async (idProduct) => {
    let id = Number(idProduct)
    try {
      let productsJSON = await this.#fileSystem.promises.readFile(
        this.#fileName,
        "utf-8"
      );
      let productsObj = JSON.parse(productsJSON);
      this.#products = productsObj;

      // verifica si el producto existe
      let productExist = this.#products.find((product) => product.id === id);

      // si existe el producto recorre el array products validando que el id exista
      // para asi tomar su index y usar el metodo splice y borrarlo del array
      if (productExist) {
        let productIndex = this.#products.findIndex(
          (product) => product.id === id
        );
        this.#products.splice(productIndex, 1);
      }
      await this.#fileSystem.promises.writeFile(
        this.#fileName,
        JSON.stringify(this.#products, null, 2, "\t")
      );
    } catch (error) {
      console.error(error);
    }
  };
}
// instancia el producto
const productManager = new ProductManager();

export default productManager;
