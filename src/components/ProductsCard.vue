<template>
  <v-container>
    <Register :viewModalProp="viewLogin" @viewModalChanged="viewLoginChanged" />
    <ShopCart
      v-if="!isAdmin && isUserValid !== null"
      :cartArrayProp="cartArray"
      :totalCartProp="totalPrice()"
      @remove-item="removeItemFromCart"
      @clear-cart="clearCart"
      @purchase="value"
    />
    <v-row class="mx-auto ma-2">
      <!-- Filter and order by -->
      <v-col cols="12" class="pa-0 ma-0">
        <v-card class="pa-2 ma-0 rounded-xl d-flex justify-space-between">
          <v-row class="pa-0 ma-0">
            <v-row class="">
              <v-text-field
                placeholder="🔎 filtra nombre o por categoria"
                v-on:keyup="searchFilter"
                v-model="search"
                class="pl-4"
              />
            </v-row>
            <v-spacer />
            <v-list max-width="300" class="rounded-xl pa-0 ma-0" rounded>
              <v-list-group v-model="showList" class="pa-0 ma-0">
                <template v-slot:activator>
                  <v-list-item-title>
                    Ordenar por {{ selectedOption }}
                  </v-list-item-title>
                </template>
                <v-list-item
                  v-for="(title, i) in options"
                  :key="i"
                  @click="updateSelectedOption(title), toggleList()"
                  link
                >
                  <v-list-item-title>{{ title }}</v-list-item-title>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-row>
        </v-card>
      </v-col>
      <!-- Cards to products -->
      <v-col
        cols="12"
        xl="3"
        md="4"
        sm="6"
        v-for="item in filteredProducts"
        :key="item.id"
        class="pa-0"
      >
        <v-card
          class="rounded-xl mx-auto text-center ma-5 d-flex justify-space-around"
          max-width="350px"
          height="450px"
          hover
          @click="clickProduct(item)"
        >
          <v-row class="pa-2 d-flex">
            <div v-if="isAdmin">
              <v-btn
                class="mt-4 ml-5"
                absolute
                fab
                small
                color="blue"
                @click="showEdit(item)"
                hover
              >
                <v-icon color="white">fas fa-marker</v-icon>
              </v-btn>
              <v-btn
                class="mt-16 ml-5"
                absolute
                fab
                small
                color="red"
                @click="showDelete(item)"
                hover
              >
                <v-icon color="white">fas fa-trash</v-icon>
              </v-btn>
            </div>
            <v-container class="align-self-end">
              <v-img
                class="mx-auto ma-0 my-auto"
                :src="item.imagen"
                max-width="200px"
                max-height="300px"
              />
            </v-container>

            <v-container class="align-self-end">
              <v-col class="ma-0 pa-0">
                <v-divider />
                <P class="ma-2">
                  {{ item.titulo }}
                </P>
                <P class="font-weight-light text-h4">
                  US$<strong>{{ item.precio }}</strong>
                </P>
              </v-col>
            </v-container>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- modal product clicked user -->
    <v-dialog
      v-if="productSelected && !isAdmin"
      v-model="dialog"
      width="1000"
      persistent
    >
      <v-card rounded="lg">
        <v-card-title class="text-h5 grey lighten-2 d-flex justify-center mb-4">
          {{ productSelected.titulo }}
        </v-card-title>
        <v-card-text class="">
          <v-img class="mx-auto" width="150px" :src="productSelected.imagen" />
        </v-card-text>
        <v-card-text>
          <p class="text-center text-h4 black--text">
            US$ <strong>{{ productSelected.precio }}</strong>
          </p>
          <v-chip>{{ productSelected.categoria }}</v-chip>
        </v-card-text>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header> Descripción </v-expansion-panel-header>
              <v-expansion-panel-content>
                {{ productSelected.descripcion }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-text class="pa-0">
          <v-col>
            <p class="text-center body-1">Cantidad</p>
            <v-row class="ma-2 justify-center my-auto">
              <v-btn
                fab
                small
                color="primary"
                @click="modifyQuantityProduct(-1)"
              >
                <v-icon>fas fa-minus</v-icon></v-btn
              >
              <span
                class="my-auto text-center font-weight-bold text-h5 mr-5 ml-5"
              >
                {{ cantProduct }}
              </span>
              <v-btn
                fab
                small
                color="primary"
                @click="modifyQuantityProduct(1)"
              >
                <v-icon>fas fa-plus</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-card-text>
        <v-card-text>
          <v-row class="justify-space-between ma-1">
            <v-btn color="error" rounded @click="clickCancel()">Cancelar</v-btn>
            <v-btn
              color="success"
              rounded
              @click="clickAdd(productSelected, cantProduct), isLogin()"
              >Agregar</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- modal product delete admin -->
    <v-dialog v-if="productSelected" v-model="dialogDelete" width="500">
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 grey lighten-2 d-flex justify-center mb-4">
          {{ productSelected.titulo }}
        </v-card-title>
        <v-card-text>
          <v-img
            style="filter: saturate(0)"
            class="mx-auto"
            width="150px"
            :src="productSelected.imagen"
          />
        </v-card-text>
        <v-card-text class="pa-0">
          <v-col>
            <p class="text-center body-1">¿Desea eliminar este producto?</p>
          </v-col>
        </v-card-text>
        <v-card-text>
          <v-row class="justify-space-between ma-1">
            <v-btn color="error" rounded @click="cancelDelete()"
              >cancelar</v-btn
            >
            <v-btn
              color="success"
              rounded
              @click="deleteProduct(productSelected.id)"
              >eliminar</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- modal product edit admin -->
    <v-dialog
      v-if="productSelected && dialogEdit"
      v-model="dialogEdit"
      width="500"
      persistent
    >
      <v-card rounded="lg">
        <v-card-title class="text-h5 grey lighten-2 d-flex justify-center mb-4">
          Editar producto
        </v-card-title>
        <v-container>
          <v-text-field
            label="Editar nombre"
            v-model="productSelected.titulo"
            :rules="[rules.required, rules.min]"
            outlined
          ></v-text-field>
          <v-text-field
            label="Editar precio"
            v-model="productSelected.precio"
            :rules="[rules.required]"
            outlined
          ></v-text-field>
          <v-text-field
            label="Editar descripcion"
            v-model="productSelected.descripcion"
            :rules="[rules.required, rules.min]"
            outlined
          ></v-text-field>
          <v-select
            v-model="productSelected.categoria"
            :items="items"
            :rules="[rules.required]"
            label="Selecione una categoria"
            outlined
          ></v-select>
        </v-container>

        <v-card-text>
          <p>Editar imagen</p>
          <input
            type="file"
            ref="boton"
            class="d-none"
            @change="searchImg($event)"
          />
          <v-img
            @click="$refs.boton.click()"
            @mouseenter="showIcon = true"
            @mouseleave="showIcon = false"
            id="img"
            class="mx-auto rounded-pill"
            width="150px"
            :src="imageTemp"
          >
            <v-icon id="icon" v-show="showIcon">far fa-image</v-icon>
          </v-img>
        </v-card-text>
        <v-card-text class="pa-0"> </v-card-text>
        <v-card-text>
          <v-row class="justify-space-between ma-1">
            <v-btn color="error" rounded @click="cancelEdit(productSelected)"
              >cancelar</v-btn
            >
            <v-btn color="success" rounded @click="editProduct(productSelected)"
              >editar</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- modal product user cart -->
    <v-dialog v-model="dialogShop" width="800" persistent>
      <v-container class="pa-0 ma-0">
        <v-stepper
          v-model="e1"
          class="rounded-lg pt-4 pb-2 text-center mx-auto"
          outlined
        >
          <h1 class="ma-4 mb-10">Pago</h1>
          <v-stepper-header class="rounded-xl ma-2">
            <v-stepper-step step="1" />
            <v-divider />
            <v-stepper-step step="2" />
            <v-divider />
            <v-stepper-step step="3" />
          </v-stepper-header>
          <v-stepper-content step="1" class="pa-0 ma-0">
            <v-container class="pt-10 pb-10">
              <v-icon size="100">fas fa-shopping-bag</v-icon>
              <h1>Monto a pagar ${{ totalPrice() }}</h1>
            </v-container>
            <v-btn class="ma-4" rounded color="primary" @click="e1++">
              Continuar
            </v-btn>
            <v-btn
              class="ma-2"
              color="error"
              rounded
              @click="dialogShop = false"
              >cancelar</v-btn
            >
          </v-stepper-content>
          <v-stepper-content step="2" class="pa-0 ma-0">
            <!-- CardCredit -->
            <vue-paycard
              :value-fields="valueFields"
              :labels="labels"
              class="mt-5 mb-5"
              v-bind:class="{ '-active': isCardFlipped }"
            />
            <v-container>
              <v-card
                class="rounded-xl pa-2 pb-0 mx-auto"
                max-width="1000"
                outlined
              >
                <h4>Complete los datos para continuar</h4>
                <v-row class="pl-4 pr-4 mt-2">
                  <v-col cols="12" class="my-auto pa-0 ma-0">
                    <v-text-field
                      dense
                      v-model="valueFields.cardNumber"
                      v-mask="'####-####-####-####'"
                      :error-messages="cardNumberErrors"
                      rounded
                      outlined
                      :label="$tc('Payment.formCard.cardNumber')"
                      @input="$v.valueFields.cardNumber.$touch()"
                      @blur="$v.valueFields.cardNumber.$touch()"
                    />
                    <v-text-field
                      dense
                      v-model="valueFields.cardName"
                      rounded
                      :rules="nameRules"
                      outlined
                      :error-messages="cardNameErrors"
                      :label="$tc('Payment.formCard.cardName')"
                      @input="$v.valueFields.cardName.$touch()"
                      @blur="$v.valueFields.cardName.$touch()"
                    />
                  </v-col>
                  <v-row class="my-auto pa-0 ma-0" id="formSmall">
                    <v-col cols="4" class="pa-0 ma-0">
                      <v-text-field
                        v-model="valueFields.cardMonth"
                        :error-messages="cardMonthErrors"
                        :label="$tc('Payment.formCard.cardMonth')"
                        required
                        rounded
                        outlined
                        dense
                        @input="$v.valueFields.cardMonth.$touch()"
                        @blur="$v.valueFields.cardMonth.$touch()"
                      />
                    </v-col>
                    <v-col cols="4" class="pa-0 ma-0">
                      <v-text-field
                        v-model="valueFields.cardYear"
                        rounded
                        :error-messages="cardYearErrors"
                        :label="$tc('Payment.formCard.cardYear')"
                        outlined
                        dense
                        @input="$v.valueFields.cardYear.$touch()"
                        @blur="$v.valueFields.cardYear.$touch()"
                      />
                    </v-col>
                    <v-col cols="3" class="pa-0 ma-0">
                      <v-text-field
                        v-model="valueFields.cardCvv"
                        rounded
                        :label="$tc('Payment.formCard.cvv')"
                        :error-messages="cardCvvErrors"
                        v-mask="'####'"
                        outlined
                        :data-ref="valueFields.cardCvv"
                        v-on:focus="flipCard(true)"
                        v-on:blur="flipCard(false)"
                        dense
                        @input="$v.valueFields.cardCvv.$touch()"
                        @blur="$v.valueFields.cardCvv.$touch()"
                      />
                    </v-col>
                    <v-col cols="1" class="pa-0 ma-0">
                      <v-btn color="error" fab small @click="clear">
                        <v-icon>fas fa-eraser</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-row>
              </v-card>
              <v-btn
                class="ma-2"
                rounded
                color="primary"
                @click="e1++, finishShop()"
                :disabled="!isFormValid"
              >
                Finalizar
              </v-btn>
              <v-btn class="ma-2" color="error" rounded @click="e1--">
                volver
              </v-btn>
            </v-container>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-container class="pt-10 pb-10">
              <v-icon size="100">fas fa-shipping-fast</v-icon>
              <h4>tus productos seran enviados!</h4>
              <h1>Gracias por confiar con nosotros</h1>
            </v-container>
            <v-btn
              class="ma-2"
              color="error"
              rounded
              @click="dialogShop = false"
            >
              Cerrar
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </v-dialog>
  </v-container>
</template>

<script>
import products from "@/store/products";
import ShopCart from "./ShopCart.vue";
import Register from "./Register.vue";
import index from "@/store/index";
import VuePaycard from "vue-paycard";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  between,
  alpha,
} from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  validations: {
    valueFields: {
      cardName: { required, minLength: minLength(3), maxLength: maxLength(40) },
      cardNumber: {
        required,
        minLength: minLength(19),
        maxLength: maxLength(19),
      },
      cardMonth: { required, maxLength: maxLength(2), between: between(1, 12) },
      cardYear: {
        required,
        maxLength: maxLength(4),
        between: between(2023, 2040),
      },
      cardCvv: { required, minLength: minLength(3), maxLength: maxLength(4) },
    },
  },
  data() {
    return {
      e1: 1,
      steps: 2,
      nameRules: [
        (v) =>
          /^[a-zA-Z\s]*$/.test(v) ||
          "El nombre solo puede contener letras y espacios",
      ],
      labels: {
        cardName: "Nombre completo",
        cardHolder: "Nombre Titular",
        cardMonth: "MM",
        cardYear: "YY",
        cardExpires: "Expira",
        cardCvv: "CVV",
      },
      isCardFlipped: false,
      showIcon: false,
      items: ["electronics", "jewelery", "men's clothing", "women's clothing"],
      titulo: "",
      categoria: "",
      descripcion: "",
      imageTemp: null,
      imageObjet: null,
      urlTemp: "",
      imagen: null,
      precio: 0,
      search: "",
      showList: false,
      selectedOption: "-",
      options: ["Menor precio", "Mayor precio"],
      dialog: false,
      productSelected: null,
      cantProduct: 1,
      cartArray: [],
      isAdmin: false,
      isUserValid: null,
      dialogDelete: false,
      dialogEdit: false,
      rules: {
        required: (value) => !!value || "Requiredo.",
        min: (v) => v.length >= 5 || "ingrese un minimo de 5 caracteres.",
      },
      dialogShop: false,
      viewLogin: false,
    };
  },
  components: {
    VuePaycard,
    ShopCart,
    Register,
  },
  mounted() {
    const user = this.userData;
    if (user) {
      this.isUserValid = user;
    } else {
      index.dispatch("getUser").then(async () => {
        this.isUserValid = user;
      });
      console.log(this.isUserValid);
    }
    this.isAdmin = index.state.isAdmin;
    products.dispatch("setArrayProduct");
    this.search = products.state.search;
  },
  computed: {
    userData() {
      return index.state.user;
    },
    filteredProducts() {
      return products.getters.productFilter;
    },
    //valueFields tengo todos los campos de la tarjeta en el store
    valueFields() {
      return index.state.valueFields;
    },
    //actualizo en store el valor boolean
    isFormValid() {
      if (!this.$v.valueFields.$invalid) {
        index.commit("setUpdateForm", true);
        return true;
      } else {
        index.commit("setUpdateForm", false);
        return false;
      }
    },
    cardNameErrors() {
      const errors = [];
      if (!this.$v.valueFields.cardName.$dirty) return errors;
      !this.$v.valueFields.cardName.required &&
        errors.push(this.$tc("Payment.validationsCardText.required"));
      !this.$v.valueFields.cardName.minLength &&
        errors.push(this.$tc("Payment.validationsCardText.cardNameMinMax"));
      !this.$v.valueFields.cardName.maxLength &&
        errors.push(this.$tc("Payment.validationsCardText.cardNameMinMax"));
      return errors;
    },
    cardNumberErrors() {
      const errors = [];
      if (!this.$v.valueFields.cardNumber.$dirty) return errors;
      !this.$v.valueFields.cardNumber.required &&
        errors.push(this.$tc("Payment.validationsCardText.required"));
      !this.$v.valueFields.cardNumber.minLength &&
        errors.push(this.$tc("Payment.validationsCardText.cardNumber"));
      !this.$v.valueFields.cardNumber.maxLength &&
        errors.push(this.$tc("Payment.validationsCardText.cardNumber"));
      return errors;
    },
    cardMonthErrors() {
      const errors = [];
      if (!this.$v.valueFields.cardMonth.$dirty) return errors;
      !this.$v.valueFields.cardMonth.required &&
        errors.push(this.$tc("Payment.validationsCardText.required"));
      !this.$v.valueFields.cardMonth.between &&
        errors.push(this.$tc("Payment.validationsCardText.cardMonth"));
      return errors;
    },
    cardYearErrors() {
      const errors = [];
      if (!this.$v.valueFields.cardYear.$dirty) return errors;
      !this.$v.valueFields.cardYear.required &&
        errors.push(this.$tc("Payment.validationsCardText.required"));
      !this.$v.valueFields.cardYear.between &&
        errors.push(this.$tc("Payment.validationsCardText.cardYear"));
      return errors;
    },
    cardCvvErrors() {
      const errors = [];
      if (!this.$v.valueFields.cardCvv.$dirty) return errors;
      !this.$v.valueFields.cardCvv.required &&
        errors.push(this.$tc("Payment.validationsCardText.required"));
      !this.$v.valueFields.cardCvv.maxLength &&
        errors.push(this.$tc("Payment.validationsCardText.cvv"));
      return errors;
    },
  },
  methods: {
    // actions admin
    showDelete(product) {
      this.dialogDelete = true;
      this.productSelected = product;
    },
    deleteProduct(id) {
      products.dispatch("deleteProduct", id);
      this.dialogDelete = false;
    },
    cancelDelete() {
      this.dialogDelete = false;
    },
    showEdit(product) {
      this.dialogEdit = true;
      this.titulo = product.titulo;
      this.categoria = product.categoria;
      this.descripcion = product.descripcion;
      this.imageTemp = product.imagen;
      this.precio = product.precio;
    },
    editProduct(product) {
      const productTemp = {
        id: product.id,
        titulo: product.titulo,
        descripcion: product.descripcion,
        precio: product.precio,
        categoria: product.categoria,
        imagen: this.imageObjet,
      };
      // Si productTemp.imagen es null, asignar this.imageTemp a imagen
      if (this.imageObjet === null) {
        productTemp.imagen = this.imageTemp;
      }

      products.dispatch("editProduct", productTemp);
      this.dialogEdit = false;
      this.imageObjet = null;
    },
    searchImg(event) {
      const tipoImagen = event.target.files[0].type;
      if (
        tipoImagen === "image/jpeg" ||
        tipoImagen === "image/png" ||
        tipoImagen === "image/jpg"
      ) {
        this.imageObjet = event.target.files[0];
      } else {
        console.log("archivo no admitido");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(this.imageObjet);
      reader.onload = (e) => {
        this.urlTemp = e.target.result;
        this.imageTemp = this.urlTemp;
      };
    },
    cancelEdit(product) {
      this.dialogEdit = false;
      product.titulo = this.titulo;
      product.categoria = this.categoria;
      product.descripcion = this.descripcion;
      product.precio = this.precio;
    },
    // filter array
    searchFilter() {
      products.dispatch("searchFilter", this.search).then(() => {});
    },
    // select option order by
    updateSelectedOption(option) {
      this.selectedOption = option;
      if (option === this.options[0]) {
        this.sortProductsAsc();
      }
      if (option === this.options[1]) {
        this.sortProductsDesc();
      }
    },
    toggleList() {
      this.showList = !this.showList;
    },
    sortProductsAsc() {
      products.dispatch("sortProductsByPrice", "asc");
    },
    sortProductsDesc() {
      products.dispatch("sortProductsByPrice", "desc");
    },
    // modal actions
    clickProduct(product) {
      this.productSelected = product;
      this.dialog = true;
    },
    modifyQuantityProduct(number) {
      const result = (this.cantProduct += number);
      if (result >= 1) {
        return result;
      } else {
        this.cantProduct = 1;
      }
    },
    clickCancel() {
      this.dialog = false;
      this.cantProduct = 1;
    },
    clickAdd(product, cant) {
      this.cartArray.push({ product, cant });
      this.dialog = false;
      this.cantProduct = 1;
    },
    // cart actions
    totalPrice() {
      let totalPrice = 0.0;
      this.cartArray.forEach((element) => {
        if (element.product.precio != null) {
          totalPrice += element.product.precio * element.cant;
        }
      });
      return totalPrice.toFixed(2);
    },
    removeItemFromCart(index) {
      this.cartArray.splice(index, 1);
    },
    clearCart() {
      this.cartArray = []; // limpia la prop del carrito array
    },
    value(booleanData) {
      if (booleanData) {
        this.dialogShop = true;
      }
    },
    finishShop() {
      index.dispatch("addCart", this.cartArray);
      this.clearCart();
    },
    submit() {
      this.$v.$touch();
    },
    clear() {
      this.$v.$reset();
      this.$v.$reset();
      this.valueFields.cardName = "";
      this.valueFields.cardNumber = "";
      this.valueFields.cardMonth = "";
      this.valueFields.cardYear = "";
      this.valueFields.cardCvv = "";
      index.commit("setUpdateForm", false);
    },
    flipCard(status) {
      this.isCardFlipped = status;
    },
    isLogin() {
      if (this.isUserValid === null) {
        this.viewLogin = true;
      }
    },
    viewLoginChanged(Boolean) {
      this.viewLogin = Boolean;
    },
  },
};
</script>

<style>
#img:hover {
  position: relative;
}

#img:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(83, 175, 255, 0.592);
}

#icon {
  color: #ffffffd2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

#formSmall {
  justify-content: space-between;
}

@media screen and (max-width: 600px) {
  #formSmall {
    justify-content: center;
  }
}
</style>