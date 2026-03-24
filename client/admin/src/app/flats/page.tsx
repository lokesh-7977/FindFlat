"use client";

import { Filter, Plus, Search } from "lucide-react";
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

const flatsData = [
	{
		id: "1",
		title: "2BHK Flat in Koramangala",
		city: "Bangalore",
		type: "2bhk",
		rent: 25000,
		furnishing: "Semi-furnished",
		status: "Active",
		postedBy: "John Doe",
		date: "2024-01-15",
	},
	{
		id: "2",
		title: "1BHK Studio in Whitefield",
		city: "Bangalore",
		type: "studio",
		rent: 18000,
		furnishing: "Furnished",
		status: "Active",
		postedBy: "Jane Smith",
		date: "2024-01-14",
	},
	{
		id: "3",
		title: "3BHK Penthouse in MG Road",
		city: "Bangalore",
		type: "penthouse",
		rent: 55000,
		furnishing: "Furnished",
		status: "Pending",
		postedBy: "Mike Johnson",
		date: "2024-01-13",
	},
	{
		id: "4",
		title: "Shared Room in HSR Layout",
		city: "Bangalore",
		type: "shared",
		rent: 12000,
		furnishing: "Semi-furnished",
		status: "Active",
		postedBy: "Sarah Williams",
		date: "2024-01-12",
	},
	{
		id: "5",
		title: "1BHK in JP Nagar",
		city: "Bangalore",
		type: "1bhk",
		rent: 20000,
		furnishing: "Unfurnished",
		status: "Inactive",
		postedBy: "Tom Brown",
		date: "2024-01-11",
	},
];

export default function FlatsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredFlats = flatsData.filter((flat) => {
		const matchesSearch = flat.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || flat.status.toLowerCase() === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 bg-gray-50">
				<div className="p-8">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Flats</h1>
							<p className="text-gray-500">Manage flat listings</p>
						</div>
						<Button>
							<Plus className="h-4 w-4" />
							Add Flat
						</Button>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<div className="relative flex-1 max-w-sm">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										placeholder="Search flats..."
										className="pl-10"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-40">
										<Filter className="h-4 w-4 mr-2" />
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
										<TableHead>Type</TableHead>
										<TableHead>Rent</TableHead>
										<TableHead>Furnishing</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Posted By</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredFlats.map((flat) => (
										<TableRow key={flat.id}>
											<TableCell className="font-medium">
												{flat.title}
											</TableCell>
											<TableCell>{flat.city}</TableCell>
											<TableCell className="uppercase">{flat.type}</TableCell>
											<TableCell>₹{flat.rent.toLocaleString()}</TableCell>
											<TableCell className="capitalize">
												{flat.furnishing}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														flat.status === "Active"
															? "default"
															: flat.status === "Pending"
																? "secondary"
																: "destructive"
													}
												>
													{flat.status}
												</Badge>
											</TableCell>
											<TableCell>{flat.postedBy}</TableCell>
											<TableCell>{flat.date}</TableCell>
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
