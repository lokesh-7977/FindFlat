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

const servicesData = [
	{
		id: "1",
		title: "Professional Cook Available",
		city: "Bangalore",
		type: "cook",
		contactName: "Ramesh",
		contactPhone: "9876543210",
		monthlyCharge: 8000,
		experience: "5 years",
		status: "Active",
		date: "2024-01-15",
	},
	{
		id: "2",
		title: "Home Cleaning Service",
		city: "Bangalore",
		type: "cleaner",
		contactName: "Priya",
		contactPhone: "9876543211",
		monthlyCharge: 5000,
		experience: "3 years",
		status: "Active",
		date: "2024-01-14",
	},
	{
		id: "3",
		title: "Electrician Services",
		city: "Bangalore",
		type: "electrician",
		contactName: "Suresh",
		contactPhone: "9876543212",
		monthlyCharge: null,
		experience: "10 years",
		status: "Pending",
		date: "2024-01-13",
	},
	{
		id: "4",
		title: "Full-time Maid",
		city: "Bangalore",
		type: "maid",
		contactName: "Lakshmi",
		contactPhone: "9876543213",
		monthlyCharge: 6000,
		experience: "7 years",
		status: "Active",
		date: "2024-01-12",
	},
	{
		id: "5",
		title: "Plumbing Services",
		city: "Bangalore",
		type: "plumber",
		contactName: "Madhav",
		contactPhone: "9876543214",
		monthlyCharge: null,
		experience: "8 years",
		status: "Inactive",
		date: "2024-01-11",
	},
];

const serviceTypes = [
	{ value: "all", label: "All Types" },
	{ value: "maid", label: "Maid" },
	{ value: "cook", label: "Cook" },
	{ value: "cleaner", label: "Cleaner" },
	{ value: "laundry", label: "Laundry" },
	{ value: "babysitter", label: "Babysitter" },
	{ value: "electrician", label: "Electrician" },
	{ value: "plumber", label: "Plumber" },
	{ value: "carpenter", label: "Carpenter" },
	{ value: "painter", label: "Painter" },
	{ value: "pest-control", label: "Pest Control" },
	{ value: "movers", label: "Movers" },
	{ value: "other", label: "Other" },
];

export default function ServicesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredServices = servicesData.filter((service) => {
		const matchesSearch = service.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesType = typeFilter === "all" || service.type === typeFilter;
		const matchesStatus =
			statusFilter === "all" || service.status.toLowerCase() === statusFilter;
		return matchesSearch && matchesType && matchesStatus;
	});

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 bg-gray-50">
				<div className="p-8">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Services</h1>
							<p className="text-gray-500">Manage local services</p>
						</div>
						<Button>
							<Plus className="h-4 w-4" />
							Add Service
						</Button>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<div className="relative flex-1 max-w-sm">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										placeholder="Search services..."
										className="pl-10"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
								<Select value={typeFilter} onValueChange={setTypeFilter}>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Type" />
									</SelectTrigger>
									<SelectContent>
										{serviceTypes.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
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
										<TableHead>Type</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Experience</TableHead>
										<TableHead>Monthly Charge</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredServices.map((service) => (
										<TableRow key={service.id}>
											<TableCell className="font-medium">
												{service.title}
											</TableCell>
											<TableCell>{service.city}</TableCell>
											<TableCell className="capitalize">
												{service.type}
											</TableCell>
											<TableCell>{service.contactName}</TableCell>
											<TableCell>{service.experience}</TableCell>
											<TableCell>
												{service.monthlyCharge
													? `₹${service.monthlyCharge.toLocaleString()}`
													: "-"}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														service.status === "Active"
															? "default"
															: service.status === "Pending"
																? "secondary"
																: "destructive"
													}
												>
													{service.status}
												</Badge>
											</TableCell>
											<TableCell>{service.date}</TableCell>
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
