import { Skeleton } from "../ui/skeleton";

const OrderSummarySkeleton = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <Skeleton className="h-6 w-32 mb-6" /> {/* Order Summary title */}
      
      {/* Order items */}
      <div className="space-y-4 mb-6">
        {[1, 2].map((index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" /> {/* Quantity */}
              <Skeleton className="h-4 w-32" /> {/* Product name */}
              <Skeleton className="h-4 w-12" /> {/* Size */}
            </div>
            <Skeleton className="h-4 w-16" /> {/* Price */}
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-14" /> {/* Subtotal label */}
          <Skeleton className="h-4 w-20" /> {/* Subtotal amount */}
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-14" /> {/* Shipping label */}
          <Skeleton className="h-4 w-8" /> {/* Free */}
        </div>

        <div className="flex justify-between items-center border-t pt-3">
          <Skeleton className="h-5 w-10" /> {/* Total label */}
          <Skeleton className="h-5 w-20" /> {/* Total amount */}
        </div>
      </div>

      {/* Button */}
      <Skeleton className="h-10 w-full mt-6" /> {/* Payment button */}

      {/* Footer text */}
      <Skeleton className="h-3 w-full max-w-[240px] mx-auto mt-4" /> {/* Terms text */}
    </div>
  );
};

export default OrderSummarySkeleton; 