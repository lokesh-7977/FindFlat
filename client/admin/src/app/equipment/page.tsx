"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const equipmentData = [
	{
		id: "1",
		title: "Sony LED TV 42 inch",
		city: "Bangalore",
		category: "electronics",
		condition: "like-new",
		price: 15000,
		status: "Active",
		postedBy: "John Doe",
		date: "2024-01-15",
	},
	{
		id: "2",
		title: "Wooden Sofa Set",
		city: "Bangalore",
		category: "furniture",
		condition: "good",
		price: 25000,
		status: "Active",
		postedBy: "Jane Smith",
		date: "2024-01-14",
	},
	{
		id: "3",
		title: "Samsung Refrigerator",
		city: "Bangalore",
		category: "appliances",
		condition: "new",
		price: 35000,
		status: "Pending",
		postedBy: "Mike Johnson",
		date: "2024-01-13",
	},
	{
		id: "4",
		title: "Microwave Oven",
		city: "Bangalore",
		category: "kitchen",
		condition: "fair",
		price: 5000,
		status: "Active",
		postedBy: "Sarah Williams",
		date: "2024-01-12",
	},
	{
		id: "5",
		title: "Exercise Bike",
		city: "Bangalore",
		category: "fitness",
		condition: "good",
		price: 8000,
		status: "Inactive",
		postedBy: "Tom Brown",
		date: "2024-01-11",
	},
];

const categories = [
	{ value: "all", label: "All Categories" },
	{ value: "furniture", label: "Furniture" },
	{ value: "electronics", label: "Electronics" },
	{ value: "appliances", label: "Appliances" },
	{ value: "kitchen", label: "Kitchen" },
	{ value: "fitness", label: "Fitness" },
	{ value: "books", label: "Books" },
	{ value: "other", label: "Other" },
];

export default function EquipmentPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredEquipment = equipmentData.filter((item) => {
		const matchesSearch = item.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || item.category === categoryFilter;
		const matchesStatus =
			statusFilter === "all" || item.status.toLowerCase() === statusFilter;
		return matchesSearch && matchesCategory && matchesStatus;
	});

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 bg-gray-50">
				<div className="p-8">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
							<p className="text-gray-500">Manage equipment listings</p>
						</div>
						<Button>
							<Plus className="h-4 w-4" />
							Add Equipment
						</Button>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<div className="relative flex-1 max-w-sm">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										placeholder="Search equipment..."
										className="pl-10"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
								<Select
									value={categoryFilter}
									onValueChange={setCategoryFilter}
								>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat.value} value={cat.value}>
												{cat.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>City</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Condition</TableHead>
										<TableHead>Price</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Posted By</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredEquipment.map((item) => (
										<TableRow key={item.id}>
											<TableCell className="font-medium">
												{item.title}
											</TableCell>
											<TableCell>{item.city}</TableCell>
											<TableCell className="capitalize">
												{item.category}
											</TableCell>
											<TableCell className="capitalize">
												{item.condition}
											</TableCell>
											<TableCell>₹{item.price.toLocaleString()}</TableCell>
											<TableCell>
												<Badge
													variant={
														item.status === "Active"
															? "default"
															: item.status === "Pending"
																? "secondary"
																: "destructive"
													}
												>
													{item.status}
												</Badge>
											</TableCell>
											<TableCell>{item.postedBy}</TableCell>
											<TableCell>{item.date}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
