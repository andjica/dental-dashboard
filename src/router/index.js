import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, getUserRole, isEmailVerified } from "@/helper/auth";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import EmailVerify from "@/pages/VerifyEmail.vue";
import VerifySuccess from "@/pages/VerifySuccess.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import CompanyLayout from "@/layouts/CompanyLayout.vue";
import UserLayout from "../layouts/UserLayout.vue";

const routes = [
  {
    path: "/",
    component: Login,
    meta: { public: true },
  },
  {
    path: "/register",
    component: Register,
    meta: { public: true },
  },
  {
    path: "/verify-email",
    component: EmailVerify,
  },
  {
    path: "/verify-success",
    component: VerifySuccess,
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
        component: () => import("@/pages/admin/users/Users.vue"),
      },
      {
        path: "companies",
        name: "admin.companies",
        component: () => import("@/pages/admin/companies/Companies.vue"),
      },
      {
        path: "products",
        name: "admin.products",
        component: () => import("@/pages/admin/product/Products.vue"),
      },
      {
        path: "products/create",
        name: "admin.product.create",
        component: () => import("@/pages/admin/product/ProductCreate.vue"),
      },
      {
        path: "products/:id/edit",
        name: "admin.product.edit",
        component: () => import("@/pages/admin/product/ProductEdit.vue"),
      },
      {
        path: "order/view",
        name: "admin.order.view",
        component: () => import("@/pages/admin/order/OrderView.vue"),
      },
      {
        path: "settings/company",
        name: "admin.settings",
        component: () => import("@/pages/admin/settings/Settings.vue"),
      },
      {
        path: "settings/profile",
        name: "admin.profile",
        component: () => import("@/pages/admin/settings/Profile.vue"),
      },
      {
        path: "settings/payment",
        name: "admin.payment",
        component: () => import("@/pages/admin/settings/Payment.vue"),
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
        path: "settings/company",
        name: "company.settings.company",
        component: () => import("@/pages/company/settings/CompanySettings.vue"),
      },
      {
        path: "settings/profile",
        name: "company.settings.profile",
        component: () => import("@/pages/company/settings/ProfileSettings.vue"),
      },
      {
        path: "products",
        name: "company.products",
        component: () => import("@/pages/company/products/Products.vue"),
      },
      {
        path: "products/create",
        name: "company.product.create",
        component: () => import("@/pages/company/products/ProductCreate.vue"),
      },
      {
        path: "products/:id/edit",
        name: "company.product.edit",
        component: () => import("@/pages/company/products/ProductEdit.vue"),
      },
      {
        path: "order/view",
        name: "company.order.view",
        component: () => import("@/pages/company/order/OrderView.vue"),
      },
    ],
  },
  // User
  {
    path: "/user",
    component: UserLayout,
    meta: { requiresAuth: true, role: 3 },
    children: [
      {
        path: "dashboard",
        name: "user.dashboard",
        component: () => import("@/pages/user/Dashboard.vue"),
      },
      {
        path: "settings/company",
        name: "user.settings.company",
        component: () => import("@/pages/user/settings/UserCompany.vue"),
      },
      {
        path: "settings/profile",
        name: "user.settings.profile",
        component: () => import("@/pages/user/settings/UserProfile.vue"),
      },
      {
        path: "products",
        name: "user.products",
        component: () => import("@/pages/user/products/Products.vue"),
      },
      {
        path: "products/create",
        name: "user.product.create",
        component: () => import("@/pages/user/products/ProductCreate.vue"),
      },
      {
        path: "products/:id/edit",
        name: "user.product.edit",
        component: () => import("@/pages/user/products/ProductEdit.vue"),
      },
      {
        path: "order/view",
        name: "user.order.view",
        component: () => import("@/pages/user/order/OrderView.vue"),
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
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isPublic = to.matched.some((record) => record.meta.public);

  if (isPublic) {
    return next(); // Dozvoli javne stranice
  }

  if (requiresAuth && !isAuthenticated()) {
    return next({ path: "/", query: { error: "unauthenticated" } });
  }

  if (requiresAuth && isAuthenticated() && getUserRole() !== to.meta.role) {
    return next("/");
  }

  if (
    requiresAuth &&
    isAuthenticated() &&
    !isEmailVerified() &&
    to.path !== "/verify-email"
  ) {
    const user = localStorage.getItem("user");

    fetch("http://localhost:8000/api/email/verification-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ user: user }),
    })
      .then(() => {
        console.log("Verification email has been resent.");
      })
      .catch((error) => {
        console.error("Resend failed:", error.message);
      });

    return next("/verify-email");
  }

  return next();
});

export default router;
