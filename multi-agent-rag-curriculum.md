
# 2-Month Multi-Agentic RAG Mastery Curriculum
**Full-Stack AI Engineer Track | AWS Deployment**  
*March 2026 | 20 hrs/week | Prerequisites: Python/TypeScript basics*

## Overview
Build production-ready multi-agent RAG systems from scratch. Master LangGraph orchestration, TypeScript UIs, and AWS deployment. Capstone: Enterprise search agent deployed on SageMaker.

---

## Weeks 1-2: RAG Foundations
**Goal**: Simple → Advanced single-agent RAG

### Week 1: Core RAG Pipeline
```

Day 1-2: LLM basics + Embeddings

- OpenAI/HuggingFace embeddings [https://python.langchain.com/docs/how_to/\#embeddings]
- Chroma/PGVector setup [https://docs.trychroma.com/]

Day 3-4: Document processing

- Chunking strategies (recursive, semantic) [https://python.langchain.com/docs/modules/data_connection/document_transformers/]
- Basic RAG chain [https://python.langchain.com/docs/use_cases/question_answering/]

Day 5-7: Project - PDF Q\&A Bot

- FastAPI RAG endpoint [https://fastapi.tiangolo.com/]
- Deploy: Uvicorn → Railway [https://railway.app/]

```

### Week 2: Advanced RAG
```

- Hybrid search + reranking (Cohere) [https://docs.cohere.com/docs/rerank]
- Evaluation: RAGAS metrics [https://github.com/explodinggradients/ragas]
- Milestone: TypeScript frontend (Next.js 15) [https://nextjs.org/docs]

```

**Deliverable**: Basic RAG API + React chat UI

---

## Weeks 3-4: Single Agentic RAG
**Goal**: Production-ready ReAct agents with memory

### Week 3: LangGraph + Tools
```

Day 1-3: LangGraph basics [https://langchain-ai.github.io/langgraph/]

- ReAct agents, tool calling
- Tavily search tool [https://docs.tavily.com/]

Day 4-5: Agent memory (Redis) [https://redis.io/docs/connect/clients/python/]
Day 6-7: RAG Agent with routing [https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/]

```

### Week 4: Production Single Agent
```

- Error handling, self-correction
- Vercel AI SDK streaming UI [https://sdk.vercel.ai/docs]
- LangSmith evaluation [https://smith.langchain.com/]

```

**Milestone**: Next.js ↔ FastAPI agent chat (streamed responses)

---

## Weeks 5-6: Multi-Agent Systems
**Goal**: Collaborative agent teams

### Week 5: Multi-Agent Architecture
```

Day 1-3: Supervisor-worker pattern [https://langchain-ai.github.io/langgraph/tutorials/]

- Researcher → Retriever → Synthesizer workflow
- Shared state, handoff protocols

Day 4-7: Project - Enterprise Search Team

- Sales docs → competitive intel pipeline
- Tools: DB queries, calculators, web search

```

### Week 6: Advanced Multi-Agent
```

- Conflict resolution, voting mechanisms
- Hierarchical agents (CEO → VPs → Analysts)
- Multi-modal RAG (PDFs + images)

```

**Deliverable**: Multi-agent RAG dashboard (Next.js + shadcn/ui)

---

## Weeks 7-8: AWS Production Deployment
**Goal**: Enterprise-grade MLOps pipeline

### Week 7: AWS Infrastructure
| Service | Purpose | Setup |
|---------|---------|-------|
| **Bedrock** | Managed LLMs | [AWS Bedrock Docs](https://aws.amazon.com/bedrock/) |
| **SageMaker** | Custom models | [SageMaker Endpoints](https://docs.aws.amazon.com/sagemaker/latest/dg/serverless-endpoints.html) |
| **Lambda** | Agent triggers | [Python Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-python.html) |
| **API Gateway** | Public endpoints | [REST API Setup](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html) |

```

CI/CD: GitHub Actions → CloudFormation [https://github.com/aws-actions]
Monitoring: CloudWatch + X-Ray [https://docs.aws.amazon.com/xray/latest/devguide/]

```

### Week 8: Production Polish
```

Security:

- Cognito auth [https://aws.amazon.com/cognito/]
- Guardrails (NeMo) [https://github.com/NVIDIA/NeMo-Guardrails]
- Rate limiting, input sanitization

Capstone Project:
Multi-agent RAG over your ML/DS docs corpus
Live demo: custom domain + HTTPS

```

**Final Deliverable**: GitHub repo + live AWS demo + portfolio video

---

## Tech Stack Summary
```

Frontend: Next.js 15 + TypeScript + Vercel AI SDK + shadcn/ui
Backend: FastAPI + LangGraph + LangChain + LangServe
Infra: AWS (Bedrock/SageMaker/Lambda/API Gateway)
Data: PGVector/Chroma + Redis
MLOps: LangSmith + RAGAS + GitHub Actions

```

---

## Weekly Time Breakdown (20 hrs)
```

5 hrs: Video tutorials + docs
10 hrs: Coding projects
3 hrs: Debugging + optimization
2 hrs: Portfolio documentation

```

## Success Metrics
- [ ] 3 production-ready projects in GitHub
- [ ] Live AWS demo (shareable URL)
- [ ] 80%+ agent success rate (LangSmith)
- [ ] RAGAS retrieval score > 0.85

## Bengaluru Resources
```

AWS User Groups: [https://awsugbengaluru.changeme/]
Startup Credits: AWS Activate [https://aws.amazon.com/activate/]
ML Community: [Bengaluru ML Meetup]

```

---

*Track progress weekly. Build portfolio agents. Deploy everything. 🚀*
```

**Download**: Save as `multi-agent-rag-curriculum.md`
**Next**: Create GitHub repo, start Week 1 today![^11][^12][^13]
<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://github.com/githubtraining/communicating-using-markdown

[^2]: https://github.com/ucoruh/course-note-template

[^3]: https://github.com/aastroza/course-template/blob/main/README.md

[^4]: https://github.com/topics/markdown-cv

[^5]: https://github.com/junian/markdown-resume

[^6]: https://github.com/markdownresume/markdown-resume-templates

[^7]: https://github.com/elipapa/markdown-cv

[^8]: https://github.com/thrly/cv-md

[^9]: https://github.com/mitchelloharawild/vitae

[^10]: https://github.com/topics/markdown-resume

[^11]: https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/

[^12]: https://docs.langchain.com/oss/python/langgraph/agentic-rag

[^13]: https://aws.amazon.com/blogs/machine-learning/build-a-multi-agent-system-with-langgraph-and-mistral-on-aws/

