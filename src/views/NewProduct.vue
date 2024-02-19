<template>
  <v-row class="text-center mx-auto">
    <v-col>
      <v-container>
        <AddProduct />
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
import AddProduct from "@/components/AddProduct.vue";
export default {
  name: "dashboard",
  data() {
    return {};
  },
  components: {
    AddProduct,
  },
};
</script>