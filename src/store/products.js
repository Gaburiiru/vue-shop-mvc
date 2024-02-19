import Vue from "vue";
import Vuex from "vuex";
import service from "@/services/products";
import { firebase, db } from "@/firebase";
import { v4 as uuidv4 } from "uuid";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    service: new service(),
    allProducts: [],
    allCategories: [],
    search: "",
    load: false,
  },
  mutations: {
    setAllProducts(state, payload) {
      state.allProducts = payload.items;
    },
    updateSearch(state, payload) {
      state.search = payload;
    },
    setAllCategories(state, data) {
      state.allCategories = data;
    },
    setLoad(state, payload) {
      state.load = payload;
    },
    setCart(state, payload) {
      state.cartUser = payload;
    },
  },
  actions: {
    loader(state, valor) {
      this.commit("setLoad", valor);
    },

    async setArrayProduct({ commit }) {
      try {
        const querySnapshot = await db.collection("cart").get();
        if (!querySnapshot.empty) {
          // Si hay documentos, obtén el primer documento y actualiza el estado
          const cart = querySnapshot.docs[0].data();
          commit("setAllProducts", cart);
        } else {
          // Si no hay documentos, crea un nuevo array de productos
          let items = await this.state.service.getAllProducts(); // Llamada a la API por medio del services
          // Guarda el nuevo array en la colección "cart"
          await db.collection("cart").doc("cartArray").set({ items });
          // Actualiza el estado con el array de Firebase
          commit("setAllProducts", { items });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async loadCartUser(state, id) {
      try {
        const data = await this.state.service.getAllCart(id);
        let cart = [];
        data[0].products.forEach((element) => {
          const filteredProduct = this.state.allProducts.find(
            (product) => product.id === element.productId
          );
          if (filteredProduct) {
            cart.push(filteredProduct);
          }
        });
        const purchases = {
          date: data[0].date,
          cart: cart,
        };
        return purchases;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async addProduct(state, product) {
      state.state.service
        .newProduct(product)
        .then((data) => {
          // Desestructura los datos del producto
          const { titulo, imagen, precio, categoria, descripcion } = data;
          // Genera un UUID único para el nuevo producto
          const newProductId = uuidv4();
          const newProduct = {
            id: newProductId,
            titulo: titulo,
            imagen: imagen,
            precio: precio,
            categoria: categoria,
            descripcion: descripcion,
          };
          const userDocRef = db.collection("cart").doc("cartArray");
          // Obtiene el array existente desde Firestore
          userDocRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                const items = doc.data().items;
                // Agrega el nuevo producto al principio del array
                items.unshift(newProduct);
                userDocRef.update({ items: items });
                console.log("Producto agregado satisfactoriamente");
                this.commit("setAllProducts", { items });
              } else {
                console.error("El documento cartArray no existe en Firestore.");
              }
            })
            .catch((error) => {
              console.error(
                "Error al obtener el documento cartArray de Firestore:",
                error
              );
            });
        })
        .catch((error) => {
          console.error("Error al transformar el producto:", error);
        });
    },

    async deleteProduct(state, id) {
      const userDocRef = db.collection("cart").doc("cartArray");
      // Si esto fuera una API real ya funcionaria y eliminaria data
      // state.state.service.deleteProduct(id).then(() => {});
      // pero como estoy usando una libreria para los ids tengo que sacar lo siguiente fuera del then() y comentarlo
      const items = state.state.allProducts.filter(
        (product) => product.id !== id
      );
      // elimino el producto de forma local actualizando el array
      this.commit("setAllProducts", { items });
      // elimino el producto de firebase actualizando el array
      userDocRef.update({
        items: items,
      });
    },

    async uploadImage(state, imagen) {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child("images/" + imagen.name);

      return imageRef
        .put(imagen)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((downloadURL) => {
          return downloadURL;
        })
        .catch((error) => {
          console.error("Error al subir la imagen:", error);
          throw error;
        });
    },

    async editProduct(state, product) {
      const userDocRef = db.collection("cart").doc("cartArray");
      const index = state.state.allProducts.findIndex(
        (productEdit) => productEdit.id === product.id
      );
      if (index >= 0) {
        let imagenUrl = null;
        if (typeof product.imagen === "string") {
          // La imagen es una URL, no es necesario subirla
          imagenUrl = product.imagen;
        } else {
          // La imagen es un objeto, subirla
          imagenUrl = await this.dispatch("uploadImage", product.imagen);
        }
        // Crea el objeto de producto actualizado
        const updatedProduct = {
          id: product.id,
          titulo: product.titulo,
          descripcion: product.descripcion,
          precio: product.precio,
          categoria: product.categoria,
          imagen: imagenUrl,
        };
        // Actualiza el array de Vuex allProducts con el producto actualizado
        state.state.allProducts.splice(index, 1, updatedProduct);
        try {
          // Actualiza el documento en Firebase con el array actualizado
          await userDocRef.update({
            items: state.state.allProducts,
          });
          console.log("Producto actualizado satisfactoriamente en Firebase");
        } catch (error) {
          console.error("Error al actualizar el producto en Firebase:", error);
        }
      } else {
        console.log("No se encontró el producto en allProducts");
      }
    },
    async getCategories(context) {
      return new Promise(async (resolve, reject) => {
        try {
          let item = await context.state.service.getAllCategories();
          context.commit("setAllCategories", item);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    searchFilter(context, payload) {
      context.commit("updateSearch", payload.toLowerCase());
    },

    async sortProductsByPrice(state, order) {
      return new Promise((resolve, reject) => {
        try {
          let sortedProducts = [...state.state.allProducts];
          sortedProducts.sort((a, b) => {
            const priceA = parseFloat(a.precio);
            const priceB = parseFloat(b.precio);

            if (order === "asc") {
              return priceA - priceB;
            } else if (order === "desc") {
              return priceB - priceA;
            }
            return 0;
          });
          state.commit("setAllProducts", { items: sortedProducts });
          resolve(true);
        } catch (error) {
          reject("F", error);
        }
      });
    },

    async getProductByCategories(context, category) {
      return new Promise((resolve, reject) => {
        try {
          // Filtrar productos por categoría
          const filteredProducts = context.state.allProducts.filter(
            (product) => product.categoria === category
          );
          // Commit a la mutación para actualizar la lista de productos filtrados
          context.commit("setAllProducts", filteredProducts);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
  getters: {
    productFilter(state) {
      let productFilter = [];
      for (let product of state.allProducts) {
        let title = (product.titulo || "").toLowerCase();
        let category = (product.categoria || "").toLowerCase();
        if (
          title.indexOf(state.search) >= 0 ||
          category.indexOf(state.search) >= 0
        ) {
          productFilter.push(product);
        }
      }
      return productFilter;
    },

    productsByCategory: (state) => (category) => {
      if (state.allProducts.length > 0) {
        return state.allProducts.filter((product) => {
          return product.categoria === category;
        });
      }
    },
  },
  modules: {},
});
