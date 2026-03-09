# multi-agent-rag-fastrun

- Refer multi-agent-rag-curriculum.md for details.

---


# Complete Tech Stack for Multi-Agentic RAG Curriculum

This tech stack covers **end-to-end development** of production multi-agent RAG systems, from local dev to AWS deployment. Organized by architectural layer with exact versions and installation commands.

## 🧠 What is the project about?:

This is a **"Team of Experts"** system. Instead of one AI trying to do everything at once, we’ve split the work between specialized "agents" who talk to each other to give you a high-quality answer.

1.  **The Manager (Supervisor):** The brain of the operation. It listens to your question and decides who should handle it. It coordinates the hand-offs between other agents.
2.  **The Librarian (Researcher Agent):** Searches your "Private Library" (Vector Database). It doesn't just guess; it retrieves actual facts from your PDFs and documents.
3.  **The Writer (Synthesizer Agent):** Takes the Librarian's notes and turns them into a polite, structured, and easy-to-read response.
4.  **RAG (Retrieval-Augmented Generation):** The process of **Searching** for facts first, **Adding** them to the AI's prompt, and then **Writing** the answer.
5.  **The Orchestrator (LangGraph):** The "Flowchart" that ensures the agents don't get stuck in circles and follow a professional process.

## 🏗️ Architecture Layers

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Next.js UI    │◄──►│   FastAPI API    │◄──►│ AWS Deployment   │
│ (TypeScript)    │    │ (Python Agents)  │    │  (Bedrock/S3)    │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   LangGraph     │◄──►│   Vector Store   │◄──►│   Monitoring      │
│ (Multi-Agents)  │    │ (Chroma/PGVector)│    │ (LangSmith/etc)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```


## 1. **Frontend (TypeScript Stack)**

| Tool | Version | Purpose | Install |
| :-- | :-- | :-- | :-- |
| **Next.js** | 15.0.0 | Turbo-powered AI chat UI | `npx create-next-app@15` |
| **TypeScript** | 5.6.2 | Type-safe React components | `npm i -D typescript @types/react` |
| **Vercel AI SDK** | **3.4.33** | Fixed: useChat hook logic | `npm i ai@3.4.33` |
| **Framer Motion** | 12.0+ | Advanced UI transitions | `npm i framer-motion` |
| **Lucide React** | latest | Premium iconography | `npm i lucide-react` |
| **TailwindCSS** | **3.4.17** | Fixed: Stability on v3.4 | `npm i tailwindcss@~3.4.17` |

**Frontend folder structure:**

```
frontend/src/
├── app/
│   ├── page.tsx          # Main Chat UI (Full Layout)
│   ├── api/chat/route.ts  # Streaming proxy to FastAPI
│   └── globals.css       # Tailwind v3 directives
├── components/
│   └── ui/               # shadcn components
```

**Note:** This project uses a custom streaming implementation instead of the Vercel AI SDK for better control over the multi-agent workflow visualization.


## 2. **Backend (Python Agentic Stack)**

| Tool | Version | Purpose | Install |
| :-- | :-- | :-- | :-- |
| **Python** | 3.11+ | Multiagents Conda/Poetry | `conda activate multiagents` |
| **FastAPI** | 0.115 | Real-time streaming API | `pip install fastapi[all]` |
| **LangGraph** | 0.2.x | Multi-agent orchestration | `pip install langgraph` |
| **LangChain AWS**| latest | Bedrock / Titan integration | `pip install langchain-aws` |
| **Boto3** | latest | AWS SDK for Python | `pip install boto3` |
| **ChromaDB** | latest | Offline vector persistence | `pip install chromadb` |

**Backend folder structure:**

```
backend/
├── app/
│   ├── main.py          # FastAPI app
│   ├── agents/          # Multi-agent logic
│   │   ├── state.py     # Agent state definition
│   │   ├── nodes.py     # Researcher & Synthesizer nodes
│   │   └── supervisor.py # Supervisor routing logic
│   ├── rag/
│   │   ├── pipeline.py
│   │   └── retriever.py # ChromaDB vector store
│   └── api/
│       └── chat.py      # Streaming chat endpoint
├── graphs/
│   └── multi_agent_graph.py  # LangGraph workflow
├── pyproject.toml       # Poetry dependencies
└── .env.example         # Environment variables template
```


## 3. **AI Models \& Embeddings**

| Category | Tool | Provider | Purpose |
| :-- | :-- | :-- | :-- |
| **LLMs** | Mistral-7B / Llama3 | AWS Bedrock | Reasoning, generation |
| **Embeddings** | text-embedding-3-large | OpenAI / AWS Bedrock | Vector representations |
| **Reranker** | Cohere Rerank 3.5 | Cohere API | Relevance scoring |

```python
# Model config example
llm = ChatBedrock(
    model_id="mistral.mistral-7b-instruct-v0:2",
    region_name="us-east-1"
)
embeddings = BedrockEmbeddings(model_id="amazon.titan-embed-text-v2:0")
```


## 4. **Data Layer**

| Tool | Purpose | Local | Production |
| :-- | :-- | :-- | :-- |
| **PGVector** | Vector database | Docker Postgres | AWS RDS Postgres |
| **ChromaDB** | Local dev vector store | `pip install langchain-chroma` | - |
| **Redis** | Agent memory, sessions | Docker Redis | AWS ElastiCache |
| **S3** | Document storage | Local MinIO | AWS S3 |

**Docker Compose (local dev):**

```yaml
version: '3.8'
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: rag_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    ports: ["5432:5432"]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
```


## 5. **Tools \& Integrations**

| Tool | Purpose | Install |
| :-- | :-- | :-- |
| **Tavily** | Web search | `pip install tavily-python` |
| **Requests** | HTTP tools | `pip install requests` |
| **Pillow** | Image processing | `pip install pillow` |
| **Python-REPL** | Code execution | `pip install langchain-experimental` |

## 6. **AWS Production Stack**

| Service | Purpose | Setup Command |
| :-- | :-- | :-- |
| **Bedrock** | Managed LLMs | AWS Console → Bedrock |
| **SageMaker** | Custom model endpoints | `aws sagemaker create-endpoint` |
| **Lambda** | Serverless triggers | `aws lambda create-function` |
| **API Gateway** | Public HTTP API | AWS Console → API Gateway |
| **RDS Postgres** | PGVector production | AWS Console → RDS |
| **S3** | Document storage | `aws s3 mb s3://rag-bucket` |
| **CloudWatch** | Monitoring | Automatic |
| **Cognito** | Authentication | AWS Console → Cognito |

