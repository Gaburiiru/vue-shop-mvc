<template>
  <v-container fill-height>
    <v-row>
      <v-col>
        <v-card class="text-center mx-auto rounded-xl" max-width="500">
          <v-container>
            <h1>Inicia sesión</h1>
            <v-row class="justify-center ma-2">
              <v-icon
                @click="(showAdmin = false), (showUser = true)"
                size="30"
                :color="showUser ? 'blue darken-2' : 'grey lighten-1'"
                class="mr-4"
                >fas fa-user</v-icon
              >
              <v-icon
                @click="(showAdmin = true), (showUser = false)"
                size="30"
                :color="showAdmin ? 'primary' : 'grey lighten-1'"
                class="ml-4"
                >fas fa-user-shield</v-icon
              >
            </v-row>
            <v-container v-if="showUser">
              <v-card class="pa-2" outlined>
                <v-btn class="mb-2" block @click="google">
                  <v-icon left dark>fab fa-google</v-icon>
                  Google
                </v-btn>
                <v-btn
                  block
                  class="white--text blue darken-4"
                  @click="facebook"
                >
                  <v-icon left dark>fab fa-facebook-f</v-icon>
                  Facebook
                </v-btn>
              </v-card>
            </v-container>
            <v-container v-if="showAdmin">
              <v-form @submit.prevent="login()">
                <v-text-field
                  v-model="userName"
                  :rules="rules"
                  :error-messages="userNameErrors"
                  label="Ingrese el nombre de administrador"
                />
                <v-text-field
                  v-model="password"
                  :append-icon="show ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  :rules="rules"
                  :type="show ? 'text' : 'password'"
                  label="Ingrese la contraseña de administrador"
                  @click:append="show = !show"
                />
                <v-btn class="primary" type="submit">
                  Entrar
                  <v-icon v-if="loggedIn">fas fa-door-open</v-icon>
                  <v-icon v-else>fas fa-door-closed</v-icon>
                </v-btn>
              </v-form>
            </v-container>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import userAdmin from "@/config/Admin.json";
import router from "@/router";
import { firebase } from "@/firebase";
import index from "@/store/index";
import products from "@/store/products";

export default {
  data() {
    return {
      show: false,
      showAdmin: false,
      showUser: true,
      userName: "",
      password: "",
      loggedIn: false,
      rules: [
        (value) => !!value || "Required.",
        (value) =>
          (value || "").length >= 6 || "Debe ingresar al menos 6 caracteres",
      ],
    };
  },
  computed: {
    userNameErrors() {
      const errors = [];
      if (!this.userName) errors.push("Ingrese el nombre de administrador");
      return errors;
    },
  },
  methods: {
    login() {
      const adminUser = userAdmin.userAdmin[0];
      if (
        this.userName === adminUser.name &&
        this.password === adminUser.pass
      ) {
        this.loggedIn = true;
        console.log("Inicio de sesión exitoso");
        this.userName = "";
        this.password = "";
        index.dispatch("setAdmin", adminUser);
        router.push({ name: "shop" });
      } else {
        this.loggedIn = false;
        console.log("Usuario inválido");
      }
    },
    google() {
      const provider = new firebase.auth.GoogleAuthProvider();
      this.access(provider);
    },
    facebook() {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.access(provider);
    },

    async access(provider) {
      firebase.auth().languageCode = "es";
      try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;

        index.dispatch("setUser", user);

        router.push({ name: "shop" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
  