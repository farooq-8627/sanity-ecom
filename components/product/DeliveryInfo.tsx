import { CornerDownLeft, Truck, Info } from "lucide-react";
import { FaRegQuestionCircle } from "react-icons/fa";

const DeliveryInfo = () => {
  return (
    <div className="space-y-3">
      {/* Delivery Info */}
      <div className="bg-gray-50/50 rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery & Returns</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Truck size={16} className="text-shop_orange flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Free Delivery</p>
              <p className="text-xs text-gray-500">Enter postal code for availability</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CornerDownLeft size={16} className="text-shop_orange flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">7-Day Returns</p>
              <p className="text-xs text-gray-500">Free returns on all orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-1.5 text-xs text-gray-700 py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <FaRegQuestionCircle className="text-shop_orange" />
          <span>Ask a question</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 text-xs text-gray-700 py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Info size={14} className="text-shop_orange" />
          <span>Size guide</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryInfo; 