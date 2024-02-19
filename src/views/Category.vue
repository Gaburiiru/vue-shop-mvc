<template>
  <v-row class="text-center mx-auto mt-4">
    <v-container>
      <v-card class="rounded-xl pa-4 mx-auto" max-width="1000">
        <h1 class="ma-4 mb-10">Categorias</h1>
        <v-row>
          <v-col
            v-for="(item, i) in arrayCategories"
            :key="i"
            cols="12"
            md="3"
            sm="6"
          >
            <v-card
              id="card"
              class="rounded-xl"
              hover
              @click="filteredProductsForCategory(item.category), (view = true)"
            >
              <v-icon class="pa-8" size="40">{{ item.icon }}</v-icon>
              <v-card-text>{{ item.category }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <productsCategory
        :filteredProducts="filteredCategory"
        class="mt-4"
        v-if="view && !load"
      />
    </v-container>
    <v-container class="text-center" v-if="load">
      <p class="font-italic">Cargando...</p>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-container>
  </v-row>
</template>
  
  <script>
import productsCategory from "../components/ProductsCategory.vue";
import products from "@/store/products";

export default {
  name: "category",
  components: {
    productsCategory,
  },
  data() {
    return {
      load: false,
      view: false,
      selectedCategory: "",
      arrayCategories: [],
      icons: ["fas fa-laptop", "far fa-gem", "fas fa-male", "fas fa-female"],
    };
  },
  mounted() {
    products.dispatch("loader", true);
    this.load = products.state.load;
    products.dispatch("setArrayProduct").then(() => {
      products.dispatch("getCategories").then(() => {
        this.transformCategories();
        products.dispatch("loader", false);
        this.load = products.state.load;
      });
    });
  },
  computed: {
    allCategories() {
      return products.state.allCategories;
    },
    filteredCategory() {
      return products.getters.productsByCategory(this.selectedCategory);
    },
  },
  methods: {
    transformCategories() {
      this.allCategories.forEach((category, index) => {
        const iconIndex = index % this.icons.length;
        const icon = this.icons[iconIndex];
        this.arrayCategories.push({ category, icon });
      });
    },
    filteredProductsForCategory(category) {
      this.selectedCategory = category;
    },
  },
};
</script>

<style>
#card:hover {
  background-color: aliceblue;
}
</style>