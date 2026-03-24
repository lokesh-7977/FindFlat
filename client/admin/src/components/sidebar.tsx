"use client";

import {
	Building2,
	LayoutDashboard,
	LogOut,
	Package,
	Settings,
	UserCog,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
	{ title: "Dashboard", href: "/", icon: LayoutDashboard },
	{ title: "Flats", href: "/flats", icon: Building2 },
	{ title: "Equipment", href: "/equipment", icon: Package },
	{ title: "Flatmates", href: "/flatmates", icon: Users },
	{ title: "Services", href: "/services", icon: Wrench },
	{ title: "Users", href: "/users", icon: UserCog },
];

const bottomItems = [{ title: "Settings", href: "/settings", icon: Settings }];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="sticky top-0 flex h-screen w-64 flex-col border-r bg-white shrink-0">
			<div className="flex h-16 items-center border-b px-6 shrink-0">
				<h1 className="text-xl font-bold text-primary">Flatme Admin</h1>
			</div>

			<nav className="flex-1 space-y-1 px-3 py-4">
				{sidebarItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-white"
									: "text-gray-600 hover:bg-gray-100",
							)}
						>
							<item.icon className="h-5 w-5" />
							{item.title}
						</Link>
					);
				})}
			</nav>

			<div className="border-t px-3 py-4">
				{bottomItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-white"
									: "text-gray-600 hover:bg-gray-100",
							)}
						>
							<item.icon className="h-5 w-5" />
							{item.title}
						</Link>
					);
				})}
				<button
					type="button"
					className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 mt-2"
				>
					<LogOut className="h-5 w-5" />
					Logout
				</button>
			</div>
		</div>
	);
}