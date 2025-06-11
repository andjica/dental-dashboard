import { createRouter, createWebHistory } from "vue-router";
import {isAuthenticated, getUserRole, isEmailVerified } from "@/helper/auth";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import EmailVerify from "@/pages/VerifyEmail.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import CompanyLayout from "@/layouts/CompanyLayout.vue";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/verify-email",
    component: EmailVerify,
  },
  // Admin
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: 1 },
    children: [
      {
        path: "dashboard",
        name: "admin.dashboard",
        component: () => import("@/pages/admin/Dashboard.vue"),
      },
      {
        path: "users",
        name: "admin.users",
        component: () => import("@/pages/admin/User.vue"),
      },
      {
        path: "settings",
        name: "admin.settings",
        component: () => import("@/pages/admin/Settings.vue"),
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
    path: "/company",
    component: CompanyLayout,
    meta: { requiresAuth: true, role: 2 },
    children: [
      {
        path: "dashboard",
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

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Middleware logika
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.role;

  if (requiresAuth && !isAuthenticated()) {
    return next('/');
  }

  if (requiredRole && getUserRole() !== requiredRole) {
    return next('/');
  }

  if (requiresAuth && !isEmailVerified() && to.path !== '/verify-email') {
    return next('/verify-email');
  }

  next();
});

export default router;
