# HeroUI MCP Server

A Model Context Protocol (MCP) server providing comprehensive access to the [HeroUI](https://www.heroui.com) component library documentation. Deploy this MCP to help AI assistants like Claude Code build consistent, well-designed React applications using HeroUI components.

## 🚀 Quick Deploy

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jgentes/heroui-mcp-cloudflare)

This will deploy your HeroUI MCP server to a URL like: `heroui-mcp.<your-account>.workers.dev/sse`

## 📋 What This MCP Provides

This MCP server gives AI assistants instant access to HeroUI's 50+ React components with 7 specialized tools:

### Available Tools

1. **`list_components`** - Browse all 50 available HeroUI components
2. **`get_component_info`** - Get component details, imports, and basic usage
3. **`get_component_api`** - View complete API reference with props and types
4. **`get_component_slots`** - Explore slot-based customization options
5. **`get_variants_guide`** - Learn the `extendVariants` customization system
6. **`search_components`** - Find components by use case (forms, navigation, overlays, etc.)
7. **`get_theme_info`** - HeroUI theme system and configuration guide

### Component Categories

- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Date Pickers
- **Navigation**: Navbar, Breadcrumbs, Tabs, Links
- **Layout**: Card, Divider, Spacer, Accordion
- **Data Display**: Table, Listbox, Pagination, Avatar, User, Badge
- **Feedback**: Alert, Toast, Progress, Spinner, Skeleton
- **Overlays**: Modal, Drawer, Popover, Tooltip, Dropdown
- **Media**: Image, Avatar
- **And more**: 50+ components total

## 🔌 Installation

### Option 1: Quick Start (if you don't want to deploy to Cloudflare or run your own locally)

Use the public HeroUI MCP server to get started immediately:

**Claude Code:**
```bash
claude mcp add heroui npx mcp-remote https://heroui-mcp-cloudflare.jgentes.workers.dev/sse
```

**Cursor:**

**Install in Cursor:**

To install the HeroUI MCP Server in Cursor, copy and paste the following link into your browser's address bar:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=heroui&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJtY3AtcmVtb3RlIiwiaHR0cHM6Ly9oZXJvdWktbWNwLWNsb3VkZmxhcmUuamdlbnRlcy53b3JrZXJzLmRldi9zc2UiXX0=
```

Or manually add to your Cursor settings:

```json
{
  "mcpServers": {
    "heroui": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://heroui-mcp-cloudflare.jgentes.workers.dev/sse"
      ]
    }
  }
}
```

### Option 2: Deploy Your Own

Deploy your own instance to Cloudflare Workers:

1. Click the "Deploy to Cloudflare Workers" button at the top
2. After deployment, your MCP will be available at: `https://heroui-mcp-cloudflare.<your-account>.workers.dev/sse`
3. Connect to Claude Code:

```bash
claude mcp add heroui npx mcp-remote https://heroui-mcp-cloudflare.<your-account>.workers.dev/sse
```

Or manually edit your config:

```json
{
  "mcpServers": {
    "heroui": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://heroui-mcp-cloudflare.<your-account>.workers.dev/sse"
      ]
    }
  }
}
```

### Option 3: Local Server

For running using the Wrangler CLI:

```bash
# Install dependencies
npm install

# Run locally (starts on http://localhost:8787)
npm run dev
```

Connect to your local instance:

**Claude Code:**
```bash
claude mcp add heroui npx mcp-remote http://localhost:8787/sse
```

**Manual config:**
```json
{
  "mcpServers": {
    "heroui": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"
      ]
    }
  }
}
```

## 🛠️ How It Works

This MCP server fetches documentation directly from [heroui.com](https://www.heroui.com) and provides structured information to AI assistants. It helps ensure:

- ✅ **Consistency** - Correct HeroUI component usage across projects
- ✅ **Efficiency** - Quick component discovery prevents unnecessary custom development
- ✅ **Accuracy** - Direct access to official documentation ensures proper implementation
- ✅ **Customization** - Full support for HeroUI's slots and variants system
- ✅ **Best Practices** - Includes accessibility guidelines and proper usage patterns

## 📚 Example Usage

When connected to Claude Code, you can ask questions like:

- "List all available HeroUI components"
- "Show me how to use the Button component"
- "What slots does the Card component have?"
- "Find components for building forms"
- "How do I customize variants in HeroUI?"

The MCP will provide accurate, up-to-date information from the official HeroUI documentation.

## 🔧 Customization

To modify the MCP server, edit `src/index.ts`:

- Update component lists in the `COMPONENTS` constant
- Add new tools using `this.server.tool(...)`
- Modify search categories in `COMPONENT_MAP`
- Add more slot definitions in `SLOTS_INFO`

## 📦 Versioning & Releases

This project uses [release-it](https://github.com/release-it/release-it) with conventional changelog for versioning.

### For Maintainers

To create a new release:

```bash
npm run release
```

This will:
1. Prompt you to select version bump (patch/minor/major)
2. Update package.json version
3. Generate/update CHANGELOG.md from commit messages
4. Create a git tag
5. Push changes to GitHub
6. Create a GitHub release

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format for automatic changelog generation:

- `feat: add new component tool` - New features (minor version bump)
- `fix: correct slot parsing` - Bug fixes (patch version bump)
- `docs: update installation guide` - Documentation changes
- `chore: update dependencies` - Maintenance tasks
- `BREAKING CHANGE:` in commit body - Breaking changes (major version bump)

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## 📄 License

MIT

## 🙏 Credits

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- Documentation from [HeroUI](https://www.heroui.com)
- Implements the [Model Context Protocol](https://modelcontextprotocol.io/) 
