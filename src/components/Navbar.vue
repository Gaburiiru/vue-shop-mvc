<template>
  <div>
    <v-card>
      <v-navigation-drawer permanent expand-on-hover app>
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img :src="userData().photo"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                {{ userData().name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list outlined dense class="mb-2">
          <v-list-item link @click="logOut">
            <v-list-item-icon>
              <v-icon>fas fa-sign-out-alt</v-icon>
            </v-list-item-icon>
            <v-list-item-title> Cerrar sesión </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list dense nav class="pa-0">
          <v-list-item
            v-for="item in visibleItems"
            :key="item.title"
            :to="item.to"
            color="primary"
            class="mx-1"
          >
            <v-list-item-icon class="mx-auto">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="mx-10">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
import index from "@/store/index";

export default {
  name: "navbar",
  data() {
    return {
      items: [
        {
          title: "Tienda",
          icon: "fas fa-store",
          to: "/",
          isAdmin: "",
        },
        {
          title: "Mis compras",
          icon: "fas fa-handshake",
          to: "/purchasesUser",
          isAdmin: false,
        },
        {
          title: "Categorias",
          icon: "fas fa-chart-pie",
          to: "/category",
          isAdmin: "",
        },
        {
          title: "Nuevo Producto",
          icon: "fas fa-plus-square",
          to: "/actionsAdmin",
          isAdmin: true,
        },
      ],
    };
  },
  computed: {
    visibleItems() {
      if (index.state.isAdmin) {
        return this.items.filter((item) => item.isAdmin || item.isAdmin === "");
      } else {
        return this.items.filter(
          (item) => !item.isAdmin || item.isAdmin === ""
        );
      }
    },
  },
  mounted() {},
  methods: {
    logOut() {
      index.dispatch("SignOff");
    },
    userData() {
      return index.state.user;
    },
  },
};
</script>