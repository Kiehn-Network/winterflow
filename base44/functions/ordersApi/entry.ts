import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action } = body;

    // GET all orders with status
    if (action === 'list' || !action) {
      const orders = await base44.entities.Order.list('-created_date', 200);
      return Response.json({
        success: true,
        count: orders.length,
        orders: orders.map(o => ({
          id: o.id,
          customer_name: o.customer_name,
          customer_type: o.customer_type,
          address: o.address,
          status: o.status,
          priority: o.priority,
          assigned_driver: o.assigned_driver_name,
          tasks: o.tasks,
          scheduled_date: o.scheduled_date,
          start_time: o.start_time,
          end_time: o.end_time,
          duration_minutes: o.duration_minutes,
          created_date: o.created_date,
        }))
      });
    }

    // GET orders by status
    if (action === 'byStatus') {
      const { status } = body;
      const orders = await base44.entities.Order.filter({ status });
      return Response.json({ success: true, count: orders.length, orders });
    }

    // GET driver status
    if (action === 'driverStatus') {
      const users = await base44.asServiceRole.entities.User.list();
      const drivers = users.filter(u => u.role === 'fahrer');
      const orders = await base44.entities.Order.list();
      
      const driverStatus = drivers.map(d => {
        const activeOrders = orders.filter(o => o.assigned_driver_email === d.email && o.status === 'in_bearbeitung');
        return {
          name: d.full_name,
          email: d.email,
          is_available: d.is_available,
          vehicle: d.vehicle,
          active_orders: activeOrders.length,
          current_location: d.current_latitude ? { lat: d.current_latitude, lng: d.current_longitude } : null,
        };
      });

      return Response.json({ success: true, drivers: driverStatus });
    }

    // CREATE order
    if (action === 'create') {
      const { order } = body;
      if (!order || !order.customer_id || !order.address) {
        return Response.json({ error: 'customer_id and address are required' }, { status: 400 });
      }
      const created = await base44.entities.Order.create(order);
      return Response.json({ success: true, order: created });
    }

    // UPDATE order
    if (action === 'update') {
      const { orderId, data } = body;
      if (!orderId) {
        return Response.json({ error: 'orderId is required' }, { status: 400 });
      }
      const updated = await base44.entities.Order.update(orderId, data);
      return Response.json({ success: true, order: updated });
    }

    return Response.json({ error: 'Unknown action. Use: list, byStatus, driverStatus, create, update' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});