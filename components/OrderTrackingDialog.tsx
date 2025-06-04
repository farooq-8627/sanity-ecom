"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { Package, Truck, Box, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface TrackingInfo {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  updates: Array<{
    status: string;
    location?: string;
    timestamp: string;
    description?: string;
  }>;
}

interface OrderTrackingDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderTrackingDialog: React.FC<OrderTrackingDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>({
    updates: order?.updates || []
  });

  const refreshTracking = async () => {
    if (!order?._id) return;
    
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/orders/tracking?orderId=${order._id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch tracking information");
      }

      const data = await response.json();
      setTrackingInfo(data.tracking);
      toast.success("Tracking information updated");
    } catch (error) {
      console.error("Error refreshing tracking:", error);
      toast.error("Failed to refresh tracking information");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!order) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
      case "Order Confirmed":
        return <Package className="h-6 w-6" />;
      case "Processing":
      case "Packed":
        return <Box className="h-6 w-6" />;
      case "Shipped":
      case "Out for Delivery":
        return <Truck className="h-6 w-6" />;
      case "Delivered":
        return <CheckCircle2 className="h-6 w-6" />;
      default:
        return <AlertCircle className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Order Placed":
      case "Order Confirmed":
        return "text-blue-600 bg-blue-50";
      case "Processing":
      case "Packed":
        return "text-yellow-600 bg-yellow-50";
      case "Shipped":
      case "Out for Delivery":
        return "text-purple-600 bg-purple-50";
      case "Delivered":
        return "text-green-600 bg-green-50";
      case "Delayed":
      case "Failed Delivery Attempt":
      case "Exception":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Track Order - {order.orderNumber}</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshTracking}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* Current Status */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-shop_dark_green/10">
              <Package className="h-8 w-8 text-shop_dark_green" />
            </div>
            <h3 className="mt-2 text-lg font-semibold">
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </h3>
            <p className="text-gray-500">
              Order placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
            </p>
          </div>

          {/* Tracking Information */}
          {trackingInfo && (
            <div className="space-y-4">
              {trackingInfo.carrier && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Shipping Carrier</p>
                    <p className="font-medium">{trackingInfo.carrier}</p>
                  </div>
                  {trackingInfo.trackingNumber && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="font-medium">{trackingInfo.trackingNumber}</p>
                    </div>
                  )}
                </div>
              )}

              {trackingInfo.estimatedDelivery && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Estimated Delivery</p>
                  <p className="font-medium">
                    {format(new Date(trackingInfo.estimatedDelivery), "MMMM d, yyyy")}
                  </p>
                </div>
              )}

              {/* Tracking Timeline */}
              {trackingInfo.updates && trackingInfo.updates.length > 0 && (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-gray-200">
                  {trackingInfo.updates.map((update: { status: string; location?: string; timestamp: string; description?: string }, index: number) => (
                    <div key={index} className="relative flex items-start gap-6 group">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getStatusColor(update.status)} relative z-10`}>
                        {getStatusIcon(update.status)}
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{update.status}</p>
                          <time className="text-sm text-gray-500">
                            {format(new Date(update.timestamp), "MMM d, h:mm a")}
                          </time>
                        </div>
                        {update.location && (
                          <p className="text-sm text-gray-500">{update.location}</p>
                        )}
                        {update.description && (
                          <p className="mt-1 text-sm text-gray-600">{update.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Track on Carrier Site */}
          {trackingInfo?.trackingUrl && (
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <a
                  href={trackingInfo.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Truck className="h-4 w-4" />
                  Track on Carrier Site
                </a>
              </Button>
            </div>
          )}

          {!trackingInfo && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-yellow-50">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="mt-2 text-base font-semibold">Tracking Not Available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tracking information will be available once the order is processed.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingDialog; 