"use client";

import { Building2, Package, TrendingDown, TrendingUp, Users, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface StatsGridProps {
  data?: StatsData[];
  isLoading?: boolean;
  columns?: number;
}

const colorMap: Record<string, string> = {
  "Total Flats": "#3b82f6",
  Equipment: "#10b981",
  Flatmates: "#f59e0b",
  Services: "#ef4444",
};

const iconMap: Record<string, React.ElementType> = {
  "Total Flats": Building2,
  Equipment: Package,
  Flatmates: Users,
  Services: Wrench,
};

export function StatsGrid({ data, isLoading, columns = 4 }: StatsGridProps) {
  const gridClass = columns === 2 
    ? "grid-cols-1 md:grid-cols-2 gap-4" 
    : "grid-cols-2 md:grid-cols-4 gap-4";

  if (isLoading) {
    return (
      <div className={cn("grid", gridClass)}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid", gridClass)}>
      {data?.map((stat) => {
        const Icon = iconMap[stat.title] || Building2;
        const color = colorMap[stat.title] || "#3b82f6";
        
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={cn("text-xs font-medium", stat.trend === "up" ? "text-emerald-500" : "text-red-500")}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}