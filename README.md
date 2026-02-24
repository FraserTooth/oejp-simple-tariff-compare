# oejp-simple-tariff-compare

A CLI tool for comparing OEJP tariffs built with Bun.

## Prerequisites

- [Bun](https://bun.sh) installed on your system

## Setup

1. Clone the repository
2. Create a `.env` file in the project root with your OEJP credentials:

```bash
cp .env.example .env
```

3. Edit the `.env` file and add your credentials:

```env
OEJP_EMAIL=your-email@example.com
OEJP_PASSWORD=your-password
```

## Usage

Run the CLI tool:

```bash
bun run start
```

Or make it executable and run directly:

```bash
chmod +x index.ts
./index.ts
```

## Environment Variables

The following environment variables are required:

- `OEJP_EMAIL`: Your OEJP account email
- `OEJP_PASSWORD`: Your OEJP account password

If these variables are not set, the CLI will exit with an error message.