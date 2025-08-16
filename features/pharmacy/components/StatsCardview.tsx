import React from "react";
import { StatsCard } from "./pharmacy/StatsCard";
import { mockProducts } from "../data";
import { Package, DollarSign, Star, TrendingUp } from "lucide-react";
import { formatTsh } from "@/utils/CurrencyFormatterHelper";

// Mock total sales data (replace with API/orders data)
const mockSales = [
  { amount: 150.0 },
  { amount: 320.5 },
  { amount: 89.99 },
  { amount: 45.75 },
];

const StatsCardView = () => {
  // Calculate stats
  const totalProducts = mockProducts.length;

  const totalSales = mockSales.reduce((sum, sale) => sum + sale.amount, 0);

  const averageRating =
    mockProducts.reduce((sum, product) => sum + product.rating, 0) /
    mockProducts.length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          description="Available for order"
          icon={Package}
        />
        <StatsCard
          title="Total Sales"
          value={` ${formatTsh(totalSales)}`}
          description="Overall revenue"
          icon={DollarSign}
        />
        <StatsCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          description="Customer satisfaction"
          icon={Star}
        />
        <StatsCard
          title="Featured Products"
          value={mockProducts.filter((p) => p.featured).length}
          description="Recommended items"
          icon={TrendingUp}
        />
      </div>
    </>
  );
};

export default StatsCardView;
