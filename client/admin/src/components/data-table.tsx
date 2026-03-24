"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SortableHeaderProps
	extends React.ThHTMLAttributes<HTMLTableCellElement> {
	sortable?: boolean;
	sortDirection?: "asc" | "desc" | false;
	onSort?: (direction: "asc" | "desc") => void;
}

const SortableHeader = React.forwardRef<
	HTMLTableCellElement,
	SortableHeaderProps
>(({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			"h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
			sortable &&
				"cursor-pointer select-none hover:bg-muted/80 transition-colors",
			className,
		)}
		onClick={() =>
			sortable && onSort?.(sortDirection === "asc" ? "desc" : "asc")
		}
		{...props}
	>
		<div className="flex items-center gap-1">
			{children}
			{sortable && (
				<span className="ml-1 flex flex-col">
					<svg
						width="10"
						height="10"
						viewBox="0 0 10 10"
						className={cn(
							sortDirection === "asc"
								? "text-primary"
								: "text-muted-foreground/50",
						)}
					>
						<path d="M5 0L10 10H0L5 0Z" fill="currentColor" />
					</svg>
					<svg
						width="10"
						height="10"
						viewBox="0 0 10 10"
						className={cn(
							sortDirection === "desc"
								? "text-primary"
								: "text-muted-foreground/50 -mt-1",
						)}
					>
						<path d="M5 10L0 0H10L5 10Z" fill="currentColor" />
					</svg>
				</span>
			)}
		</div>
	</th>
));
SortableHeader.displayName = "SortableHeader";

interface DataTableProps<T> {
	data: T[];
	columns: ColumnDef<T, unknown>[];
	searchPlaceholder?: string;
}

export function DataTable<T>({
	data,
	columns,
	searchPlaceholder = "Search...",
}: DataTableProps<T>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data,
		columns,
		state: { sorting, globalFilter, pagination },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const pageCount = table.getPageCount();
	const currentPage = table.getState().pagination.pageIndex + 1;

	return (
		<div className="space-y-4">
			<div className="relative max-w-sm">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder={searchPlaceholder}
					value={globalFilter}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="pl-10"
				/>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const sortDirection = header.column.getIsSorted();
									return (
										<SortableHeader
											key={header.id}
											sortable={canSort}
											sortDirection={
												sortDirection === false
													? false
													: (sortDirection as "asc" | "desc")
											}
											onSort={(direction) =>
												header.column.toggleSorting(direction === "asc")
											}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</SortableHeader>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					Page {currentPage} of {pageCount}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
