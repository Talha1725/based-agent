import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import {Check} from "lucide-react";

import {cn} from "@/lib/utils";

const Checkbox = React.forwardRef(({className, ...props}, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			"peer h-5 w-5 shrink-0 rounded-none border-2 border-black shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blackCustom data-[state=checked]:border-black", // Apply custom colors here
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-white")}>
			<Check className="h-4 w-4"/>
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export {Checkbox};
