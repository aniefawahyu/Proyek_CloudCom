import { NextResponse } from "next/server";

// Fungsi untuk menghitung jarak antara dua koordinat (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius Bumi dalam km
    const toRad = (value) => (value * Math.PI) / 180;
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Jarak dalam km
  }
  
  export async function POST(req) {
    try {
      const body = await req.json();
      const { userLat, userLng } = body;
      const storeLat = -7.2853;
      const storeLng = 112.7526;
      if (!userLat || !userLng || !storeLat || !storeLng) {
        return new NextResponse(JSON.stringify({ error: "Invalid coordinates" }), {
          status: 400,
        });
      }
  
      const distance = calculateDistance(userLat, userLng, storeLat, storeLng);
      let shippingCost = 5000; // Biaya 1 km pertama
  
      if (distance > 1) {
        shippingCost += Math.ceil(distance - 1) * 2500;
      }
  
      return new NextResponse(
        JSON.stringify({ distance: distance.toFixed(2), shippingCost }),
        { status: 200 }
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: "Error processing request" }),
        { status: 500 }
      );
    }
  }
  