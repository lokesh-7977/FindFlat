"use client";

import * as d3 from "d3";
import * as React from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
	label: string;
	value: number;
}

interface AnimatedBarChartProps {
	data: DataPoint[];
	width?: number;
	height?: number;
	color?: string;
	className?: string;
}

const COLORS = [
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
];

export function AnimatedBarChart({
	data,
	width = 400,
	height = 250,
	color = "#3b82f6",
	className,
}: AnimatedBarChartProps) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	React.useEffect(() => {
		if (!svgRef.current || data.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const margin = { top: 20, right: 20, bottom: 40, left: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, innerWidth])
			.padding(0.3);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value) || 0])
			.nice()
			.range([innerHeight, 0]);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const defs = svg.append("defs");
		const gradient = defs
			.append("linearGradient")
			.attr("id", "bar-gradient-admin")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "0%")
			.attr("y2", "100%");
		gradient
			.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", color)
			.attr("stop-opacity", 1);
		gradient
			.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", d3.color(color)?.darker(0.5)?.toString() || color)
			.attr("stop-opacity", 1);

		g.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => xScale(d.label) || 0)
			.attr("width", xScale.bandwidth())
			.attr("y", innerHeight)
			.attr("height", 0)
			.attr("fill", "url(#bar-gradient-admin)")
			.attr("rx", 4)
			.attr("ry", 4)
			.transition()
			.duration(800)
			.delay((_, i) => i * 100)
			.ease(d3.easeCubicOut)
			.attr("y", (d) => yScale(d.value))
			.attr("height", (d) => innerHeight - yScale(d.value));

		g.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(d3.axisBottom(xScale).tickSize(0))
			.select(".domain")
			.remove();

		g.selectAll(".tick text").attr("fill", "#9ca3af").attr("font-size", "11px");

		g.append("g")
			.call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth))
			.select(".domain")
			.remove();

		g.selectAll(".tick line")
			.attr("stroke", "#e5e7eb")
			.attr("stroke-dasharray", "2,2");
	}, [data, width, height, color]);

	return (
		<svg ref={svgRef} width={width} height={height} className={cn(className)} />
	);
}

interface MultiBarChartProps {
	data: { label: string; series: { name: string; value: number }[] }[];
	width?: number;
	height?: number;
	className?: string;
}

export function MultiBarChart({
	data,
	width = 400,
	height = 250,
	className,
}: MultiBarChartProps) {
	const svgRef = React.useRef<SVGSVGElement>(null);

	React.useEffect(() => {
		if (!svgRef.current || data.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const margin = { top: 20, right: 20, bottom: 40, left: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const labels = data.map((d) => d.label);
		const series = data[0]?.series.map((s) => s.name) || [];

		const x0Scale = d3
			.scaleBand()
			.domain(labels)
			.range([0, innerWidth])
			.padding(0.2);
		const x1Scale = d3
			.scaleBand()
			.domain(series)
			.range([0, x0Scale.bandwidth()])
			.padding(0.1);

		const maxValue = d3.max(data, (d) => d3.max(d.series, (s) => s.value)) || 0;
		const yScale = d3
			.scaleLinear()
			.domain([0, maxValue])
			.nice()
			.range([innerHeight, 0]);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		data.forEach((group, groupIndex) => {
			const groupG = g
				.append("g")
				.attr("transform", `translate(${x0Scale(group.label) || 0},0)`);

			group.series.forEach((item, itemIndex) => {
				groupG
					.append("rect")
					.attr("x", x1Scale(item.name) || 0)
					.attr("width", x1Scale.bandwidth())
					.attr("y", innerHeight)
					.attr("height", 0)
					.attr("fill", COLORS[itemIndex % COLORS.length])
					.attr("rx", 3)
					.transition()
					.duration(600)
					.delay(groupIndex * 100 + itemIndex * 50)
					.ease(d3.easeCubicOut)
					.attr("y", yScale(item.value))
					.attr("height", innerHeight - yScale(item.value));
			});
		});

		g.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(d3.axisBottom(x0Scale).tickSize(0))
			.select(".domain")
			.remove();
		g.selectAll(".tick text").attr("fill", "#9ca3af").attr("font-size", "11px");

		g.append("g")
			.call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth))
			.select(".domain")
			.remove();
		g.selectAll(".tick line")
			.attr("stroke", "#e5e7eb")
			.attr("stroke-dasharray", "2,2");
	}, [data, width, height]);

	return (
		<svg ref={svgRef} width={width} height={height} className={cn(className)} />
	);
}
