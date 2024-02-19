import Vue from "vue";
import Vuex from "vuex";
import { firebase, auth, db } from "@/firebase";
import router from "@/router/index";
import products from "@/store/products";
import moment from "moment";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAdmin: false,
    user: "",
    formValid: false,
    valueFields: {
      cardName: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
      cardCvv: "",
    },
  },
  mutations: {
    newUser(state, payload) {
      if (payload === null) {
        state.user = "";
      } else {
        state.user = payload;
      }
    },
    setIsAdmin(state, payload) {
      state.isAdmin = payload;
    },
    setUpdateForm(state, payload) {
      state.formValid = payload;
    },
    setUpdateCard(state, payload) {
      state.valueFields = payload;
    },
  },
  actions: {
    submitForm({ state }) {
      console.log(state.formData);
    },

    async addCart(state, products) {
      const date = new Date()
      const cart = [];
      products.forEach((producto) => {
        for (let i = 0; i < producto.cant; i++) {
          cart.push(producto.product);
        }
      });
      const objetProduct = {
        cart: cart,
        date: moment(date).utc().format("DD/MM/YYYY"),
      };
      const userDocRef = db.collection("users").doc(state.state.user.uid);
      try {
        await userDocRef.update({
          cart: firebase.firestore.FieldValue.arrayUnion(objetProduct),
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getUser() {
      return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            try {
              await this.dispatch("setUser", user);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        });
      });
    },

    async setUser({ commit }, user) {
      try {
        const doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
          // Si el documento existe, actualiza el estado
          const userData = doc.data();
          commit("newUser", userData);
          commit("setIsAdmin", false);
        } else {
          const randomNumber = Math.floor(Math.random() * 4) + 1;
          const cart = await products.dispatch("loadCartUser", randomNumber);
          // console.log(cart);
          // Si el documento no existe, crea un nuevo usuario en Firestore
          const userNew = {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            photo: user.photoURL,
            cart: [cart],
          };
          console.log(userNew);
          await db.collection("users").doc(userNew.uid).set(userNew);
          // Actualiza el estado con los nuevos datos del usuario
          commit("newUser", userNew);
          commit("setIsAdmin", false);
        }
      } catch (error) {
        console.log(error);
      }
    },
    SignOff({ commit }) {
      auth.signOut();

      localStorage.setItem("isAdmin", false);
      commit("setIsAdmin", false);
      commit("newUser", null);
      router.push("/login");
    },
    setAdmin({ commit }, userData) {
      commit("newUser", userData);
      commit("setIsAdmin", true);
      localStorage.setItem("isAdmin", true);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userPhoto", userData.photo);
    },
    initializeAdminSession({ commit }) {
      const isAdmin = localStorage.getItem("isAdmin");
      const userName = localStorage.getItem("userName");
      const userPhoto = localStorage.getItem("userPhoto");

      if (isAdmin === "true") {
        commit("setIsAdmin", true);
        commit("newUser", { name: userName || "", photo: userPhoto || "" });
      }
    },

    async getCartFirebase(state) {
      try {
        const userDoc = await db
          .collection("users")
          .doc(state.state.user.uid)
          .get();
        // Verificar si el documento existe
        if (userDoc.exists) {
          return userDoc.data().cart;
        } else {
          console.log("El usuario no tiene un documento en Firestore.");
          return null;
        }
      } catch (error) {
        console.error("Error al obtener el carrito del usuario:", error);
        throw error;
      }
    },
  },
  getters: {},
  modules: {},
});
