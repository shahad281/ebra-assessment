Ebra AI Call Orchestrator

overviwe: 

backend service responsible for managing and orchestrating AI-driven phone calls
The system simulates how an intelligent calling platform works:
Clients enqueue call requests, and a background worker service picks them up and processes them concurrently with a maximum of 30 calls running at the same time.

flow:
- Clients send new call requests stored as PENDING.

- The worker continuously checks the database:

- If fewer than 30 calls are IN_PROGRESS, it picks new ones from PENDING and updates their status.

- After 30 seconds, each call is randomly marked as either COMPLETED or FAILED (simulating an external provider).

- You can view aggregated metrics using the /metrics endpoint.

Tech Stack:

- Node.js + Express.js Backend framework
- PostgreSQL Database running inside a Docker container
- Docker and Docker Compose Container orchestration
- TypeScript Typesafe development
- Postman API testing
- Fake AI Provider Simulation Random status updates to mock external provider behavior

How to Run the Project
Run with Docker Compose From the project backend root directory, run: docker-compose up --build
Backend Service on port 3000
PostgreSQL Database  inside a Docker container named db




