import { Skeleton } from "../ui/skeleton";
import AddressSelectorSkeleton from "./AddressSelectorSkeleton";
import OrderSummarySkeleton from "./OrderSummarySkeleton";

const CheckoutSkeleton = () => {
  return (
    <div className="py-4 md:py-8">
      {/* Header */}
      <div className="space-y-2 md:space-y-0 md:flex md:items-center gap-3 mb-6">
        <Skeleton className="h-7 w-28" /> {/* Checkout title */}
        <div className="hidden md:block h-6 w-px bg-gray-200" />
        <Skeleton className="h-4 w-36" /> {/* Subtitle */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Left column - Address selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <AddressSelectorSkeleton />
          </div>
        </div>

        {/* Right column - Order summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <OrderSummarySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton; 