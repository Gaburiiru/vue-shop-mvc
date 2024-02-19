import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "shop",
    component: () => import(/* webpackChunkName: "home" */ "../views/Shop.vue"),
  },
  {
    path: "/category",
    name: "category",
    component: () =>
      import(/* webpackChunkName: "category" */ "../views/Category.vue"),
  },
  {
    path: "/actionsAdmin",
    name: "actionsAdmin",
    component: () =>
      import(/* webpackChunkName: "actionsAdmin" */ "../views/NewProduct.vue"),
  },
  {
    path: "/purchasesUser",
    name: "purchasesUser",
    component: () =>
      import(
        /* webpackChunkName: "purchasesUser" */ "../views/PurchasesUser.vue"
      ),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  // Verificar si la ruta es reconocida y requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      next({ path: "/Login" });
    } else {
      next();
    }
  } else {
    next();
  }
  // Verificar si la ruta no es reconocida
  if (!to.matched.length) {
    next({ name: "shop" });
  }
});

export default router;