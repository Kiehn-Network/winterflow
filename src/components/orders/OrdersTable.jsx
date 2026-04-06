import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MapPin, ExternalLink } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import PriorityBadge from "../shared/PriorityBadge";
import CustomerTypeBadge from "../shared/CustomerTypeBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersTable({ orders, onEdit, onDelete }) {
  const getMapsUrl = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <Card>
      <CardContent className="p-0">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Kunde</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Priorität</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fahrer</TableHead>
                <TableHead>Tätigkeiten</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{order.customer_name || "—"}</TableCell>
                  <TableCell>
                    <a
                      href={getMapsUrl(order.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">{order.address}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>
                  <TableCell><CustomerTypeBadge type={order.customer_type} /></TableCell>
                  <TableCell><PriorityBadge priority={order.priority} /></TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell>{order.assigned_driver_name || "—"}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {order.tasks?.length > 0 ? order.tasks.join(", ") : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(order)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(order.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3 p-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 rounded-xl bg-muted/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{order.customer_name || "Unbekannt"}</p>
                  <a href={getMapsUrl(order.address)} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {order.address}
                  </a>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(order)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(order.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <CustomerTypeBadge type={order.customer_type} />
                <PriorityBadge priority={order.priority} />
                <StatusBadge status={order.status} />
              </div>
              {order.tasks?.length > 0 && (
                <p className="text-xs text-muted-foreground">{order.tasks.join(", ")}</p>
              )}
              {order.assigned_driver_name && (
                <p className="text-xs text-muted-foreground">Fahrer: {order.assigned_driver_name}</p>
              )}
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Keine Aufträge gefunden
          </div>
        )}
      </CardContent>
    </Card>
  );
}