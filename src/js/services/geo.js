// export async function detectCountryByIP(apiKey) {
//   const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({}) // vrlo važno!
//   });

//   if (!response.ok) {
//     throw new Error(`Geolocation API error: ${response.statusText}`);
//   }

//   const data = await response.json();
//   const { lat, lng } = data.location;

//   // Sada šalješ koordinate na neki geokoder (npr. Google Maps Geocoding API)
//   const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);

//   const geoData = await geoResponse.json();
//   const countryComponent = geoData.results[0].address_components.find(component =>
//     component.types.includes("country")
//   );

//   return countryComponent.short_name;
// }
export async function detectCountryByIP() {
  const response = await fetch("https://ipapi.co/json/");
  if (!response.ok) throw new Error("Failed to fetch IP info");

  const data = await response.json();
  return data.country_code; // npr. "HR"
}