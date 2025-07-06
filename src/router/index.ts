import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainView from '../views/main-view.vue';
import TestView from "../views/test-view.vue";
import MarketPlaceView from "../views/marketplace-view.vue";
import ProductView from "../views/product-view.vue";
import ClubSelector from "../views/clubselector-view.vue";
import RegisterSelector from "../views/register-view.vue";
import LoginView from "../views/login-view.vue";
import CartView from "../views/cart-view.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: MainView,
  },
  {
    path: "/test",
    name: "test",
    component: TestView,
  },
  {
    path: "/marketplace",
    name: "marketplace",
    component: MarketPlaceView,
  },
  {
    path: "/produto/camisa-oficial-salgueiro",
    name: "produto-camisa-oficial-salgueiro",
    component: ProductView,
  },
  {
    path: "/clubes",
    name: "clubes",
    component: ClubSelector,
  },
  {
    path: "/registro",
    name: "registro",
    component: RegisterSelector,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/carrinho",
    name: "carrinho",
    component: CartView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
