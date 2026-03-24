"use client";

import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const usersData = [
	{
		id: "1",
		name: "John Doe",
		email: "john.doe@example.com",
		city: "Bangalore",
		role: "user",
		listings: 5,
		joinedAt: "2023-06-15",
		status: "Active",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane.smith@example.com",
		city: "Bangalore",
		role: "user",
		listings: 3,
		joinedAt: "2023-08-20",
		status: "Active",
	},
	{
		id: "3",
		name: "Mike Johnson",
		email: "mike.johnson@example.com",
		city: "Bangalore",
		role: "user",
		listings: 2,
		joinedAt: "2023-10-05",
		status: "Active",
	},
	{
		id: "4",
		name: "Sarah Williams",
		email: "sarah.w@example.com",
		city: "Bangalore",
		role: "admin",
		listings: 8,
		joinedAt: "2023-05-01",
		status: "Active",
	},
	{
		id: "5",
		name: "Tom Brown",
		email: "tom.brown@example.com",
		city: "Bangalore",
		role: "user",
		listings: 1,
		joinedAt: "2024-01-10",
		status: "Inactive",
	},
];

export default function UsersPage() {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredUsers = usersData.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 bg-gray-50">
				<div className="p-8">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Users</h1>
							<p className="text-gray-500">Manage user accounts</p>
						</div>
						<Button>
							<Plus className="h-4 w-4" />
							Add User
						</Button>
					</div>

					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<div className="relative flex-1 max-w-sm">
									<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
									<Input
										placeholder="Search users..."
										className="pl-10"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>City</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Listings</TableHead>
										<TableHead>Joined</TableHead>
										<TableHead>Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredUsers.map((user) => (
										<TableRow key={user.id}>
											<TableCell className="font-medium">{user.name}</TableCell>
											<TableCell className="text-gray-500">
												{user.email}
											</TableCell>
											<TableCell>{user.city}</TableCell>
											<TableCell>
												<Badge
													variant={
														user.role === "admin" ? "default" : "secondary"
													}
												>
													{user.role}
												</Badge>
											</TableCell>
											<TableCell>{user.listings}</TableCell>
											<TableCell className="text-gray-500">
												{user.joinedAt}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														user.status === "Active" ? "default" : "destructive"
													}
												>
													{user.status}
												</Badge>
											</TableCell>
											<TableCell>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</TableCell>
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
