"use client";

import * as d3 from "d3";
import * as React from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
	label: string;
	value: number;
}

interface SmoothLineChartProps {
	data: DataPoint[];
	width?: number;
	height?: number;
	color?: string;
	className?: string;
}

export function SmoothLineChart({
	data,
	width = 400,
	height = 200,
	color = "#3b82f6",
	className,
}: SmoothLineChartProps) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	React.useEffect(() => {
		if (!svgRef.current || data.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const xScale = d3
			.scalePoint<string>()
			.domain(data.map((d) => d.label))
			.range([0, innerWidth])
			.padding(0.5);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value) || 0])
			.nice()
			.range([innerHeight, 0]);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const line = d3
			.line<DataPoint>()
			.x((d) => xScale(d.label) || 0)
			.y((d) => yScale(d.value))
			.curve(d3.curveCatmullRom.alpha(0.5));

		const area = d3
			.area<DataPoint>()
			.x((d) => xScale(d.label) || 0)
			.y0(innerHeight)
			.y1((d) => yScale(d.value))
			.curve(d3.curveCatmullRom.alpha(0.5));

		const gradient = svg
			.append("defs")
			.append("linearGradient")
			.attr("id", "area-gradient-admin")
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0)
			.attr("y1", yScale(0))
			.attr("x2", 0)
			.attr("y2", yScale(d3.max(data, (d) => d.value) || 0));

		gradient
			.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", color)
			.attr("stop-opacity", 0);
		gradient
			.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", color)
			.attr("stop-opacity", 0.3);

		g.append("path")
			.datum(data)
			.attr("fill", "url(#area-gradient-admin)")
			.attr("d", area)
			.attr("opacity", 0)
			.transition()
			.duration(1000)
			.attr("opacity", 1);

		const path = g
			.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", color)
			.attr("stroke-width", 2.5)
			.attr("d", line);

		const totalLength = path.node()?.getTotalLength() || 0;
		path
			.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(1500)
			.ease(d3.easeQuadOut)
			.attr("stroke-dashoffset", 0);

		g.selectAll(".dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("cx", (d) => xScale(d.label) || 0)
			.attr("cy", (d) => yScale(d.value))
			.attr("r", 0)
			.attr("fill", color)
			.attr("stroke", "white")
			.attr("stroke-width", 2)
			.transition()
			.delay((_, i) => 1000 + i * 100)
			.duration(300)
			.attr("r", 5);

		g.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(d3.axisBottom(xScale).tickSize(0))
			.select(".domain")
			.remove();

		g.append("g")
			.call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth))
			.select(".domain")
			.remove();

		g.selectAll(".tick line")
			.attr("stroke", "#e5e7eb")
			.attr("stroke-dasharray", "2,2");
		g.selectAll(".tick text").attr("fill", "#9ca3af").attr("font-size", "10px");
	}, [data, width, height, color]);

	return (
		<svg ref={svgRef} width={width} height={height} className={cn(className)} />
	);
}
