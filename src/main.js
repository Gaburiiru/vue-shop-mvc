import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { auth } from "@/firebase";
import VuePaycard from "vue-paycard";
import Vuelidate from "vuelidate";
import i18n from "@/plugins/i18n";
import VueMask from "v-mask";

Vue.use(VuePaycard);
Vue.use(Vuelidate);
Vue.config.productionTip = false;
Vue.use(VueMask);

auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch("setUser", user);
  }
  new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: (h) => h(App),
  }).$mount("#app");
});

store.dispatch("initializeAdminSession");
