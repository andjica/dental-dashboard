import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, getUserRole, isEmailVerified } from "@/js/auth";
import { isTokenExpired } from "@/js/helper/tokenExpired";
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
        component: () => import("@/pages/admin/product/ProductsAdmin.vue"),
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
        path: "products/:id/detail",
        name: "admin.product.view",
        component: () => import("@/pages/admin/product/ProductView.vue"),
      },
      {
        path: "all/products",
        name: "admin.all.products",
        component: () => import("@/pages/admin/product/ProductsAll.vue"),
      },
      {
        path: "auction/create",
        name: "admin.auction.create",
        component: () => import("@/pages/admin/auction/AuctionCreate.vue"),
      },
      {
        path: "all/auctions",
        name: "admin.auctions",
        component: () => import("@/pages/admin/auction/AuctionsAll.vue"),
      },
      {
        path: "auctions",
        name: "admin.your.auctions",
        component: () => import("@/pages/admin/auction/AuctionsAdmin.vue"),
      },
      {
        path: "auction/:id/edit",
        name: "admin.auction.edit",
        component: () => import("@/pages/admin/auction/AuctionEdit.vue"),
      },
      {
        path: "orders",
        name: "admin.orders",
        component: () => import("@/pages/admin/order/OrderView.vue"),
      },
      {
        path: "categories",
        name: "admin.categories",
        component: () => import("@/pages/admin/categories/CategoriesView.vue"),
      },
      {
        path: "category/create",
        name: "admin.category.create",
        component: () => import("@/pages/admin/categories/CategoryCreate.vue"),
      },
      {
        path: "category/:id/edit",
        name: "admin.category.edit",
        component: () => import("@/pages/admin/categories/CategoryEdit.vue"),
      },
      {
        path: "sub-categories",
        name: "admin.sub-categories",
        component: () => import("@/pages/admin/sub-categories/SubCategoriesView.vue"),
      },
      {
        path: "sub-category/create",
        name: "admin.sub-category.create",
        component: () => import("@/pages/admin/sub-categories/SubCategoriesCreate.vue"),
      },
      {
        path: "sub-category/:id/edit",
        name: "admin.sub-category.edit",
        component: () => import("@/pages/admin/sub-categories/SubCategoryEdit.vue"),
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
        path: "settings/payment",
        name: "company.settings.payment",
        component: () => import("@/pages/company/settings/PaymentSettings.vue"),
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
        path: "auction/create",
        name: "company.auction.create",
        component: () => import("@/pages/company/auction/AuctionCreate.vue"),
      },
      {
        path: "auction/view",
        name: "company.auction.view",
        component: () => import("@/pages/company/auction/AuctionsView.vue"),
      },
      {
        path: "auction/:id/edit",
        name: "company.edit.view",
        component: () => import("@/pages/company/auction/AuctionEdit.vue"),
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
        path: "settings/user",
        name: "user.settings.user",
        component: () => import("@/pages/user/settings/UserCompany.vue"),
      },
      {
        path: "settings/profile",
        name: "user.settings.profile",
        component: () => import("@/pages/user/settings/UserProfile.vue"),
      },
      {
        path: "settings/payment",
        name: "user.settings.payment",
        component: () => import("@/pages/user/settings/UserPayment.vue"),
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
        path: "auction/create",
        name: "user.auction.create",
        component: () => import("@/pages/user/auction/AuctionCreate.vue"),
      },
      {
        path: "auction/view",
        name: "user.auction.view",
        component: () => import("@/pages/user/auction/AuctionsView.vue"),
      },
      {
        path: "auction/:id/edit",
        name: "user.auction.edit",
        component: () => import("@/pages/user/auction/AuctionEdit.vue"),
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

  // Dodaj OVU proveru NAJVIŠE na početku
  if (!isPublic && isTokenExpired()) {
    window.dispatchEvent(new Event("tokenExpired"));
    // NE pozivaš next() jer će se modal otvoriti i uraditi redirect iz App.vue
    return; 
  }

  // Ostatak tvog koda ostaje ISTI:
  if (isPublic) {
    return next();
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
    return next("/verify-email");
  }

  return next();
});

export default router;
