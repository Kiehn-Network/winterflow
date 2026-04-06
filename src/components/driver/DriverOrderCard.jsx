import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Play, Square, Camera, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import CustomerTypeBadge from "../shared/CustomerTypeBadge";

export default function DriverOrderCard({ order, onStart, onFinish, onProblem, onSelect }) {
  const getMapsUrl = (address) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  const isActive = order.status === "in_bearbeitung";
  const canStart = order.status === "zugewiesen";
  const isDone = order.status === "erledigt";

  return (
    <Card className={`overflow-hidden transition-all ${isActive ? "ring-2 ring-primary shadow-lg shadow-primary/10" : ""}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className={`p-4 ${isActive ? "bg-primary/10" : "bg-muted/30"}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">{order.customer_name || "Unbekannt"}</h3>
                <CustomerTypeBadge type={order.customer_type} />
              </div>
              <a
                href={getMapsUrl(order.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary mt-1 text-sm"
              >
                <MapPin className="w-4 h-4" />
                {order.address}
                <Navigation className="w-3 h-3" />
              </a>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
            </div>
          </div>
        </div>

        {/* Tasks */}
        {order.tasks?.length > 0 && (
          <div className="px-4 py-3 border-b">
            <p className="text-xs font-medium text-muted-foreground mb-2">TÄTIGKEITEN</p>
            <div className="flex flex-wrap gap-2">
              {order.tasks.map((task, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-muted font-medium">
                  {task}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.dispatcher_notes && (
          <div className="px-4 py-3 border-b">
            <p className="text-xs font-medium text-muted-foreground mb-1">HINWEIS DISPOSITION</p>
            <p className="text-sm">{order.dispatcher_notes}</p>
          </div>
        )}

        {/* Timer */}
        {isActive && order.start_time && (
          <div className="px-4 py-3 border-b bg-primary/5">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-4 h-4 animate-pulse-glow" />
              <span className="font-mono font-bold">Einsatz läuft...</span>
            </div>
          </div>
        )}

        {/* Action Buttons - Large for glove operation */}
        {!isDone && (
          <div className="p-4 space-y-3">
            {canStart && (
              <Button
                onClick={() => onStart(order)}
                size="lg"
                className="w-full h-14 text-lg font-bold gap-3 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-6 h-6" /> Einsatz starten
              </Button>
            )}

            {isActive && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => onSelect(order)}
                  size="lg"
                  className="h-14 text-base font-bold gap-2"
                  variant="outline"
                >
                  <Camera className="w-5 h-5" /> Details
                </Button>
                <Button
                  onClick={() => onFinish(order)}
                  size="lg"
                  className="h-14 text-base font-bold gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-5 h-5" /> Fertig
                </Button>
              </div>
            )}

            {(canStart || isActive) && (
              <Button
                onClick={() => onProblem(order)}
                size="lg"
                variant="destructive"
                className="w-full h-12 text-base font-bold gap-2"
              >
                <AlertTriangle className="w-5 h-5" /> Problem melden
              </Button>
            )}
          </div>
        )}

        {isDone && (
          <div className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Abgeschlossen</span>
            </div>
            {order.duration_minutes && (
              <p className="text-sm text-muted-foreground mt-1">Dauer: {order.duration_minutes} Min.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}