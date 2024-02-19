import axios from "axios";
import products from "@/models/products";
import shoppingCart from "@/models/shoppingCart";
// Aca se trabajan todas las peticiones a la api, le voy a decir que por cada item que me venga pase por mi modelo

class service {
  getAllProducts() {
    const url = "https://fakestoreapi.com/products";

    // Realiza la solicitud HTTP de tipo GET
    return axios.get(url).then(({ data }) => {
      return data.map((item) => {
        return products.fromJson(item);
      });
    });
  }

  getAllCategories() {
    const url = "https://fakestoreapi.com/products/categories";
    return axios
      .get(url)
      .then(({ data }) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  newProduct(product) {
    const url = "https://fakestoreapi.com/products/";
    let payload = {
      title: product.titulo,
      price: product.precio,
      description: product.descripcion,
      image: product.imagen,
      category: product.categoria,
    };

    // Realiza la solicitud HTTP de tipo POST
    return axios
      .post(url, payload)
      .then(({ data }) => {
        return products.fromJson(data);
      })
      .catch((error) => {
        console.error("Error in newProduct request:", error);
        // Propaga el error
        throw error;
      });
  }

  deleteProduct(id) {
    const url = `https://fakestoreapi.com/products/${id}`;

    // Realiza la solicitud HTTP de tipo DELETE
    return axios
      .delete(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
        // Propaga el error
        throw error;
      });
  }

  editProduct(id) {
    const url = `https://fakestoreapi.com/products/${id}`;

    // Realiza la solicitud HTTP de tipo PUT
    return axios
      .put(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }

  getAllCart(id) {
    const url = `https://fakestoreapi.com/carts/user/${id}`;

    // Realiza la solicitud HTTP de tipo GET
    return axios.get(url).then(({ data }) => {
      return data.map((item) => {
        return shoppingCart.fromJson(item);
      });
    });
  }
}
export default service;
