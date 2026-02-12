import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "HeroUI Component Library",
		version: "1.0.0",
	});

	// All HeroUI components
	private readonly COMPONENTS = [
		"Accordion", "Autocomplete", "Alert", "Avatar", "Badge", "Breadcrumbs",
		"Button", "Calendar", "Card", "Checkbox", "Checkbox Group", "Chip",
		"Circular Progress", "Code", "Date Input", "Date Picker", "Date Range Picker",
		"Divider", "Dropdown", "Drawer", "Form", "Image", "Input", "Input OTP",
		"Kbd", "Link", "Listbox", "Modal", "Navbar", "Number Input", "Pagination",
		"Popover", "Progress", "Radio Group", "Range Calendar", "Scroll Shadow",
		"Select", "Skeleton", "Slider", "Snippet", "Spacer", "Spinner", "Switch",
		"Table", "Tabs", "Toast", "Textarea", "Time Input", "Tooltip", "User"
	];

	// Component categorization for search
	private readonly COMPONENT_MAP: Record<string, string[]> = {
		form: ["Input", "Textarea", "Select", "Checkbox", "Checkbox Group", "Radio Group", "Switch", "Slider", "Date Input", "Date Picker", "Number Input", "Input OTP", "Autocomplete", "Form"],
		input: ["Input", "Textarea", "Select", "Autocomplete", "Number Input", "Date Input", "Time Input", "Input OTP"],
		button: ["Button"],
		navigation: ["Navbar", "Breadcrumbs", "Tabs", "Link"],
		layout: ["Card", "Divider", "Spacer"],
		data: ["Table", "Listbox", "Pagination"],
		feedback: ["Alert", "Toast", "Progress", "Circular Progress", "Spinner", "Skeleton"],
		overlay: ["Modal", "Drawer", "Popover", "Tooltip", "Dropdown"],
		media: ["Image", "Avatar"],
		display: ["Badge", "Chip", "Code", "Kbd", "User"],
		date: ["Calendar", "Date Input", "Date Picker", "Date Range Picker", "Range Calendar", "Time Input"],
		selection: ["Checkbox", "Radio Group", "Select", "Switch", "Autocomplete"],
		menu: ["Dropdown", "Navbar", "Listbox"],
		notification: ["Alert", "Toast"],
		loading: ["Spinner", "Progress", "Circular Progress", "Skeleton"],
	};

	// Component slots information
	private readonly SLOTS_INFO: Record<string, string[]> = {
		card: ["base", "header", "body", "footer"],
		input: ["base", "label", "inputWrapper", "innerWrapper", "input", "description", "errorMessage"],
		select: ["base", "label", "trigger", "value", "listbox", "popover"],
		button: ["base"],
		modal: ["base", "backdrop", "header", "body", "footer", "closeButton"],
		navbar: ["base", "wrapper", "brand", "content", "item", "toggle", "menu"],
		tabs: ["base", "tabList", "tab", "tabContent", "cursor", "panel"],
	};

	// Helper method to convert component name to title case
	private toTitleCase(kebabName: string): string {
		return kebabName
			.split("-")
			.map(w => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	}

	// Helper method to convert component name to PascalCase
	private toPascalCase(kebabName: string): string {
		return kebabName
			.split("-")
			.map(w => w.charAt(0).toUpperCase() + w.slice(1))
			.join("");
	}

	// Helper methods for extracting data from HTML
	private extractDescription(html: string): string {
		// Look for meta description or first paragraph
		const metaMatch = html.match(
			/<meta\s+name="description"\s+content="([^"]+)"/i,
		);
		if (metaMatch) return metaMatch[1];

		const pMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
		return pMatch ? pMatch[1] : "Component description not available";
	}

	private extractImport(html: string): string {
		// Look for import statements in code blocks
		const importMatch = html.match(
			/import\s*{[^}]+}\s*from\s*["']@heroui\/react["']/i,
		);
		return importMatch
			? importMatch[0]
			: 'import { Component } from "@heroui/react"';
	}

	private extractUsage(html: string): string {
		// Extract first code example
		const codeMatch = html.match(/<code[^>]*>([^<]+)<\/code>/i);
		return codeMatch
			? `\`\`\`tsx\n${codeMatch[1]}\n\`\`\``
			: "See documentation for usage examples.";
	}

	async init() {
		// List all available HeroUI components
		this.server.tool("list_components", {}, async () => {
			const componentList = this.COMPONENTS
				.map((name) => {
					const kebabCase = name.toLowerCase().replace(/\s+/g, "-");
					return `- ${name} (${kebabCase})`;
				})
				.join("\n");

			return {
				content: [
					{
						type: "text",
						text: `# HeroUI Components (${this.COMPONENTS.length} total)\n\n${componentList}\n\nUse get_component_info or get_component_api with the kebab-case name to get details.`,
					},
				],
			};
		});

		// Get component information and usage
		this.server.tool(
			"get_component_info",
			{
				component: z
					.string()
					.describe("Component name in kebab-case (e.g., 'button', 'card')"),
			},
			async ({ component }) => {
				const url = `https://www.heroui.com/docs/components/${component}`;

				try {
					const response = await fetch(url);
					if (!response.ok) {
						return {
							content: [
								{
									type: "text",
									text: `Error: Component '${component}' not found. Use list_components to see available components.`,
								},
							],
						};
					}

					const html = await response.text();

					// Extract key information from HTML
					const description = this.extractDescription(html);
					const importStatement = this.extractImport(html);
					const usage = this.extractUsage(html);

					return {
						content: [
							{
								type: "text",
								text: `# ${this.toTitleCase(component)} Component\n\n${description}\n\n## Import\n\`\`\`tsx\n${importStatement}\n\`\`\`\n\n## Basic Usage\n${usage}\n\nFor complete API details, use get_component_api tool.\nFor slots information, use get_component_slots tool.`,
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching component info: ${error instanceof Error ? error.message : String(error)}`,
							},
						],
					};
				}
			},
		);

		// Get component API reference (props, types, defaults)
		this.server.tool(
			"get_component_api",
			{
				component: z
					.string()
					.describe("Component name in kebab-case (e.g., 'button', 'card')"),
			},
			async ({ component }) => {
				const url = `https://www.heroui.com/docs/components/${component}#api`;

				try {
					const response = await fetch(url);
					if (!response.ok) {
						return {
							content: [
								{
									type: "text",
									text: `Error: Component '${component}' API not found.`,
								},
							],
						};
					}

					const _html = await response.text();

					// Extract API information - this is a simplified version
					// In production, you'd parse the actual API tables from the HTML
					return {
						content: [
							{
								type: "text",
								text: `# ${this.toTitleCase(component)} API Reference\n\nVisit the full API documentation at: ${url}\n\nThe API reference includes:\n- All component props with types\n- Default values\n- Prop descriptions\n- Event handlers\n- Slots (if applicable)\n\nNote: For best results, please visit the URL directly as the HTML parsing for detailed API info is complex.`,
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching API info: ${error instanceof Error ? error.message : String(error)}`,
							},
						],
					};
				}
			},
		);

		// Get component slots information
		this.server.tool(
			"get_component_slots",
			{
				component: z
					.string()
					.describe(
						"Component name in kebab-case (e.g., 'card', 'input', 'select')",
					),
			},
			async ({ component }) => {
				const slots = this.SLOTS_INFO[component];
				if (!slots) {
					return {
						content: [
							{
								type: "text",
								text: `No specific slots information available for '${component}'. This component may not use the slots pattern, or slots information is not documented.\n\nTo customize styling, check the component's className prop or use the get_component_api tool.`,
							},
						],
					};
				}

				const slotsList = slots
					.map((slot) => `- **${slot}**: Customizable via classNames.${slot}`)
					.join("\n");

				return {
					content: [
						{
							type: "text",
							text: `# ${this.toTitleCase(component)} Slots\n\nSlots allow granular styling control. Use the \`classNames\` prop:\n\n\`\`\`tsx\n<${this.toPascalCase(component)}\n  classNames={{\n    ${slots.map((s) => `${s}: "your-custom-classes"`).join(",\n    ")}\n  }}\n/>\n\`\`\`\n\n## Available Slots:\n${slotsList}\n\nFor custom variants, use the get_variants_guide tool.`,
						},
					],
				};
			},
		);

		// Get variants customization guide
		this.server.tool("get_variants_guide", {}, async () => {
			return {
				content: [
					{
						type: "text",
						text: `# HeroUI Custom Variants Guide

HeroUI uses the \`extendVariants\` function to create custom component variants.

## Basic Usage

\`\`\`tsx
import { extendVariants, Button } from "@heroui/react";

const MyButton = extendVariants(Button, {
  variants: {
    // Add custom color variants
    color: {
      olive: "text-[#000] bg-[#84cc16]",
      orange: "text-[#fff] bg-[#ff8c00]",
      violet: "text-[#fff] bg-[#8b5cf6]",
    },
    // Add custom size variants
    size: {
      xs: "px-2 min-w-12 h-6 text-tiny gap-1 rounded-small",
      xl: "px-8 min-w-28 h-14 text-large gap-4 rounded-large",
    },
  },
  defaultVariants: {
    color: "olive",
    size: "xl",
  },
  compoundVariants: [
    {
      color: "olive",
      size: "xl",
      class: "bg-gradient-to-tr from-green-500 to-lime-300",
    },
  ],
});
\`\`\`

## Slots Components

For components with slots (like Input, Card):

\`\`\`tsx
import { extendVariants, Input } from "@heroui/react";

const MyInput = extendVariants(Input, {
  variants: {
    color: {
      stone: {
        inputWrapper: "bg-zinc-100 border-zinc-300",
        input: "text-zinc-800",
      },
    },
    size: {
      xs: {
        inputWrapper: "h-6 min-h-6 px-1",
        input: "text-tiny",
      },
    },
  },
});
\`\`\`

## Key Features
- Type-safe variant definitions
- Compound variants for complex combinations
- Works with Tailwind CSS classes
- Preserves original component props
- Automatic class merging

For more details: https://www.heroui.com/docs/customization/custom-variants`,
					},
				],
			};
		});

		// Search components by use case or keywords
		this.server.tool(
			"search_components",
			{
				query: z
					.string()
					.describe(
						"Search query or use case (e.g., 'form input', 'navigation', 'date picker')",
					),
			},
			async ({ query }) => {
				const lowerQuery = query.toLowerCase();
				const matches = new Set<string>();

				// Search in categories
				for (const [category, components] of Object.entries(this.COMPONENT_MAP)) {
					if (lowerQuery.includes(category)) {
						for (const c of components) {
							matches.add(c);
						}
					}
				}

				// Search in component names
				this.COMPONENTS.forEach((component) => {
					if (component.toLowerCase().includes(lowerQuery)) {
						matches.add(component);
					}
				});

				if (matches.size === 0) {
					return {
						content: [
							{
								type: "text",
								text: `No components found matching '${query}'.\n\nTry broader terms like: form, navigation, overlay, feedback, data, layout`,
							},
						],
					};
				}

				const resultList = Array.from(matches)
					.map((name) => {
						const kebab = name.toLowerCase().replace(/\s+/g, "-");
						return `- ${name} (${kebab})`;
					})
					.join("\n");

				return {
					content: [
						{
							type: "text",
							text: `# Components matching "${query}" (${matches.size} found)\n\n${resultList}\n\nUse get_component_info with the kebab-case name for details.`,
						},
					],
				};
			},
		);

		// Get HeroUI theme and configuration information
		this.server.tool("get_theme_info", {}, async () => {
			return {
				content: [
					{
						type: "text",
						text: `# HeroUI Theme System

## Setup

HeroUI requires the HeroUIProvider at the root of your app:

\`\`\`tsx
import { HeroUIProvider } from "@heroui/react";

function App() {
  return (
    <HeroUIProvider>
      {/* Your app content */}
    </HeroUIProvider>
  );
}
\`\`\`

## Color Themes

HeroUI supports color variants:
- **default**: Default gray theme
- **primary**: Primary brand color
- **secondary**: Secondary brand color
- **success**: Green for success states
- **warning**: Yellow/orange for warnings
- **danger**: Red for errors/dangerous actions

## Size Variants

Most components support:
- **sm**: Small size
- **md**: Medium (default)
- **lg**: Large size

## Radius Variants

Control border radius:
- **none**: No border radius
- **sm**: Small radius
- **md**: Medium radius
- **lg**: Large radius
- **full**: Fully rounded

## Dark Mode

HeroUI supports dark mode via the provider:

\`\`\`tsx
<HeroUIProvider theme={{ defaultTheme: "dark" }}>
  {/* Your app */}
</HeroUIProvider>
\`\`\`

## Custom Themes

Create custom themes using Tailwind CSS configuration and the theme prop on HeroUIProvider.

For more details: https://www.heroui.com/docs/customization/theme`,
					},
				],
			};
		});
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
