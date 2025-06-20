"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow, TableHead, TableHeader } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { Package } from "lucide-react";
import { useState, useCallback } from "react";
import OrderDetailDialog from "./OrderDetailDialog";
import OrderTrackingDialog from "./OrderTrackingDialog";
import { Button } from "./ui/button";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<MY_ORDERS_QUERYResult[number] | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<MY_ORDERS_QUERYResult[number] | null>(null);

  const handleCloseTracking = useCallback(() => {
    setTrackingOrder(null);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handleTrackClick = useCallback((order: MY_ORDERS_QUERYResult[number], e: React.MouseEvent) => {
    e.stopPropagation();
    setTrackingOrder(order);
  }, []);

  const handleRowClick = useCallback((order: MY_ORDERS_QUERYResult[number]) => {
    setSelectedOrder(order);
  }, []);

  const getOrderStatusFromTracking = (tracking: any) => {
    if (!tracking?.updates || tracking.updates.length === 0) {
      return null;
    }
    return tracking.updates[tracking.updates.length - 1].status;
  };

  const getOrderStatusDisplay = (order: MY_ORDERS_QUERYResult[number]) => {
    // First check tracking status
    const trackingStatus = getOrderStatusFromTracking(order.tracking);
    if (trackingStatus) {
      return trackingStatus;
    }

    // Use backend order status directly
    return order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1);
  };

  const getStatusColor = (order: MY_ORDERS_QUERYResult[number]) => {
    // First check tracking status
    const trackingStatus = getOrderStatusFromTracking(order.tracking);
    
    if (trackingStatus) {
      switch (trackingStatus) {
        case "Delivered":
          return "bg-green-100 text-green-800";
        case "Out for Delivery":
          return "bg-blue-100 text-blue-800";
        case "Shipped":
          return "bg-blue-100 text-blue-800";
        case "Processing":
          return "bg-yellow-100 text-yellow-800";
        case "Packed":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }

    // Use backend order status directly
    switch (order.orderStatus as 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out for delivery' | 'delivered' | 'cancelled') {
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "packed":
        return "bg-indigo-100 text-indigo-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "out for delivery":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order?.orderNumber}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => handleRowClick(order)}
          >
            <TableCell className="font-medium">
              {order.orderNumber?.slice(-10) ?? "N/A"}...
            </TableCell>
            <TableCell>
              {order?.createdAt &&
                format(new Date(order.createdAt), "dd/MM/yyyy")}
            </TableCell>
            <TableCell>
              <PriceFormatter
                amount={order?.totalAmount}
                className="text-black font-medium"
              />
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order?.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : order?.paymentStatus === "cod"
                    ? "bg-blue-100 text-blue-800"
                    : order?.paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order?.paymentStatus === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order?.paymentStatus 
                  ? order.paymentStatus.toUpperCase()
                  : 'PENDING'}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order)}`}
              >
                {getOrderStatusDisplay(order)}
              </span>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-shop_dark_green"
                onClick={(e) => handleTrackClick(order, e)}
              >
                <Package className="h-4 w-4" />
                Track
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={handleCloseDetails}
      />
      <OrderTrackingDialog
        order={trackingOrder}
        isOpen={!!trackingOrder}
        onClose={handleCloseTracking}
      />
    </>
  );
};

export default OrdersComponent;
