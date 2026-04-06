import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import CustomerTypeBadge from "../shared/CustomerTypeBadge";
import { format } from "date-fns";

export default function RecentOrders({ orders }) {
  const recent = orders.slice(0, 8);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          Aktuelle Aufträge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recent.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium truncate">{order.customer_name || "Unbekannt"}</p>
                  <CustomerTypeBadge type={order.customer_type} />
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{order.address}</p>
                {order.assigned_driver_name && (
                  <p className="text-xs text-muted-foreground mt-0.5">Fahrer: {order.assigned_driver_name}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                <PriorityBadge priority={order.priority} />
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Keine Aufträge vorhanden</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}