# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a cryptographic learning repository that organizes cryptographic techniques by category with both Markdown documentation and TypeScript sample implementations. It's designed for educational purposes to learn various cryptographic methods.

## Architecture
The project follows a dual-structure approach:
- **Documentation**: `docs/<category>/` contains theoretical explanations, security considerations, and references
- **Implementation**: `src/<category>/` contains minimal TypeScript implementations using Node.js crypto APIs
- **Categories**: symmetric encryption, asymmetric encryption, hash functions, MAC (Message Authentication Code), and digital signatures

Each category has its own subdirectory with:
- `docs/<category>/README.md` - theory and explanation
- `src/<category>/*.ts` - practical TypeScript implementations

## Development Commands
- **Development (watch mode)**: `npm run dev` - runs `tsx watch src/index.ts`
- **Build**: `npm run build` - compiles TypeScript to `dist/`
- **Run built code**: `npm start` or `node dist/index.js`
- **Type checking**: `npm run typecheck`
- **Linting**: `npm run lint` (uses Biome)
- **Formatting**: `npm run format` (uses Biome)
- **Auto-fix**: `npm run fix` (Biome check + write)

## Key Technical Details
- **Language**: TypeScript with ES2022 target and ESM modules
- **Runtime**: Node.js with native `crypto` module
- **Tooling**: Biome for linting/formatting, tsx for development
- **Build output**: `dist/` directory
- **TypeScript config**: Strict mode enabled with additional safety checks

## Code Structure Patterns
- Each cryptographic implementation exports specific functions (e.g., `sha256Hex`, `sha256Base64`)
- Common pattern: accept `string | Uint8Array` inputs
- Use Node.js built-in crypto APIs rather than third-party libraries
- Main entry point: `src/index.ts` with simple console output for testing

## Documentation Template
Use `docs/_template.md` as the structure for new cryptographic method documentation:
- 概要 (Overview)
- 用語と前提知識 (Terms and Prerequisites)
- セキュリティ上の注意 (Security Considerations)
- サンプルコード (Sample Code)
- 参考資料 (References)

## Development Workflow
1. Add new cryptographic methods in appropriate `src/<category>/` directory
2. Create corresponding documentation in `docs/<category>/`
3. Update the main `src/index.ts` if needed for testing
4. Run `npm run typecheck` and `npm run fix` before committing
5. Follow existing patterns for function naming and input/output handling