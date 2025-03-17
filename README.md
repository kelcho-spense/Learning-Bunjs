# Learning Bun.js

This repository contains resources and examples for learning Bun.js, a fast all-in-one JavaScript runtime.

## What is Bun?

Bun is a modern JavaScript runtime, package manager, and bundler designed as a drop-in replacement for Node.js. It's built from the ground up to focus on three main goals:
- Speed (it's significantly faster than Node.js)
- Developer experience
- Complete tooling (runtime, bundler, test runner, and package manager in one)

## Installation

To install Bun:

```bash
# For macOS, Linux, and WSL
curl -fsSL https://bun.sh/install | bash

# For Windows (via npm)
npm install -g bun

# Verify installation
bun --version
```

## Commonly Used Bun Commands

### Project Initialization

```bash
# Create a new project
bun init

# Initialize with specific options
bun init -y  # Skip prompts with defaults
```

### Package Management

```bash
# Install dependencies
bun install

# Add a package
bun add express

# Add a dev dependency
bun add -d typescript

# Remove a package
bun remove express

# Update packages
bun update

# Run scripts defined in package.json
bun run start
```

### Running JavaScript/TypeScript Files

```bash
# Run a JavaScript file
bun run index.js

# Run a TypeScript file directly (no compilation needed)
bun run index.ts

# Watch mode (restart on file changes)
bun --watch index.ts
```

### Bundling

```bash
# Bundle your application
bun build ./index.ts --outdir ./dist

# Bundle as a module
bun build ./index.ts --outdir ./dist --target browser
```

### Testing

```bash
# Run tests
bun test

# Run specific test file
bun test path/to/test.ts

# Watch tests
bun test --watch
```

### HTTP Server

```bash
# Serve static files
bun --serve index.ts
```

### Environment Variables

```bash
# Load environment variables from .env files
bun run index.ts  # Automatically loads .env

# Specify env file
bun run --env-file .env.local index.ts
```

## Project Structure

```
/
├── src/               # Source code
│   └── index.ts       # Entry point
├── tests/             # Test files
├── package.json       # Project configuration
├── tsconfig.json      # TypeScript configuration (if using TS)
└── README.md          # This file
```

## Performance Comparison

Bun typically performs faster than Node.js for many operations:

- **Startup time**: Up to 4x faster
- **HTTP server throughput**: Up to 2x more requests/sec
- **Package installations**: Up to 20x faster

## Additional Resources

- [Official Bun Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Bun Discord Community](https://discord.com/invite/bun)

## Contributing

Feel free to contribute to this learning repository by submitting pull requests or opening issues for discussions and questions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
