"use client";

import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { format } from "date-fns";

interface OrderTrackingDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out for delivery' | 'delivered' | 'cancelled';

const OrderTrackingDialog: React.FC<OrderTrackingDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<MY_ORDERS_QUERYResult[number] | null>(null);

  // Update current order when prop changes
  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
    }
  }, [order]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    setAnimationStarted(false);
    // Small delay before resetting current order
    setTimeout(() => {
      setCurrentOrder(null);
      onClose();
    }, 300);
  }, [onClose]);

  // Start animation when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure dialog is visible first
      const timer = setTimeout(() => {
        setAnimationStarted(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimationStarted(false);
    }
  }, [isOpen]);

  if (!currentOrder) return null;

  const orderStatus = currentOrder.orderStatus as OrderStatus;

  // Get tracking steps based on order status history
  const getTrackingSteps = () => {
    // Check if we have tracking updates
    const trackingUpdates = currentOrder.tracking?.updates || [];
    
    // Create a map of status to timestamp from tracking updates
    const statusTimestamps: Record<string, string> = {};
    trackingUpdates.forEach(update => {
      if (update.status && update.timestamp) {
        // Convert status to lowercase to match our OrderStatus type
        const status = update.status.toLowerCase().replace(/ /g, ' ');
        statusTimestamps[status] = update.timestamp;
      }
    });

    // For cancelled orders, only show Ordered and Cancelled steps
    if (orderStatus === "cancelled") {
      return [
        {
          status: "pending",
          title: "Ordered",
          description: "Your Order has been placed.",
          date: currentOrder.createdAt ? format(new Date(currentOrder.createdAt), "MMM d, yyyy - h:mma") : "",
          isCompleted: true
        },
        {
          status: "cancelled",
          title: "Cancelled",
          description: "Order has been cancelled.",
          date: statusTimestamps["cancelled"] ? 
            format(new Date(statusTimestamps["cancelled"]), "MMM d, yyyy - h:mma") : 
            (currentOrder.updatedAt ? format(new Date(currentOrder.updatedAt), "MMM d, yyyy - h:mma") : ""),
          isCompleted: true
        }
      ];
    }

    const baseSteps = [
      {
        status: "pending",
        title: "Ordered",
        description: "Your Order has been placed.",
        date: currentOrder.createdAt ? format(new Date(currentOrder.createdAt), "MMM d, yyyy - h:mma") : "",
        isCompleted: true
      }
    ];

    const statusFlow = [
      {
        status: "confirmed",
        title: "Confirmed",
        description: "Your order has been confirmed."
      },
      {
        status: "processing",
        title: "Processing",
        description: "Your order is being processed."
      },
      {
        status: "packed",
        title: "Packed",
        description: "Your order has been packed."
      },
      {
        status: "shipped",
        title: "Shipped",
        description: "Your item has been shipped."
      },
      {
        status: "out for delivery",
        title: "Out For Delivery",
        description: "Item is out for delivery."
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Your item has been delivered."
      }
    ];

    const currentStatusIndex = statusFlow.findIndex(step => step.status === orderStatus);
    const isCompleted = (stepStatus: OrderStatus) => {
      const statusOrder = [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out for delivery",
        "delivered"
      ];
      const currentIndex = statusOrder.indexOf(orderStatus);
      const stepIndex = statusOrder.indexOf(stepStatus);
      return stepIndex <= currentIndex && currentIndex !== -1;
    };
    
    return [
      ...baseSteps,
      ...statusFlow.map((step) => {
        const completed = isCompleted(step.status as OrderStatus);
        // Get timestamp from tracking updates if available, otherwise fallback to order.updatedAt
        const timestamp = statusTimestamps[step.status] || (completed ? currentOrder.updatedAt : "");
        
        return {
          ...step,
          date: timestamp ? format(new Date(timestamp), "MMM d, yyyy - h:mma") : "",
          isCompleted: completed
        };
      })
    ];
  };

  const steps = getTrackingSteps();
  
  // Find the last completed step index
  let lastCompletedIndex = -1;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].isCompleted) {
      lastCompletedIndex = i;
    }
  }
  
  // Calculate progress percentage based on the last completed step
  const totalSteps = steps.length - 1;
  
  // Calculate the exact position for each step
  const stepPositions = steps.map((_, index) => {
    return (index / totalSteps) * 100;
  });

  // Get the position of the last completed step
  const completedStepPosition = lastCompletedIndex >= 0 ? 
    stepPositions[lastCompletedIndex] : 0;

  // Calculate the line height based on order status
  const getLineHeight = () => {
    if (!animationStarted) return '0%';
    
    // For cancelled orders, stop at the cancelled step
    if (orderStatus === 'cancelled') {
      return 'calc(100% - 40px)'; // Keep your adjusted value
    }
    
    // For delivered orders, stop at the delivered step
    if (orderStatus === 'delivered') {
      return 'calc(100% - 60px)'; // Keep your adjusted value
    }
    
    // For other statuses, use the calculated position
    return `${completedStepPosition}%`;
  };

  // Helper function to determine if a step should be lit
  const shouldStepBeActive = (stepIndex: number) => {
    if (!animationStarted) return false;

    // For cancelled orders, only show first two steps as active
    if (orderStatus === 'cancelled') {
      return stepIndex <= 1;
    }

    // For delivered orders, all steps should be active
    if (orderStatus === 'delivered') {
      return true;
    }

    // For other statuses, check if the line has reached this step
    const stepPosition = stepPositions[stepIndex];
    const currentProgress = parseFloat(getLineHeight());
    return currentProgress >= stepPosition;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Track Order - {currentOrder.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <div className="relative">
            {/* Background line */}
            <div className="absolute left-[11px] top-6 bottom-6 w-[1px] bg-gray-200" />
            
            {/* Animated progress line */}
            <div 
              className={`absolute left-[11px] top-6 w-[1px] bg-shop_dark_green transition-all duration-[2500ms] ease-in-out`}
              style={{ 
                height: getLineHeight(),
                maxHeight: orderStatus === 'cancelled' ? 'calc(50% - 12px)' : 'calc(100% - 36px)'
              }} 
            />

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isStepActive = shouldStepBeActive(index) && step.isCompleted;
                
                return (
                  <div key={index} className="flex gap-4 items-start">
                    {/* Status circle with animation */}
                    <div 
                      className={`relative z-10 w-6 h-6 flex items-center justify-center transition-colors duration-[2500ms] ${
                        step.isCompleted ? 'bg-white' : 'bg-white'
                      }`}
                    >
                      <div 
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-[2500ms] ${
                          isStepActive ? "bg-shop_dark_green" : "bg-gray-200"
                        }`} 
                      />
                    </div>
                    
                    {/* Content with animation */}
                    <div className="flex-1 -mt-1">
                      <h3 className={`text-sm font-medium transition-colors duration-[2500ms] ${
                        isStepActive ? "text-gray-900" : "text-gray-500"
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm transition-colors duration-[2500ms] ${
                        isStepActive ? "text-gray-600" : "text-gray-400"
                      } mt-0.5`}>
                        {step.description}
                      </p>
                      {step.date && (
                        <p className={`text-xs text-gray-400 mt-0.5 transition-opacity duration-[2500ms] ${
                          isStepActive ? 'opacity-100' : 'opacity-0'
                        }`}>
                          {step.date}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingDialog; 