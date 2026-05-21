const axios = require("axios");

exports.getLocationFromIP = async () => {
  try {
    const res = await axios.get("https://ipapi.co/json/");
    return {
      city: res.data.city || "",
      region: res.data.region || "",
      country: res.data.country_name || "",
    };
  } catch (err) {
    console.error("IP location failed");
    return null;
  }
};
