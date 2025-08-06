const countryToLang = {
  HR: "hr", // Hrvatska
  RS: "sr", // Srbija
  BA: "sr", // Bosna i Hercegovina
  ME: "sr", // Crna Gora
  DE: "de", // Nemačka
  AT: "de", // Austrija
  CH: "de", // Švajcarska
  FR: "fr", // Francuska
  IT: "it", // Italija
  ES: "es", // Španija
  PT: "pt", // Portugal
  PL: "pl", // Poljska
  CZ: "cs", // Češka
  SK: "sk", // Slovačka
  SI: 'si', // Slovenija
  HU: "hu", // Mađarska
  RO: "ro", // Rumunija
  NL: "nl", // Holandija
  BE: "fr", // Belgija
  BG: "bg", // Bugarska
  EL: "el", // Grčka
  SE: "sv", // Švedska
  NO: "no", // Norveška
  FI: "fi", // Finska
  DK: "da", // Danska
  LT: "lt", // Litvanija
  LV: "lv", // Letonija
  EE: "et", // Estonija
  IE: "en", // Irska
  GB: "en", // Ujedinjeno Kraljevstvo
  IS: "en", // Island (fallback)
};

export function changeLangByCountry(code) {
  return countryToLang[code] || 'en';
}
