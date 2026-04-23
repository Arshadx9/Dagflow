## Dagflo Project

Dagflo is a modular workflow automation platform designed to orchestrate, schedule, and monitor complex workflows with ease. It supports both API and web interfaces, and is built with scalability and extensibility in mind.

### Monorepo Structure

- **apps/api/**: Backend API service (Node.js/TypeScript)
- **apps/web/**: Frontend web application (Next.js/React)
- **packages/sdk-js/**: JavaScript SDK for interacting with Dagflo
- **prisma/**: Database schema and migrations
- **generated/prisma/**: Generated Prisma client code

### Key Features

- Workflow orchestration and scheduling
- Retry and state management
- Analytics and monitoring
- Authentication and API key management

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install` (from the root)
3. Set up your environment variables as needed
4. Run the API: `cd apps/api && npm run dev`
5. Run the Web app: `cd apps/web && npm run dev`

### Development

- Use `docker-compose.yml` for local development with all services
- Database schema is managed with Prisma (`prisma/schema.prisma`)
- See individual app/package README files for more details

### License

MIT License
