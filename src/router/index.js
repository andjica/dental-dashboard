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
  {
      path: "/choose-role",
      name: "choose-role",
      component: () => import("@/pages/ChooseRole.vue"),
      meta: { requiresAuth: true, allowNoRole: true } // mora da bude ulogovan
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
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const isPublic     = to.matched.some((r) => r.meta.public);

  // 1) Token expiry modal (ostaje kako si imala)
  if (!isPublic && isTokenExpired()) {
    window.dispatchEvent(new Event("tokenExpired"));
    return; // modal će odraditi redirect iz App.vue
  }

  // 2) Javne rute (login/register itd.)
  if (isPublic) {
    // ako si već ulogovan, smislen redirect
    if (isAuthenticated()) {
      const roleId = getUserRole(); // vrati null ili 1/2/3
      if (roleId == null) return next("/choose-role");
      if (roleId === 1)   return next("/admin/dashboard");
      if (roleId === 2)   return next("/company/dashboard");
      if (roleId === 3)   return next("/user/dashboard");
    }
    return next();
  }

  // 3) Rute koje traže login
  if (requiresAuth && !isAuthenticated()) {
    return next({ path: "/", query: { error: "unauthenticated" } });
  }

  // 4) DOZVOLI /choose-role: ruta sa allowNoRole = true propušta korisnika
  //    koji ima token čak i ako nema role_id
  if (requiresAuth && to.meta?.allowNoRole) {
    return next();
  }

  // 5) Role-check SAMO ako je ruta definisala meta.role (1/2/3)
  if (requiresAuth && to.meta?.role != null) {
    const roleId = getUserRole(); // null ili broj
    if (roleId == null) return next("/choose-role"); // nema rolu → prvo biraj rolu
    if (roleId !== to.meta.role) return next("/");   // pogrešna rola → login
  }

  // 6) Verifikacija emaila (tvoja logika ostaje ista)
  if (requiresAuth && isAuthenticated() && !isEmailVerified() && to.path !== "/verify-email") {
    return next("/verify-email");
  }

  return next();
});


export default router;
