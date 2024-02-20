<template>
  <v-dialog v-model="view" v-if="viewModalProp !== null" persistent>
    <v-card rounded="lg">
      <v-container>
        <v-card-title class="text-h5 grey lighten-2 d-flex justify-center mb-4">
          Ups! debe iniciar sesion para poder comprar
        </v-card-title>
        <v-row class="justify-space-around pa-2">
          <v-btn color="red" class="white--text" rounded @click="cancel()">cancelar</v-btn>
          <v-btn color="green" class="white--text" rounded @click="login()">iniciar sesion</v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
  
  <script>
import router from "@/router";
export default {
  data() {
    return {
      view: false,
    };
  },
  methods: {
    login() {
      router.push("/login");
    },
    cancel() {
      this.$emit("viewModalChanged", false);
    },
  },
  props: {
    viewModalProp: {
      type: Boolean,
      default: null,
    },
  },
  watch: {
    viewModalProp: function (newVal) {
      if (newVal !== null) {
        this.view = newVal;
      }
    },
  },
};
</script>
  