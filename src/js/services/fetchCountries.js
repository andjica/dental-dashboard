export const fetchEuropeanCountries = async () => {
  const response = await fetch("https://restcountries.com/v3.1/region/europe");
  if (!response.ok) throw new Error("Failed to fetch countries");

  const data = await response.json();
  return data
    .map(country => ({
      name: country.name.common,
      code: country.cca2,
      flag: country.flags && country.flags.png ? country.flags.png : '', // URL zastave (PNG)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
