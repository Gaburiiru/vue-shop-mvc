<template>
  <v-card elevation="10">
    <v-speed-dial
      v-model="fab"
      :bottom="bottom"
      :right="right"
      :left="left"
      :top="top"
      :direction="direction"
      :open-on-hover="hover"
      :transition="transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          :class="fab ? 'red darken-2' : 'blue darken-2'"
          dark
          fab
          class="fixed-btn"
        >
          <v-icon v-if="fab">fas fa-times</v-icon>
          <v-icon v-else>fas fa-shopping-cart</v-icon>
          <v-badge
            v-show="view"
            color="green"
            :content="countCart()"
            style="position: absolute; top: 0px; left: 0px"
          />
        </v-btn>
      </template>
      <v-list
        dense
        rounded
        id="list"
        class="position-list rounded-xl"
        outlined
        :class="{ 'scrollable-list': cartArrayProp.length > 5 }"
      >
        <div class="list-color rounded-xl">
          <v-subheader>Productos</v-subheader>
          <v-divider></v-divider>
          <v-list-item
            v-for="(item, i) in cartArrayProp"
            :key="i"
            class="list-item"
          >
            <v-container>
              <v-row class="d-flex justify-space-between">
                <v-col>
                  <v-img
                    width="20px"
                    class="my-auto d-flex justify-center"
                    :src="item.product.imagen"
                  />
                </v-col>
                <v-col class="wrap d-flex">
                  <p class="my-auto">{{ item.product.titulo }}</p>
                </v-col>
                <v-col class="d-flex justify-center">
                  <p class="my-auto">{{ item.cant }}</p>
                </v-col>
                <v-col class="d-flex justify-center">
                  <p class="my-auto">${{ item.product.precio }}</p>
                </v-col>
                <v-col class="d-flex justify-center">
                  <v-icon @click="removeItem(i)">fas fa-trash-alt</v-icon>
                </v-col>
              </v-row>
            </v-container>
          </v-list-item>
        </div>
        <p class="ma-2">
          TOTAL: <strong>{{ total }}</strong>
        </p>
        <v-btn color="success" rounded outlined @click="buyCart(cartArrayProp)"
          >Comprar</v-btn
        >
      </v-list>
    </v-speed-dial>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    direction: "top",
    fab: false,
    fling: false,
    hover: false,
    tabs: null,
    right: true,
    bottom: true,
    left: false,
    top: false,
    transition: "scale-transition",
    cantNumber: 0,
    view: false,
  }),
  computed: {
    total() {
      return this.totalCartProp;
    },
  },
  props: {
    cartArrayProp: {
      type: Array,
    },
    totalCartProp: {
      type: String,
    },
  },
  methods: {
    countCart() {
      if (this.cartArrayProp.length > 0) {
        this.cantNumber = this.cartArrayProp.length;
        this.view = true;
      } else {
        this.view = false;
      }
      return this.cantNumber;
    },
    removeItem(index) {
      const currentItem = this.cartArrayProp[index];
      // Verifica si la cantidad es cero antes de eliminar el elemento
      if (currentItem.cant === 1) {
        this.$emit("remove-item", index);
      } else if (currentItem.cant > 1) {
        // Si la cantidad es mayor que 1, simplemente resta 1
        currentItem.cant--;
      }
    },

    buyCart(products) {
      if (this.total > 0) {
        const booleanData = true;
        this.$emit("purchase", booleanData);
      }
    },
  },
};
</script>

<style scoped>
.fixed-btn {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
.position-list {
  position: fixed;
  bottom: 80px;
  right: 16px;
}
.wrap {
  white-space: nowrap;
  overflow: hidden;
  margin-left: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.scrollable-list {
  max-height: 400px;
  overflow-y: auto;
}

#list {
  width: 25%;
}
@media screen and (max-width: 1000px) {
  #list {
    width: 40%;
  }
}
@media screen and (max-width: 600px) {
  #list {
    width: 70%;
  }
}

.list-color:hover {
  background-color: rgb(245, 251, 255);
}
.list-item:hover {
  background-color: rgb(217, 237, 255);
}
</style>