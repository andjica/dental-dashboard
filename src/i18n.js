import { createI18n } from "vue-i18n";

import bg from "./locales/bg.json";
import cs from "./locales/cs.json";
import de from "./locales/de.json";
import el from "./locales/el.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import hr from "./locales/hr.json";
import hu from "./locales/hu.json";
import it from "./locales/it.json";
import nl from "./locales/nl.json";
import pl from "./locales/pl.json";
import pt from "./locales/pt.json";
import ro from "./locales/ro.json";
import si from "./locales/si.json";
import sk from "./locales/sk.json";
import sr from "./locales/sr.json";
import sv from "./locales/sv.json";
import no from "./locales/no.json";
import fi from "./locales/fi.json";
import da from "./locales/da.json";
import lt from "./locales/lt.json";
import lv from "./locales/lv.json";
import et from "./locales/et.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang") || "en",
  fallbackLocale: "en",
  messages: {
    en,
    hr,
    sr,
    de,
    fr,
    es,
    it,
    pt,
    pl,
    cs,
    sk,
    hu,
    si,
    nl,
    bg,
    el,
    ro,
    sv,
    no,
    fi,
    da,
    lt,
    lv,
    et
  },
});

export default i18n;
