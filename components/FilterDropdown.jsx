"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const FilterDropdown = ({ value, onValueChange, options, isMultiSelect = false }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]);
	
	useEffect(() => {
		if (isMultiSelect) {
			const filteredSuggestions = options.filter(
				(option) =>
					option.toLowerCase().includes(searchTerm.toLowerCase()) &&
					!selectedItems.includes(option)
			);
			setSuggestions(filteredSuggestions);
		}
	}, [searchTerm, options, selectedItems, isMultiSelect]);
	
	useEffect(() => {
		if (isMultiSelect) {
			setSelectedItems(Array.isArray(value) ? value : []);
		}
	}, [value, isMultiSelect]);
	
	const handleSelectItem = (item) => {
		if (isMultiSelect) {
			const updatedItems = [...selectedItems, item];
			setSelectedItems(updatedItems);
			onValueChange(updatedItems);
			setSearchTerm("");
		} else {
			onValueChange(item);
		}
	};
	
	const handleRemoveItem = (item) => {
		const updatedItems = selectedItems.filter((i) => i !== item);
		setSelectedItems(updatedItems);
		onValueChange(updatedItems);
	};
	
	if (!isMultiSelect) {
		return (
			<div className="space-y-2">
				<Select value={value} onValueChange={onValueChange}>
					<SelectTrigger className="w-[180px] bg-blackCustom text-white rounded-none hover:bg-brownCustom border-black border-2">
						<SelectValue placeholder="All Platforms" />
					</SelectTrigger>
					<SelectContent className="bg-white text-black rounded-none border-gray-300">
						<SelectItem value="all">All Platforms</SelectItem>
						{options.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	}
	
	return (
		<div className="space-y-2">
			<div className="relative">
				<Input
					type="text"
					placeholder="Search skills"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full bg-white  border-2 border-black  text-black border-2 rounded-none "
				/>
				{searchTerm && (
					<div className="absolute z-10 w-full mt-1 bg-white  border border-gray-300  rounded-md shadow-lg">
						{suggestions.map((suggestion, index) => (
							<Button
								key={index}
								onClick={() => handleSelectItem(suggestion)}
								className="w-full text-left text-gray-800  hover:bg-gray-100  px-4 py-2"
							>
								{suggestion}
							</Button>
						))}
					</div>
				)}
			</div>
			<div className="flex flex-wrap gap-2 mt-2">
				{selectedItems.map((item, index) => (
					<Badge
						key={index}
						variant="secondary"
						className="bg-gray-200  text-gray-800 "
					>
						{item}
						<Button
							size="sm"
							variant="ghost"
							onClick={() => handleRemoveItem(item)}
							className="ml-1 p-0 h-auto"
						>
							<X className="h-3 w-3" />
						</Button>
					</Badge>
				))}
			</div>
		</div>
	);
};

export default FilterDropdown;
