<template>
  <v-row>
    <v-col>
      <Carrusel :slides="slides" />
      <ProductsCard />
    </v-col>
  </v-row>
</template>

<script>
import ProductsCard from "../components/ProductsCard.vue";
import Carrusel from "../components/Carrusel.vue";

export default {
  name: "shop",
  data() {
    return {
      slides: [
        "Ofertas imperdibles 👀",
        "Ahorra más en cada compra 🛒",
        "Envios gratis 🚚",
        "Descuentos que te harán sonreír 😁",
        "Promociones únicas 📈",
      ],
    };
  },
  methods: {},
  components: {
    ProductsCard,
    Carrusel,
  },
};
</script>