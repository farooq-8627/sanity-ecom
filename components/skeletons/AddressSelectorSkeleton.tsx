import { Skeleton } from "../ui/skeleton";

const AddressSelectorSkeleton = () => {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 md:h-7 w-56" /> {/* Title */}
          <Skeleton className="h-4 w-full max-w-[280px]" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-full md:w-[180px]" /> {/* Add New Address button */}
      </div>

      {/* Address cards skeleton */}
      <div className="space-y-4">
        {[1].map((index) => (
          <div
            key={index}
            className="border rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 mt-1 rounded-full shrink-0" /> {/* Radio button */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-24" /> {/* Name */}
                  <Skeleton className="h-5 w-16 rounded-full" /> {/* Default tag */}
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full max-w-[260px]" /> {/* Address line 1 */}
                  <Skeleton className="h-4 w-full max-w-[220px]" /> {/* City, State */}
                  <Skeleton className="h-4 w-full max-w-[180px]" /> {/* Pincode */}
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-4 w-12" /> {/* Phone label */}
                    <Skeleton className="h-4 w-28" /> {/* Phone number */}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" /> {/* Edit button */}
                <Skeleton className="h-8 w-8" /> {/* Delete button */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressSelectorSkeleton; 