import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LiveMap({ orders }) {
  const ordersWithCoords = orders.filter((o) => o.latitude && o.longitude);
  const center = ordersWithCoords.length > 0
    ? [ordersWithCoords[0].latitude, ordersWithCoords[0].longitude]
    : [51.1657, 10.4515]; // Germany center

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Live-Karte
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px]">
          <MapContainer center={center} zoom={10} className="h-full w-full rounded-b-xl" scrollWheelZoom>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            {ordersWithCoords.map((order) => (
              <Marker key={order.id} position={[order.latitude, order.longitude]}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{order.customer_name}</p>
                    <p className="text-muted-foreground">{order.address}</p>
                    <div className="mt-1"><StatusBadge status={order.status} /></div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}