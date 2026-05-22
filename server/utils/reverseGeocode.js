const axios = require("axios");

async function reverseGeocode(lat, lng) {
  try {
    const res = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: Number(lat),
          lon: Number(lng),
          format: "jsonv2",
          zoom: 10,
        },
        headers: {
          "User-Agent": "FreeFare-App (learning project)",
          "Accept-Language": "en",
        },
        timeout: 8000,
      }
    );

    const a = res.data.address || {};

    return {
       city:
    a.city ||
    a.town ||
    a.municipality ||
    a.county ||
    a.suburb ||
    a.village ||
    a.hamlet ||
    "",
      region: a.state || "",
      country: a.country || "",
    };
  } catch (err) {
    console.error("❌ Reverse geocoding failed:", err.message);
    return null;
  }
}

module.exports = reverseGeocode;
