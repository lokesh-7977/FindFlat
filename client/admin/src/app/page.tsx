"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { CategoryChartCard, TrendChartCard } from "@/components/charts-grid";
import { CityChartCard } from "@/components/city-chart";
import { StatsGrid } from "@/components/stats-grid";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";

interface StatsData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

const mockStats: StatsData[] = [
  { title: "Total Flats", value: "1,234", change: "+12%", trend: "up" },
  { title: "Equipment", value: "567", change: "+8%", trend: "up" },
  { title: "Flatmates", value: "890", change: "-3%", trend: "down" },
  { title: "Services", value: "234", change: "+15%", trend: "up" },
];

const trendData = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 180 },
  { label: "Mar", value: 150 },
  { label: "Apr", value: 220 },
  { label: "May", value: 280 },
  { label: "Jun", value: 320 },
];

const categoryData = [
  { label: "Flats", value: 450 },
  { label: "Equipment", value: 280 },
  { label: "Flatmates", value: 320 },
  { label: "Services", value: 180 },
  { label: "Events", value: 150 },
  { label: "Other", value: 90 },
];

const cityData = [
  { label: "Bangalore", value: 520 },
  { label: "Mumbai", value: 380 },
  { label: "Delhi", value: 290 },
  { label: "Hyderabad", value: 210 },
  { label: "Chennai", value: 180 },
  { label: "Pune", value: 150 },
];

function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockStats;
    },
  });
}

export default function Dashboard() {
  const { data: statsData, isLoading: statsLoading } = useStats();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your overview.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
              <Button>Export</Button>
            </div>
          </div>

          <StatsGrid data={statsData} isLoading={statsLoading} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TrendChartCard data={trendData} isLoading={statsLoading} />
            <CategoryChartCard data={categoryData} isLoading={statsLoading} />
          </div>

          <CityChartCard data={cityData} isLoading={statsLoading} />
        </div>
      </main>
    </div>
  );
}