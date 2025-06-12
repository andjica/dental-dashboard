import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, getUserRole, isEmailVerified } from "@/helper/auth";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import EmailVerify from "@/pages/VerifyEmail.vue";
import VerifySuccess from "@/pages/VerifySuccess.vue";
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
    ],
  },
  // User
  {
    path: "/company",
    component: CompanyLayout,
    meta: { requiresAuth: true, role: 3 },
    children: [
      {
        path: "dashboard",
        name: "user.dashboard",
        component: () => import("@/pages/user/Dashboard.vue"),
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Middleware logika
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRole = to.meta.role;

  if (requiresAuth && !isAuthenticated()) {
    return next({ path: "/", query: { error: "unauthenticated" } });
  }

  if (requiredRole && getUserRole() !== requiredRole) {
    return next("/");
  }

  if (
    requiresAuth &&
    isAuthenticated() &&
    !isEmailVerified() &&
    to.path !== "/verify-email"
  ) {
    //dodati rutu resend mail
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
        // Idealno ovo ide u global store ili neki reactive alert sistem
        console.log("Verification email has been resent.");
      })
      .catch((error) => {
        console.error("Resend failed:", error.message);
      });

    return next("/verify-email");
  }

  if (requiredRole && getUserRole() !== requiredRole) {
    return next("/");
  }

  return next();
});

export default router;
