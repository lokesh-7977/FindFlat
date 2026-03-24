"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedBarChart } from "@/components/charts/bar-chart";

interface CityData {
  label: string;
  value: number;
}

interface CityChartCardProps {
  data: CityData[];
  isLoading?: boolean;
}

export function CityChartCard({ data, isLoading }: CityChartCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Listings by City</CardTitle>
        <CardDescription>Top performing cities</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] bg-gray-100 animate-pulse rounded-lg" />
        ) : (
          <AnimatedBarChart data={data} width={600} height={200} color="#8b5cf6" />
        )}
      </CardContent>
    </Card>
  );
}