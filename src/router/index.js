import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import CompanyLayout from "@layouts/CompanyLayout.vue";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  // Admin
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "admin.dashboard",
        component: () => import("@/pages/admin/Dashboard.vue"),
      },
      {
        path: "users",
        name: "admin.users",
        component: () => import("@/pages/admin/User.vue"),
      },
      {
        path: "companies",
        name: "admin.companies",
        component: () => import("@/pages/admin/Companies.vue"),
      },
      {
        path: "products",
        name: "admin.products",
        component: () => import("@/pages/admin/Products.vue"),
      },
      {
        path: "products/:id/edit",
        name: "admin.product.edit",
        component: () => import("@/pages/admin/ProductEdit.vue"),
      },
    ],
  },
  // Company
  {
    path: "/dashboard",
    component: CompanyLayout,
    children: [
      {
        path: "",
        name: "company.dashboard",
        component: () => import("@/pages/company/Dashboard.vue"),
      },
      {
        path: "settings",
        name: "company.settings",
        component: () => import("@/pages/company/Settings.vue"),
      },
      {
        path: "products",
        name: "company.products",
        component: () => import("@/pages/company/Products.vue"),
      },
      {
        path: "products/create",
        name: "company.product.create",
        component: () => import("@/pages/company/ProductCreate.vue"),
      },
      {
        path: "products/:id/edit",
        name: "company.product.edit",
        component: () => import("@/pages/company/ProductEdit.vue"),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
