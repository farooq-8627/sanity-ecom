"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { HelpCircle } from "lucide-react";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

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

    // If no tracking, handle initial order status
    if (order.orderStatus === "pending") {
      if (order.paymentStatus === "paid" || order.paymentStatus === "cod") {
        return "Confirmed";
      }
      return "Pending";
    }

    return order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1);
  };

  const getStatusColor = (order: MY_ORDERS_QUERYResult[number]) => {
    // First check tracking status
    const trackingStatus = getOrderStatusFromTracking(order.tracking);
    
    if (trackingStatus) {
      switch (trackingStatus) {
        case "Delivered":
          return "text-green-600";
        case "Out for Delivery":
          return "text-blue-600";
        case "Shipped":
          return "text-blue-600";
        case "Processing":
          return "text-yellow-600";
        case "Packed":
          return "text-yellow-600";
        default:
          return "text-gray-600";
      }
    }

    // If no tracking status, handle basic order status
    if (order.orderStatus === "pending") {
      if (order.paymentStatus === "paid" || order.paymentStatus === "cod") {
        return "text-green-600";
      }
      return "text-gray-600";
    }

    switch (order.orderStatus as 'pending' | 'confirmed' | 'shipped' | 'out for delivery' | 'delivered' | 'cancelled') {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "out for delivery":
        return "text-blue-600";
      case "confirmed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Order Details - {order?.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Order Information</h3>
              <p>
                <span className="font-medium">Customer:</span> {order.customer.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.customer.email}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {order.createdAt && new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                <span className={`capitalize font-medium ${
                  order.paymentStatus === 'paid' ? 'text-green-600' :
                  order.paymentStatus === 'cod' ? 'text-blue-600' :
                  order.paymentStatus === 'pending' ? 'text-yellow-600' :
                  order.paymentStatus === 'failed' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <span className="font-medium">Order Status:</span>{" "}
                <span className={`capitalize font-medium ${getStatusColor(order)}`}>
                  {getOrderStatusDisplay(order)}
                </span>
              </p>
            </div>

            {/* Shipping Address */}
            <div className="space-y-2">
              <h3 className="font-semibold">Shipping Address</h3>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p>Phone: {order.shippingAddress.phoneNumber}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.product.images && item.product.images[0] && (
                          <Image
                            src={urlFor(item.product.images[0]).url()}
                            alt={item.product.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                        )}
                        <Link
                          href={`/product/${item.product.slug.current}`}
                          className="hover:text-shop_dark_green hover:underline"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{item.size || "N/A"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <PriceFormatter amount={item.price} />
                    </TableCell>
                    <TableCell>
                      <PriceFormatter amount={item.price * item.quantity} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-semibold">
                    Total Amount:
                  </TableCell>
                  <TableCell className="font-semibold">
                    <PriceFormatter amount={order.totalAmount} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Invoice Information */}
          {order.stripeInvoiceId && (
            <div className="space-y-2">
              <h3 className="font-semibold">Invoice Information</h3>
              <p>
                <span className="font-medium">Invoice Number:</span>{" "}
                {order.stripeInvoiceId}
              </p>
              {order.stripeInvoiceUrl && (
                <Button asChild variant="outline" size="sm">
                  <Link href={order.stripeInvoiceUrl} target="_blank">
                    View Invoice
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Contact Support Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button 
              variant="outline" 
              size="lg"
              className="gap-2"
              asChild
            >
              <Link href="/contact">
                <HelpCircle className="h-5 w-5" />
                Have issues with order? Contact us
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
