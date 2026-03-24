"use client";

import { DonutChart } from "@/components/charts/donut-chart";
import { SmoothLineChart } from "@/components/charts/smooth-line-chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface TrendData {
	label: string;
	value: number;
}

interface CategoryData {
	label: string;
	value: number;
}

interface TrendChartCardProps {
	data: TrendData[];
	isLoading?: boolean;
}

interface CategoryChartCardProps {
	data: CategoryData[];
	isLoading?: boolean;
}

export function TrendChartCard({ data, isLoading }: TrendChartCardProps) {
	return (
		<Card className="hover:shadow-lg transition-shadow duration-300">
			<CardHeader>
				<CardTitle>Listing Trends</CardTitle>
				<CardDescription>Monthly listing growth over time</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="h-[200px] bg-gray-100 animate-pulse rounded-lg" />
				) : (
					<SmoothLineChart data={data} width={400} height={200} color="#3b82f6" />
				)}
			</CardContent>
		</Card>
	);
}

export function CategoryChartCard({ data, isLoading }: CategoryChartCardProps) {
	return (
		<Card className="hover:shadow-lg transition-shadow duration-300">
			<CardHeader>
				<CardTitle>Categories</CardTitle>
				<CardDescription>Distribution by category</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="h-[200px] bg-gray-100 animate-pulse rounded-lg" />
				) : (
					<DonutChart data={data} width={300} height={200} />
				)}
			</CardContent>
		</Card>
	);
}
