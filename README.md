# multi-agent-rag-fastrun

- Refer multi-agent-rag-curriculum.md for details.

---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Complete Tech Stack for Multi-Agentic RAG Curriculum

This tech stack covers **end-to-end development** of production multi-agent RAG systems, from local dev to AWS deployment. Organized by architectural layer with exact versions and installation commands.

## 🏗️ Architecture Layers

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Next.js UI    │◄──►│   FastAPI API    │◄──►│ AWS Deployment   │
│ (TypeScript)    │    │ (Python Agents)  │    │ (SageMaker/etc)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   LangGraph     │◄──►│   Vector Store   │◄──►│   Monitoring      │
│ (Multi-Agents)  │    │ (PGVector/Redis) │    │ (LangSmith/etc)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```


## 1. **Frontend (TypeScript Stack)**

| Tool | Version | Purpose | Install |
| :-- | :-- | :-- | :-- |
| **Next.js** | 15.0.0 | Server-side rendered AI chat UI | `npx create-next-app@15` |
| **TypeScript** | 5.6.2 | Type-safe React components | `npm i -D typescript @types/react` |
| **Vercel AI SDK** | ^4.0 | Streaming UI, agent responses | `npm i ai` |
| **shadcn/ui** | latest | Production UI components | `npx shadcn-ui@latest init` |
| **TailwindCSS** | 3.4 | Styling | Included in Next.js template |
| **Zod** | 3.23 | Runtime validation | `npm i zod` |

**Frontend folder structure:**

```
frontend/
├── app/
│   ├── chat/page.tsx      # Main chat interface
│   ├── api/chat/route.ts  # Streaming endpoint
│   └── globals.css
├── components/
│   ├── ui/               # shadcn components
│   └── chat-ui.tsx       # Agent chat window
├── lib/
│   ├── ai.ts            # Vercel AI SDK setup
│   └── utils.ts         # Zod schemas
└── types/
    └── agent.ts         # TypeScript interfaces
```


## 2. **Backend (Python Agentic Stack)**

| Tool | Version | Purpose | Install |
| :-- | :-- | :-- | :-- |
| **Python** | 3.11+ | Core runtime | `pyenv install 3.11.9` |
| **FastAPI** | 0.115 | Production API server | `pip install fastapi[all] uvicorn` |
| **LangChain** | 0.3.x | RAG chains, tools | `pip install langchain langchain-community` |
| **LangGraph** | 0.2.x | Multi-agent orchestration | `pip install langgraph` |
| **Pydantic** | 2.9 | Data validation | `pip install pydantic` |
| **LangServe** | 0.1.x | Agent API deployment | `pip install langserve` |

**Backend folder structure:**

```
backend/
├── app/
│   ├── main.py          # FastAPI app
│   ├── agents/          # Multi-agent logic
│   │   ├── supervisor.py
│   │   ├── researcher.py
│   │   └── synthesizer.py
│   ├── rag/
│   │   ├── pipeline.py
│   │   └── retriever.py
│   └── api/
│       └── chat.py
├── graphs/
│   └── multi_agent_graph.py  # LangGraph workflow
└── config.py
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
| **Chroma** | Local dev vector store | `pip install chromadb` | - |
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
npx create-next-app@15 . --ts --tailwind --eslint --app
npm i ai @ai-sdk/openai zod
npx shadcn-ui@latest init

# Docker for local services
docker-compose up -d postgres redis
```


## 9. **File Structure (Complete)**

```
rag-multi-agent/
├── README.md
├── docker-compose.yml       # Local PGVector + Redis
├── terraform/              # AWS infra
├── backend/
│   ├── pyproject.toml
│   ├── app/
│   ├── graphs/
│   └── tests/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
└── docs/
    └── deployment.md
```


## 🚀 Quick Start Commands

```bash
# 1. Start local services
docker-compose up -d

# 2. Backend dev server
cd backend && poetry shell && uvicorn app.main:app --reload

# 3. Frontend dev server  
cd frontend && npm run dev

# 4. Deploy to AWS (Week 8)
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




