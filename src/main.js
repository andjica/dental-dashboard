import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from './i18n';
import "./assets/color.css";
import "./assets/main.css";

// Font Awesome imports
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faGear,
  faTrash,
  faPen,
  faRightFromBracket,
  faHome,
  faShop,
  faCartPlus,
  faBars,
  faXmark,
  faEllipsisVertical,
  faEye,
  faPenToSquare,
  faMoneyBill,
  faUsers,
  faBuilding,
  faArrowLeft,
  faCheck,
  faX,
  faPlus,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Dodaješ ikone u biblioteku
library.add(
  faHome,
  faUser,
  faGear,
  faTrash,
  faPen,
  faRightFromBracket,
  faShop,
  faCartPlus,
  faBars,
  faXmark,
  faEllipsisVertical,
  faEye,
  faPenToSquare,
  faMoneyBill,
  faUsers,
  faBuilding,
  faArrowLeft,
  faCheck,
  faX,
  faPlus,
  faExclamationCircle  
);

const app = createApp(App);

app.use(router);
app.use(i18n);
// Registruješ FontAwesome komponentu globalno
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount("#app");
