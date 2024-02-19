<template>
  <v-row class="text-center mx-auto mt-4">
    <v-container>
        <v-card class="rounded-xl pt-4 pa-0 ma-0 mx-auto" max-width="1000" hover>
          <h1 class="ma-4 mb-10">Mis compras</h1>
          <!-- loader -->
          <v-container class="text-center" v-if="load">
            <p class="font-italic">Cargando...</p>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-container>
          <!-- Lista de compras -->
          <v-list id="list" rounded dense class="rounded-xl" v-if="!load">
            <v-container class="pa-0 pb-1">
              <v-col>
                <v-row class="justify-space-between">
                  <v-col class="">
                    <p class="body-2 text-center my-0 font-weight-medium">
                      FECHA
                    </p>
                  </v-col>
                  <v-col class="">
                    <p class="body-2 text-center my-0 font-weight-medium">
                      CANTIDAD
                    </p>
                  </v-col>
                  <v-col class="">
                    <p class="body-2 text-center my-0 font-weight-medium">
                      TOTAL
                    </p>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider />
            </v-container>
            <v-list-item
              link
              id="list-item"
              v-for="(item, index) in userInfo"
              :key="index"
              class="rounded-xl ma-1 font-italic"
              @click="selectedDetail(item)"
            >
              <v-container>
                <v-row class="justify-space-between">
                  <v-col class="my-auto">
                    <p
                      class="body-2 text-center text-capitalize mb-0 font-weight-medium blue-grey--text"
                    >
                      {{ item.date }}
                    </p>
                  </v-col>
                  <v-col class="my-auto ma-0">
                    <p
                      class="body-2 text-center text-capitalize mb-0 font-weight-medium blue-grey--text"
                    >
                      {{ item.cart.length }}
                    </p>
                  </v-col>
                  <v-col class="my-auto ma-0">
                    <p
                      class="body-2 text-center text-capitalize mb-0 font-weight-medium blue-grey--text"
                    >
                      ${{ calculatedAmount(item.cart) }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item>
          </v-list>
        </v-card>
        <v-dialog v-if="dialog" v-model="dialog" width="500" persistent>
          <v-container class="pa-0 ma-0">
            <v-card class="rounded-lg">
              <v-list dense class="rounded-xl">
                <v-row class="justify-space-between font-italic pa-0 ma-0">
                  <v-col class="pa-0 ma-0">
                    <v-subheader class="justify-center font-weight-bold"
                      >Detalle de compra</v-subheader
                    >
                    <div class="pa-2 rounded-xl">
                      <v-list-item
                        v-for="(product, index) in products"
                        :key="index"
                      >
                        <v-list-item-icon>
                          <v-img
                            width="20px"
                            class="my-auto d-flex justify-center"
                            :src="product.imagen"
                          />
                        </v-list-item-icon>
                        <v-list-item-content class="rounded-xl pl-4 pr-4">
                          <v-list-item-title
                            class="font-weight-medium blue-grey--text"
                          >
                            {{ product.titulo }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            ${{ product.precio }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-col>
                </v-row>
              </v-list>
              <v-container class="d-flex justify-center">
                <v-btn class="rounded-xl" small color="error" @click="dialog=false">cerrar</v-btn>
              </v-container>
              
            </v-card>
          </v-container>
        </v-dialog>
      
    </v-container>
  </v-row>
</template>

<script>
import index from "@/store/index";
import products from "@/store/products";
export default {
  name: "purchasesUser",
  data() {
    return {
      userInfo: [],
      load: false,
      dialog: false,
      products: [],
    };
  },
  methods: {
    calculatedAmount(cart) {
      let amount = 0;
      cart.forEach((product) => {
        amount += parseFloat(product.precio);
      });
      return amount;
    },

    selectedDetail(item) {
      let cart = [];
      item.cart.forEach((element) => {
        cart.push(element);
      });
      this.products = cart;
      this.dialog = true;
    },
  },
  async mounted() {
    products.dispatch("loader", true);
    this.load = products.state.load;
    const user = this.userData;
    if (user) {
      try {
        this.userInfo = await index.dispatch("getCartFirebase");
        products.dispatch("loader", false);
        this.load = products.state.load;
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
        throw error;
      }
    } else {
      index.dispatch("getUser").then(async () => {
        try {
          this.userInfo = await index.dispatch("getCartFirebase");
          products.dispatch("loader", false);
          this.load = products.state.load;
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
          throw error;
        }
      });
    }
  },
  computed: {
    userData() {
      return index.state.user;
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