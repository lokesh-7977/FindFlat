"use client";

import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 bg-gray-50">
				<div className="p-8">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-gray-900">Settings</h1>
						<p className="text-gray-500">Manage your account settings</p>
					</div>

					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Profile Settings</CardTitle>
								<CardDescription>
									Update your profile information
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										placeholder="Admin Name"
										defaultValue="Admin"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="admin@flatme.com"
										defaultValue="admin@flatme.com"
									/>
								</div>
								<Button>Save Changes</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Change Password</CardTitle>
								<CardDescription>Update your password</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="current">Current Password</Label>
									<Input id="current" type="password" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="new">New Password</Label>
									<Input id="new" type="password" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirm">Confirm Password</Label>
									<Input id="confirm" type="password" />
								</div>
								<Button>Update Password</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
