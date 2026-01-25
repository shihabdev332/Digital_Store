import express from 'express';
import axios from 'axios';

const locationRouter = express.Router();

/**
 * Route: POST /api/location/reverse-geocode
 * Bypassing 403 Forbidden by mimicking a real browser request
 */
locationRouter.post('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ success: false, message: "Coordinates missing" });
  }

  try {
    // Adding more realistic headers to avoid being blocked
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: 'jsonv2',
        lat: lat,
        lon: lon,
        addressdetails: 1
      },
      headers: {
        // Use a very specific User-Agent to satisfy Nominatim's policy
        'User-Agent': 'DigitalShopProject/1.0 (contact: shihab@yourdomain.com)',
        'Referer': 'http://localhost:5173', // Mimic your frontend origin
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (response.data) {
      res.status(200).json({
        success: true,
        address: response.data.address,
        displayName: response.data.display_name
      });
    } else {
      res.status(404).json({ success: false, message: "No data found for these coordinates" });
    }

  } catch (error) {
    console.error("Geocoding Error:", error.response?.status || error.message);
    
    // If Nominatim blocks you, tell the user clearly
    const status = error.response?.status || 500;
    res.status(status).json({ 
      success: false, 
      message: status === 403 ? "API access temporarily blocked by Nominatim" : "Geocoding failed" 
    });
  }
});

export default locationRouter;