## 7. **Development \& MLOps**

| Category | Tools | Purpose |
| :-- | :-- | :-- |
| **Version Control** | Git + GitHub Actions | CI/CD pipeline |
| **Environment** | Poetry / uv | Dependency management |
| **Evaluation** | **RAGAS**, **DeepEval** | Agent performance |
| **Tracing** | **LangSmith** | Debug agent workflows |
| **Infra** | **Terraform** | AWS infrastructure |
| **API Docs** | **Swagger** (FastAPI) | Auto-generated docs |

**Poetry setup:**

```bash
poetry init
poetry add fastapi langchain langgraph pydantic
poetry add --group dev ruff black pytest
```


## 8. **Complete Installation Script**

```bash
#!/bin/bash
# Clone repo structure
mkdir rag-multi-agent && cd rag-multi-agent
mkdir frontend backend shared

# Backend setup
cd backend
poetry init -n
poetry add fastapi uvicorn langchain langgraph langserve pydantic tavily-python
poetry add --group dev ruff pytest

# Frontend setup
cd ../frontend
npm install

# Docker for local services
docker-compose up -d postgres redis
```


## 9. **File Structure (Complete)**

```
rag-multi-agent/
├── .gitignore             # Ignore node_modules, .env, etc.
├── README.md
├── docker-compose.yml     # Local PGVector + Redis
├── install-dependencies.sh # One-click dependency installer
├── terraform/              # AWS infra
├── backend/
│   ├── pyproject.toml
│   ├── poetry.lock
│   ├── .env.example       # AWS credentials template
│   ├── app/
│   ├── graphs/
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── app/
│   └── components/
└── docs/
    └── deployment.md
```


## 🚀 Quick Start Commands

```bash
# 1. Configure AWS credentials (required for Bedrock)
# Option A: Create .env file
cp backend/.env.example backend/.env
# Edit backend/.env with your AWS credentials

# Option B: Use AWS CLI (if installed)
aws configure

# 2. Start local services
docker-compose up -d

# 3. Backend dev server (Poetry 2.0+)
cd backend && poetry run uvicorn app.main:app --reload

# 4. Frontend dev server  
cd frontend && npm run dev

# 5. Deploy to AWS (Week 8)
cd terraform && terraform apply
```

This stack gives you **everything needed** for the 2-month curriculum. Each component maps directly to weekly milestones. Start with local Docker → graduate to full AWS production.[^11][^12][^13]
<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://blogs.oracle.com/developers/build-a-scalable-multi-agent-rag-system-with-a2a-protocol-and-langchain

[^2]: https://www.youtube.com/watch?v=O8C2Tvcbl3E

[^3]: https://datanucleus.dev/rag-and-agentic-ai/agentic-rag-enterprise-guide-2026

[^4]: https://www.linkedin.com/pulse/complete-2026-guide-modern-rag-architectures-how-retrieval-pathan-rx1nf

[^5]: https://www.techment.com/blogs/rag-models-2026-enterprise-ai/

[^6]: https://www.getmaxim.ai/articles/top-5-rag-evaluation-platforms-in-2026/

[^7]: https://hyperight.com/production-rag-golang-onyx-postgresql/

[^8]: https://pub.towardsai.net/the-4-best-open-source-multi-agent-ai-frameworks-2026-9da389f9407a

[^9]: https://haystack.deepset.ai/cookbook/multimodal_agent_with_fastrag_haystack

[^10]: https://codelabsacademy.com/en/blog/multi-agent-systems-agentic-ai-after-chatbots-2026-guide/

[^11]: https://www.idlen.io/blog/ai-full-stack-developer-essential-role-2026

[^12]: https://www.kellton.com/kellton-tech-blog/ai-tech-stack-2026

[^13]: https://aws.amazon.com/blogs/machine-learning/build-a-multi-agent-system-with-langgraph-and-mistral-on-aws/




