import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
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
  faMoneyBill
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
  faMoneyBill
);

const app = createApp(App);

app.use(router);

// Registruješ FontAwesome komponentu globalno
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
