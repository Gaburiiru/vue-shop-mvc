<template>
  <v-card class="rounded-xl mx-auto" max-width="1000" hover>
    <v-container>
      <v-list rounded dense class="rounded-xl">
        <v-col class="pa-0">
          <v-row class="justify-space-between font-italic">
            <v-col>
              <v-row class="justify-center pa-4">
                <h2>{{ updateNameCategory() }}</h2>
                <v-badge color="accent" :content="updateCantProduct()" />
              </v-row>
              <div id="list" class="pa-2 rounded-xl">
                <v-list-item
                  v-for="(product, index) in filteredProducts"
                  :key="index"
                  id="list-item"
                  link
                >
                  <v-list-item-content class="rounded-xl pl-4 pr-4">
                    <v-list-item-title
                      class="font-weight-medium blue-grey--text"
                    >
                      {{ product.titulo }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ product.descripcion }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-list>
    </v-container>
  </v-card>
</template>
  
  <script>
export default {
  props: {
    filteredProducts: {
      type: Array,
    },
  },
  data() {
    return {
      cantProduct: 0,
      nameCategoty: "",
    };
  },
  methods: {
    updateNameCategory() {
      return this.filteredProducts[0].categoria;
    },
    updateCantProduct() {
      return this.filteredProducts.length;
    },
  },
};
</script>

<style>
#list:hover {
  background-color: rgb(245, 251, 255);
}
#list-item:hover {
  background-color: aliceblue;
}
</style>