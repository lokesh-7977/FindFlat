"use client";

import * as d3 from "d3";
import * as React from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
	label: string;
	value: number;
}

interface DonutChartProps {
	data: DataPoint[];
	width?: number;
	height?: number;
	className?: string;
}

const COLORS = [
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
	"#14b8a6",
	"#f97316",
];

export function DonutChart({
	data,
	width = 300,
	height = 300,
	className,
}: DonutChartProps) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	React.useEffect(() => {
		if (!svgRef.current || data.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const radius = Math.min(width, height) / 2;
		const innerRadius = radius * 0.6;

		const g = svg
			.append("g")
			.attr("transform", `translate(${width / 2},${height / 2})`);

		const color = d3
			.scaleOrdinal<string>()
			.domain(data.map((d) => d.label))
			.range(COLORS);

		const pie = d3
			.pie<DataPoint>()
			.value((d) => d.value)
			.sort(null)
			.padAngle(0.02);

		const arc = d3
			.arc<d3.PieArcDatum<DataPoint>>()
			.innerRadius(innerRadius)
			.outerRadius(radius - 10);

		const hoverArc = d3
			.arc<d3.PieArcDatum<DataPoint>>()
			.innerRadius(innerRadius)
			.outerRadius(radius);

		const arcs = g
			.selectAll(".arc")
			.data(pie(data))
			.enter()
			.append("g")
			.attr("class", "arc");

		arcs
			.append("path")
			.attr("fill", (d) => color(d.data.label))
			.attr("d", arc)
			.attr("opacity", 0)
			.transition()
			.duration(800)
			.delay((_, i) => i * 100)
			.attr("opacity", 1)
			.attrTween("d", (d) => {
				const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
				return (t) => arc(interpolate(t)) || "";
			});

		arcs
			.select("path")
			.on("mouseenter", function (_event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("d", hoverArc as unknown as string);
			})
			.on("mouseleave", function (_event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("d", arc(d) as unknown as string);
			});

		const total = d3.sum(data, (d) => d.value);
		g.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "-0.2em")
			.attr("font-size", "24px")
			.attr("font-weight", "bold")
			.attr("fill", "#374151")
			.text(total.toLocaleString());

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "1.2em")
			.attr("font-size", "12px")
			.attr("fill", "#9ca3af")
			.text("Total");
	}, [data, width, height]);

	return (
		<div className={cn("flex flex-col items-center", className)}>
			<svg ref={svgRef} width={width} height={height} />
			<div className="flex flex-wrap justify-center gap-4 mt-4">
				{data.map((item, index) => (
					<div key={item.label} className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: COLORS[index % COLORS.length] }}
						/>
						<span className="text-xs text-muted-foreground">{item.label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
