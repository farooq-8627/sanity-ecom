import { twMerge } from "tailwind-merge";
import { formatCurrency } from "@/lib/utils";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  return (
    <span
      className={twMerge("text-sm font-semibold text-darkColor", className)}
    >
      {formatCurrency(amount)}
    </span>
  );
};

export default PriceFormatter;
