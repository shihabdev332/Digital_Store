import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config"; 
import { IoLocationSharp } from "react-icons/io5";

// Leaflet Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to re-center map when coordinates change
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

// Component to handle map clicks and fetch address
const LocationPicker = ({ setAddress, setMarkerPos }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      // Calls our backend proxy to avoid CORS/Forbidden issues
      await getAddressDetails(lat, lng, setAddress);
    },
  });
  return null;
};

// Function to fetch address details via backend proxy
const getAddressDetails = async (lat, lng, setAddress) => {
  const loadingToast = toast.loading("Fetching location details...");
  try {
    // Calling backend endpoint: /api/order/reverse-geocode
    const res = await axios.get(`${serverUrl}/api/order/reverse-geocode?lat=${lat}&lon=${lng}`);
    
    const data = res.data;
    const a = data.address;

    if (a) {
      setAddress({
        district: a.city || a.state_district || a.district || "",
        subDistrict: a.suburb || a.neighbourhood || a.village || a.police_station || a.county || "",
        road: a.road || a.amenity || "Main Road",
        houseNumber: a.house_number || "Selected via Map",
      });
      toast.success("Location updated successfully!", { id: loadingToast });
    }
  } catch (err) {
    console.error("Location Error:", err);
    toast.error("Location details not found", { id: loadingToast });
  }
};

const AutoLocation = ({ address, setAddress }) => {
  const [mode, setMode] = useState("auto");
  const [markerPos, setMarkerPos] = useState([23.8103, 90.4125]); // Dhaka Default

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported!");

    const loadingToast = toast.loading("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMarkerPos([latitude, longitude]);
        await getAddressDetails(latitude, longitude, setAddress);
        toast.dismiss(loadingToast);
      },
      () => {
        toast.dismiss(loadingToast);
        toast.error("Access denied! Please enable GPS.");
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Selection for Auto or Manual mode */}
      <div className="flex p-1 bg-zinc-100 rounded-2xl w-fit mx-auto border border-zinc-200">
        <button
          onClick={() => setMode("auto")}
          className={`px-6 py-2 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest transition-all ${
            mode === "auto" ? "bg-white text-blue-600 shadow-sm" : "text-zinc-400"
          }`}
        >
          Auto Map
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`px-6 py-2 rounded-xl text-[10px] cursor-pointer font-black uppercase tracking-widest transition-all ${
            mode === "manual" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-400"
          }`}
        >
          Manual Input
        </button>
      </div>

      {/* Render Map if Auto mode is selected */}
      {mode === "auto" && (
        <div className="relative group">
          <div className="w-full h-80 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl z-0">
            <MapContainer center={markerPos} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                attribution='&copy; OpenStreetMap'
              />
              <Marker position={markerPos} />
              <LocationPicker setAddress={setAddress} setMarkerPos={setMarkerPos} />
              <ChangeView center={markerPos} />
            </MapContainer>
          </div>

          <button
            onClick={handleCurrentLocation}
            className="absolute bottom-6 right-6 z-[1000] flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-xl transition-all active:scale-95 group cursor-pointer"
          >
            <IoLocationSharp className="text-xl" />
            <span className="text-xs font-black uppercase tracking-widest">My Location</span>
          </button>
        </div>
      )}

      {/* Dynamic Address Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {Object.keys(address).map((key) => {
          const labelText = key === "subDistrict" ? "Sub-District" : key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">
                {labelText}
              </label>
              <input
                type="text"
                placeholder={`Enter Your ${labelText}...`}
                value={address[key]}
                onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                className={`bg-white border rounded-2xl p-4 text-sm outline-none font-bold transition-all focus:ring-2 ${
                  mode === "auto" ? "border-blue-50 focus:ring-blue-100" : "border-zinc-200 focus:ring-zinc-900"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutoLocation;