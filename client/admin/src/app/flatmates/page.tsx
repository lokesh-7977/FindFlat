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

const flatmatesData = [
	{
		id: "1",
		name: "John Doe",
		city: "Bangalore",
		age: 28,
		occupation: "Software Engineer",
		budget: 15000,
		gender: "Male",
		status: "Active",
		date: "2024-01-15",
	},
	{
		id: "2",
		name: "Jane Smith",
		city: "Bangalore",
		age: 25,
		occupation: "Designer",
		budget: 12000,
		gender: "Female",
		status: "Active",
		date: "2024-01-14",
	},
	{
		id: "3",
		name: "Mike Johnson",
		city: "Bangalore",
		age: 30,
		occupation: "Marketing Manager",
		budget: 18000,
		gender: "Male",
		status: "Pending",
		date: "2024-01-13",
	},
	{
		id: "4",
		name: "Sarah Williams",
		city: "Bangalore",
		age: 27,
		occupation: "Data Analyst",
		budget: 14000,
		gender: "Female",
		status: "Active",
		date: "2024-01-12",
	},
	{
		id: "5",
		name: "Tom Brown",
		city: "Bangalore",
		age: 32,
		occupation: "Product Manager",
		budget: 20000,
		gender: "Male",
		status: "Inactive",
		date: "2024-01-11",
	},
];

export default function FlatmatesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredFlatmates = flatmatesData.filter((flatmate) => {
		const matchesSearch = flatmate.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || flatmate.status.toLowerCase() === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 bg-gray-50">
				<div className="p-8">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Flatmates</h1>
							<p className="text-gray-500">Manage flatmate profiles</p>
						</div>
						<Button>
							<Plus className="h-4 w-4" />
							Add Flatmate
						</Button>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<div className="relative flex-1 max-w-sm">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										placeholder="Search flatmates..."
										className="pl-10"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
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
										<TableHead>Name</TableHead>
										<TableHead>City</TableHead>
										<TableHead>Age</TableHead>
										<TableHead>Occupation</TableHead>
										<TableHead>Budget</TableHead>
										<TableHead>Gender</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredFlatmates.map((flatmate) => (
										<TableRow key={flatmate.id}>
											<TableCell className="font-medium">
												{flatmate.name}
											</TableCell>
											<TableCell>{flatmate.city}</TableCell>
											<TableCell>{flatmate.age}</TableCell>
											<TableCell>{flatmate.occupation}</TableCell>
											<TableCell>₹{flatmate.budget.toLocaleString()}</TableCell>
											<TableCell className="capitalize">
												{flatmate.gender}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														flatmate.status === "Active"
															? "default"
															: flatmate.status === "Pending"
																? "secondary"
																: "destructive"
													}
												>
													{flatmate.status}
												</Badge>
											</TableCell>
											<TableCell>{flatmate.date}</TableCell>
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
