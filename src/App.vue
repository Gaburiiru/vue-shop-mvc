<template>
  <v-app>
    <Navbar v-if="isLoged() !== ''"/>
    <v-main class="grey lighten-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import index from "@/store/index";
import Navbar from "./components/Navbar.vue";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data: () => ({
    //
  }),
  methods: {
    isLoged() {
      return index.state.user;
    },
  },
};
</script>
