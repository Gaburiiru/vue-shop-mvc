<template>
  <v-card class="rounded-xl mx-auto" max-width="1000">
    <v-container>
      <v-row>
        <v-col>
          <h1 class="ma-4 mb-10">Agregar un producto</h1>
          <v-stepper v-model="e6" vertical class="rounded-xl" outlined>
            <v-stepper-step :complete="e6 > 1" step="1" color="primary">
              Ingresa un nombre
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card class="pa-2" outlined>
                <v-text-field
                  @keyup="() => validate(name)"
                  v-model="name"
                  label="Nombre del producto"
                  outlined
                  :rules="[rules.required, rules.min]"
                ></v-text-field>
                <v-row class="pa-4 justify-space-between">
                  <v-btn
                    color="primary"
                    rounded
                    :disabled="disabled"
                    @click="e6++, (disabled = true), validatePrice(price)"
                  >
                    Continuar
                  </v-btn>
                </v-row>
              </v-card>
            </v-stepper-content>

            <v-stepper-step :complete="e6 > 2" step="2" color="primary">
              Ingresa un precio
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card class="pa-2" outlined>
                <v-text-field
                  @keyup="() => validatePrice(price)"
                  v-model="price"
                  :rules="[rules.required]"
                  outlined
                  label="Precio"
                  prefix="$"
                ></v-text-field>
                <v-row class="pa-4 justify-space-between">
                  <v-btn
                    color="primary"
                    @click="e6++, (disabled = true), validate(description)"
                    :disabled="disabled"
                    rounded
                  >
                    Continuar
                  </v-btn>
                  <v-btn
                    text
                    rounded
                    class="error"
                    @click="e6--, (disabled = false)"
                  >
                    Volver
                  </v-btn>
                </v-row>
              </v-card>
            </v-stepper-content>

            <v-stepper-step :complete="e6 > 3" step="3" color="primary">
              Ingresa una descripcion
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card class="pa-2" outlined>
                <v-textarea
                  @keyup="() => validate(description)"
                  v-model="description"
                  outlined
                  :rules="[rules.required, rules.min]"
                  label="Descripcion del producto"
                  counter
                  maxlength="200"
                  full-width
                  single-line
                ></v-textarea>
                <v-row class="pa-4 justify-space-between">
                  <v-btn
                    color="primary"
                    :disabled="disabled"
                    @click="e6++, (disabled = true)"
                    rounded
                  >
                    Continuar
                  </v-btn>
                  <v-btn
                    text
                    rounded
                    class="error"
                    @click="e6--, (disabled = false)"
                  >
                    Volver
                  </v-btn>
                </v-row>
              </v-card>
            </v-stepper-content>

            <v-stepper-step :complete="e6 > 4" step="4" color="primary">
              Ingresa una categoria
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-card class="pa-2" outlined>
                <v-select
                  v-model="category"
                  :items="items"
                  :rules="[rules.required]"
                  label="Selecione una categoria"
                  outlined
                  @input="validateSelected"
                ></v-select>
                <v-row class="pa-4 justify-space-between">
                  <v-btn
                    color="primary"
                    :disabled="disabled"
                    @click="e6++, (disabled = true)"
                    rounded
                  >
                    Continuar
                  </v-btn>
                  <v-btn
                    text
                    rounded
                    class="error"
                    @click="e6--, (disabled = false)"
                  >
                    Volver
                  </v-btn>
                </v-row>
              </v-card>
            </v-stepper-content>

            <v-stepper-step :complete="e6 > 5" step="5" color="primary">
              Ingresa una imagen
            </v-stepper-step>
            <v-stepper-content step="5">
              <v-card class="pa-2" outlined>
                <v-file-input
                  v-model="image"
                  chips
                  :rules="[rules.required]"
                  multiple
                  outlined
                  accept="image/*"
                  @change="validateSelected"
                  label="Seleccione una imagen"
                ></v-file-input>
                <v-row class="pa-4 justify-space-between">
                  <v-btn
                    color="primary"
                    :disabled="disabled"
                    @click="e6++, (disabled = true), (addProduct = false)"
                    rounded
                  >
                    Continuar
                  </v-btn>
                  <v-btn
                    text
                    rounded
                    class="error"
                    @click="
                      e6--,
                        (disabled = false),
                        (addProduct = true),
                        (category = '')
                    "
                  >
                    Volver
                  </v-btn>
                </v-row>
              </v-card>
            </v-stepper-content>
            <v-row class="pt-4 ml-9 mr-9 justify-space-between">
              <v-btn
                :disabled="e6 !== 6 || addProduct"
                color="primary"
                rounded
                @click="
                  addNewProduct(name, price, description, category, image),
                    (addProduct = true),
                    (snackbar = true),
                    (showAdd = true)
                "
              >
                Agregar
              </v-btn>
              <v-btn
                :disabled="addProduct"
                color="error"
                rounded
                @click="
                  e6--, (disabled = false), (addProduct = false), (image = null)
                "
                >Volver</v-btn
              >
            </v-row>
          </v-stepper>
          <v-btn
            v-show="showAdd"
            outlined
            large
            color=" green accent-4"
            class="ma-2 darken-3 darken-1 rounded-xl"
            @click="returnAddProduct"
            ><v-icon class="ma-1">fas fa-plus-circle</v-icon>volver a
            agregar</v-btn
          >

          <v-snackbar v-model="snackbar" vertical>
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-col>
                <v-row class="justify-space-between">
                  <v-btn
                    color="green"
                    text
                    v-bind="attrs"
                    @click="redirectShop"
                  >
                    Ver el producto
                  </v-btn>
                  <v-btn
                    color="red"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                  >
                    Close
                  </v-btn>
                </v-row>
              </v-col>
            </template>
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import products from "@/store/products";
import router from "@/router";
import { firebase } from "@/firebase";

export default {
  name: "AddProduct",
  data() {
    return {
      showAdd: false,
      snackbar: false,
      text: "Producto agregado :)",
      min: 5,
      addProduct: true,
      disabled: true,
      name: "",
      price: 0,
      description: "",
      category: "",
      image: null,
      e6: 1,
      items: ["electronics", "jewelery", "men's clothing", "women's clothing"],
      rules: {
        required: (value) => !!value || "Requiredo.",
        min: (v) => v.length >= 5 || "ingrese un minimo de 5 caracteres.",
      },
    };
  },
  mounted() {
    products.dispatch("setArrayProduct");
  },
  methods: {
    validate(text) {
      if (text.length >= this.min) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    validatePrice(price) {
      const priceString = price.toString();
      const startsWithZero = priceString.charAt(0) === "0";

      if (price > 0 && price < 1000000 && !startsWithZero) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    validateSelected() {
      this.disabled = false;
    },

    async addNewProduct(name, price, description, category, image) {
      const imageUrl = await products.dispatch("uploadImage", image[0]);
      const product = {
        categoria: category,
        descripcion: description,
        imagen: imageUrl,
        precio: price,
        titulo: name,
      };
      products.dispatch("addProduct", product);
    },

    redirectShop() {
      router.push("shop");
    },
    returnAddProduct() {
      this.e6 = 1;
      this.name = "";
      this.price = 0;
      this.description = "";
      this.category = "";
      this.image = null;
      this.showAdd = false;
    },
  },
};
</script>