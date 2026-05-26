import React, { useState, useEffect } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://bgvtuinbknnolxonttqw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndnR1aW5ia25ub2x4b250dHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTM4MzEsImV4cCI6MjA5NTM4OTgzMX0.GmVqtGEHqr5JrxXdYLSqCgEz73vy2bWR9ZqE3d8X3Gg';

// --- TÀI LIỆU SÁCH & BLOG KINH ĐIỂN ---
const GLOBAL_BOOKS = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", topic: "Distributed systems, data architecture" },
  { title: "Building Microservices", author: "Sam Newman", topic: "Microservices tradeoffs và evolution" },
  { title: "Domain-Driven Design", author: "Eric Evans", topic: "Nền tảng DDD" },
  { title: "Staff Engineer", author: "Will Larson", topic: "Con đường lên Staff+" },
  { title: "The Manager’s Path", author: "Camille Fournier", topic: "Lộ trình từ dev lên leadership" },
  { title: "Team Topologies", author: "Matthew Skelton & Manuel Pais", topic: "Organizational architecture" },
  { title: "Accelerate", author: "Nicole Forsgren, Jez Humble, Gene Kim", topic: "Engineering metrics và performance" }
];

const GLOBAL_BLOGS = [
  { name: "Martin Fowler Blog", url: "https://martinfowler.com", topic: "Architecture patterns, refactoring." },
  { name: "High Scalability", url: "http://highscalability.com", topic: "Case studies hệ thống lớn." },
  { name: "The Pragmatic Engineer", url: "https://blog.pragmaticengineer.com", topic: "Newsletter của Gergely Orosz." },
  { name: "Brendan Gregg’s Blog", url: "https://brendangregg.com", topic: "Performance và systems internals." },
  { name: "Engineering at Meta / Uber / Netflix", url: "#", topic: "Case study thực tế." }
];

// --- FULL SYLLABUS DATA (14 STAGES - 100% ĐẦY ĐỦ) ---
const STAGES = [
  {
    id: "stage-1", index: 1, title: "Stage 1 – Monolith + DDD + Observability",
    problem: "Xây dựng hệ thống bán hàng (products, orders, users, payments, notifications) với business logic phức tạp, cần debug được trong production.",
    solution: "ASP.NET Core Web API, Clean Architecture + DDD (Aggregate, Entity, Value Object, Domain Event in‑process). Background job (Hangfire). Structured logging + correlation id.",
    tech: "C# 12, .NET 8, PostgreSQL, EF Core, Redis, Serilog, Hangfire, xUnit, Testcontainers",
    techResources: [
      { name: "Microsoft Learn – .NET doc", link: "https://learn.microsoft.com/dotnet/" },
      { name: "Hangfire Background Jobs", link: "https://docs.hangfire.io/en/latest/" }
    ],
    challenges: [
      "1. Aggregate Order bảo vệ invariant.", 
      "2. Structured logging với X-Request-ID.", 
      "3. Domain event OrderPlaced → Hangfire email.", 
      "4. Cancel order + hoàn tiền, nhận ra giới hạn của event in‑process.",
      "5. Health checks."
    ],
    constraint: "💰 Sau stage: Budget $50/tháng → bỏ Redis, dùng PostgreSQL cho cache, viết Constraint Tradeoff Report.", 
    time: "4 tuần (Full-time) | 8 tuần (Part-time)",
    resources: [
      { category: "C# / .NET", name: "Microsoft Learn – .NET doc (Chính thống)", link: "https://learn.microsoft.com/dotnet/" },
      { category: "C# / .NET", name: "Microsoft Learn – Học C# (Lộ trình)", link: "https://learn.microsoft.com/dotnet/csharp/" },
      { category: "C# / .NET", name: "The Ultimate .NET Developer Roadmap 2024 (Video)", link: "https://youtube.com" },
      { category: "C# / .NET", name: "milanm/DotNet-Developer-Roadmap (GitHub)", link: "https://github.com/milanm/DotNet-Developer-Roadmap" },
      { category: "Clean Arch", name: "ASP.NET Core 8 Clean Architecture CQRS (GitHub)", link: "https://github.com" },
      { category: "Clean Arch", name: "Repository Pattern in ASP.NET Core (C# Corner)", link: "https://www.c-sharpcorner.com/" },
      { category: "Clean Arch", name: "How to Structure a .NET Solution That Scales (Dev.to)", link: "https://dev.to" },
      { category: "DDD", name: "Microsoft Learn – Domain-Driven Design", link: "https://learn.microsoft.com/" },
      { category: "DDD", name: "Learning Domain-Driven Design (O'Reilly)", link: "https://www.oreilly.com/" },
      { category: "DDD", name: "Domain-Driven Design by Eric Evans (Blue Book)", link: "https://www.domainlanguage.com/ddd/" },
      { category: "DDD", name: "ddd-crew/free-ddd-learning-resources (GitHub)", link: "https://github.com/ddd-crew/free-ddd-learning-resources" }
    ]
  },
  {
    id: "stage-2", index: 2, title: "Stage 2 – Modular Monolith + API Versioning",
    problem: "Codebase phình to, các module thay đổi liên tục, team muốn deploy độc lập nhưng chưa đủ khả năng microservices.",
    solution: "Modular monolith, mỗi module là project riêng. In‑process message bus (MediatR). API versioning. Contract test (Pact).",
    tech: "MediatR, Scrutor, Polly, Hangfire (nâng cao), Pact, Redlock",
    techResources: [
      { name: "MediatR GitHub Repository", link: "https://github.com/jbogard/MediatR" },
      { name: "Pact Contract Testing Documentation", link: "https://docs.pact.io/" }
    ],
    challenges: ["In-process message bus.", "API Versioning trong ASP.NET Core.", "Contract testing.", "Resilience & Fault handling với Polly."],
    constraint: "Không có.", 
    time: "4 tuần (Full-time) | 8 tuần (Part-time)",
    resources: [
      { category: "Messaging", name: "MediatR GitHub Repository", link: "https://github.com/jbogard/MediatR" },
      { category: "Testing", name: "Pact Documentation", link: "https://docs.pact.io/" },
      { category: "Resilience", name: "Polly Documentation", link: "https://github.com/App-vNext/Polly" },
      { category: "Jobs", name: "Hangfire Documentation (nâng cao)", link: "https://docs.hangfire.io/" },
      { category: "API", name: "API Versioning trong ASP.NET Core (Microsoft Learn)", link: "https://learn.microsoft.com/" }
    ]
  },
  {
    id: "stage-3", index: 3, title: "Stage 3 – Extract Microservice + Outbox + Saga",
    problem: "Payment module thay đổi liên tục, deploy toàn bộ monolith quá chậm.",
    solution: "Extract Payment Service (C# .NET), RabbitMQ + Outbox pattern, Saga choreography, schema evolution, queue capacity planning.",
    tech: "RabbitMQ, MassTransit, Outbox table, Idempotency key, Polly, Protobuf",
    techResources: [
      { name: "RabbitMQ Tutorials", link: "https://www.rabbitmq.com/" },
      { name: "MassTransit SAGA and Outbox", link: "https://masstransit.io/" }
    ],
    challenges: ["Phân tách Payment Service.", "Implement Outbox Pattern.", "Thiết lập SAGA Choreography.", "Quản lý Idempotency Key."],
    constraint: "💰 Sau stage: Bỏ RabbitMQ → polling + outbox in‑memory, viết Constraint Tradeoff Report.", 
    maintenance: "⏳ Bảo trì 2 tháng (DB growth, team onboard, incident, cloud bill tăng, feature request) → viết Maintenance Retrospective.", 
    time: "6 tuần (Full-time) | 12 tuần (Part-time)",
    resources: [
      { category: "Architecture", name: "Event-Driven Architecture Pocket Guide", link: "https://github.com" },
      { category: "Pattern", name: "MassTransitOutboxDemo (GitHub)", link: "https://github.com" },
      { category: "Pattern", name: "Event‑Driven Architecture: Async Messaging Patterns (2025)", link: "https://medium.com" },
      { category: "Pattern", name: "Building a Reliable Rollback System with SAGA, Event Sourcing and Outbox", link: "https://medium.com" },
      { category: "Broker", name: "RabbitMQ Tutorials", link: "https://www.rabbitmq.com/getstarted.html" }
    ]
  },
  {
    id: "stage-4", index: 4, title: "Stage 4 – Database Internals + Multi‑tenancy",
    problem: "10M orders, query chậm, deadlock, migration downtime.",
    solution: "Indexing, execution plan, MVCC, partitioning, multi‑tenant (RLS), audit log.",
    tech: "PostgreSQL 16, pg_stat_statements, gh-ost, Liquibase, Row Level Security",
    techResources: [
      { name: "PostgreSQL RLS Guide", link: "https://www.postgresql.org/docs/" },
      { name: "Liquibase Schema Migrations", link: "https://docs.liquibase.com/" }
    ],
    challenges: ["Tối ưu index, giảm deadlock.", "Cấu hình Row Level Security (RLS).", "Partitioning dữ liệu 10 triệu bản ghi."],
    constraint: "Không có.", 
    time: "5 tuần (Full-time) | 10 tuần (Part-time)",
    resources: [
      { category: "PostgreSQL", name: "PostgreSQL Tutorial: Performance Optimization", link: "https://www.postgresql.org/" },
      { category: "PostgreSQL", name: "PostgreSQL 17 QuickStart Pro", link: "https://book.com" },
      { category: "PostgreSQL", name: "PostgreSQL Development Essentials", link: "https://book.com" },
      { category: "Labs", name: "advanced-postgresql-practical-labs (GitHub)", link: "https://github.com" },
      { category: "RLS", name: "Row Level Security in PostgreSQL", link: "https://www.postgresql.org/docs/" }
    ]
  },
  {
    id: "stage-5", index: 5, title: "Stage 5 – Fullstack Dashboard (Next.js)",
    problem: "Dashboard cần realtime, performance cao, dễ bảo trì.",
    solution: "Next.js 14 App Router, feature‑based structure, Zustand, SSE, Storybook.",
    tech: "Next.js, React, Tailwind, Zustand, Playwright, Storybook, Sentry",
    techResources: [
      { name: "Next.js Documentation", link: "https://nextjs.org/docs" },
      { name: "Zustand State Management", link: "https://github.com/pmndrs/zustand" }
    ],
    challenges: ["Xây dựng Real-time SSE.", "Cài đặt End-to-End test với Playwright.", "Thiết kế cấu trúc Next.js App Router."],
    constraint: "Không có.", 
    time: "4 tuần (Full-time) | 8 tuần (Part-time)",
    resources: [
      { category: "Frontend", name: "Next.js Documentation (App Router)", link: "https://nextjs.org/docs" },
      { category: "State", name: "Zustand Documentation", link: "https://github.com/pmndrs/zustand" },
      { category: "Testing", name: "Playwright Documentation", link: "https://playwright.dev" },
      { category: "UI", name: "Storybook Tutorials", link: "https://storybook.js.org/" },
      { category: "Realtime", name: "Server-Sent Events (SSE) in Next.js", link: "https://developer.mozilla.org" }
    ]
  },
  {
    id: "stage-6", index: 6, title: "Stage 6 – Platform / SRE (K8s + Observability)",
    problem: "3 services cần orchestration, auto‑scale, SLO, kiểm soát chi phí.",
    solution: "Kubernetes, Helm, Prometheus, Grafana, Tempo, OpenTelemetry, Chaos Mesh, KEDA, Kubecost.",
    tech: "K8s (minikube/EKS/GKE), Helm, Prometheus, Grafana, Tempo, OpenTelemetry, Chaos Mesh, KEDA",
    techResources: [
      { name: "Kubernetes Basics", link: "https://kubernetes.io/" },
      { name: "KEDA Autoscaling", link: "https://keda.sh/" }
    ],
    challenges: ["Đóng gói Helm Charts & KEDA.", "Tích hợp Distributed Tracing.", "Chaos Testing với Chaos Mesh."],
    constraint: "💰 Sau stage: Thay K8s bằng docker‑compose + systemd, viết Constraint Tradeoff Report.", 
    maintenance: "⏳ Bảo trì 2 tháng (cloud bill tăng, feature request mới, incident, onboarding) → viết Maintenance Retrospective.", 
    time: "10 tuần (Full-time) | 20 tuần (Part-time)",
    resources: [
      { category: "K8s", name: "Kubernetes Basics (Tài liệu tiếng Việt)", link: "https://kubernetes.io/" },
      { category: "K8s Roadmap", name: "Learn Kubernetes from scratch (GitHub)", link: "https://github.com" },
      { category: "K8s Guide", name: "How to Learn Kubernetes in 2026", link: "https://devopscube.com/" },
      { category: "Video", name: "Kubernetes Crash Course for Beginners (YouTube)", link: "https://youtube.com" },
      { category: "Observability", name: "Prometheus Documentation", link: "https://prometheus.io/" },
      { category: "Observability", name: "OpenTelemetry Documentation", link: "https://opentelemetry.io/" },
      { category: "Chaos Eng", name: "Chaos Mesh Documentation", link: "https://chaos-mesh.org/" }
    ]
  },
  {
    id: "stage-7", index: 7, title: "Stage 7 – AI RAG Production",
    problem: "Gọi OpenAI API tốn kém, độ trễ cao, chất lượng không ổn định.",
    solution: "RAG pipeline: embedding cache, semantic cache, reranker, hybrid search (BM25+vector). Evaluation golden dataset, cost tracking.",
    tech: "Python, FastAPI, pgvector, Redis, sentence‑transformers, vLLM, BGE‑reranker, Prometheus",
    techResources: [
      { name: "pgvector similarity search", link: "https://github.com/pgvector/pgvector" },
      { name: "vLLM Serving Engine", link: "https://github.com/vllm-project/vllm" }
    ],
    challenges: ["Xây dựng Hybrid Search (BM25+Vector).", "Tích hợp Semantic Cache.", "Đánh giá chất lượng RAG."],
    constraint: "Không có.", 
    time: "6 tuần (Full-time) | 12 tuần (Part-time)",
    resources: [
      { category: "RAG", name: "Retrieval Augmented Generation from Basic to Advanced (GitHub)", link: "https://github.com" },
      { category: "RAG", name: "RAG_implementations (From Basics to Advanced)", link: "https://github.com" },
      { category: "Book", name: "A Simple Guide to Retrieval Augmented Generation (Manning)", link: "https://manning.com" },
      { category: "Guide", name: "Retrieval-Augmented Generation (RAG) for LLMs: Beginner’s Guide", link: "https://example.com" },
      { category: "Repo", name: "rag-pipeline GitHub", link: "https://github.com" },
      { category: "Vector DB", name: "pgvector Documentation", link: "https://github.com/pgvector/pgvector" }
    ]
  },
  {
    id: "stage-8", index: 8, title: "Stage 8 – URL Shortener + OAuth2",
    problem: "Cần URL shortener cho 10M links, click analytics, TTL cache; và tự host OAuth2.",
    solution: "Consistent hashing, async logging, DB sharding (shortener). Keycloak hoặc OpenIddict cho OAuth2.",
    tech: "Node.js/Go/C#, Redis, PostgreSQL, Kafka (optional), Keycloak, OpenID Connect",
    techResources: [
      { name: "Keycloak Documentation", link: "https://www.keycloak.org/" },
      { name: "Consistent Hashing Algorithm", link: "https://www.toptal.com/web/consistent-hashing" }
    ],
    challenges: ["Thuật toán Consistent Hashing & Sharding.", "Cấu hình Authorization Server.", "Thiết kế TTL Cache."],
    constraint: "Không có.", 
    time: "6 tuần (Full-time) | 12 tuần (Part-time)",
    resources: [
      { category: "System Design", name: "System Design Interview – URL Shortener", link: "https://youtube.com" },
      { category: "Identity", name: "Keycloak Documentation", link: "https://www.keycloak.org/" },
      { category: "Identity", name: "OpenIddict Documentation", link: "https://github.com/openiddict/openiddict-core" },
      { category: "OAuth2", name: "OAuth 2.0 Simplified (Book)", link: "https://oauth.net/2/" }
    ]
  },
  {
    id: "stage-9", index: 9, title: "Stage 9 – Feature Flags + Multi‑Region",
    problem: "Rollout tính năng dần dần, A/B test, kill switch; failover khi region die.",
    solution: "Feature flag service trên Redis hoặc LaunchDarkly. Multi‑region deploy (2 regions), global load balancer, DB replication.",
    tech: "Redis, Next.js, .NET; AWS/GCP, Route53, PostgreSQL logical replication",
    techResources: [
      { name: "Feature Flagging Pattern", link: "https://martinfowler.com/articles/feature-toggles.html" },
      { name: "PostgreSQL Logical Replication", link: "https://www.postgresql.org/docs/current/logical-replication.html" }
    ],
    challenges: ["Implement dynamic feature flag < 5ms.", "PostgreSQL Logical Replication.", "Failover tự động qua DNS Routing."],
    constraint: "💰 Budget $300/tháng → bỏ một region, dùng CDN + read replica, viết Constraint Tradeoff Report.", 
    time: "6 tuần (Full-time) | 12 tuần (Part-time)",
    resources: [
      { category: "Flags", name: "LaunchDarkly Documentation", link: "https://docs.launchdarkly.com" },
      { category: "Database", name: "PostgreSQL Logical Replication", link: "https://www.postgresql.org/" },
      { category: "Routing", name: "AWS Global Accelerator", link: "https://aws.amazon.com" },
      { category: "Code", name: "Feature Flags in .NET", link: "https://learn.microsoft.com" }
    ]
  },
  {
    id: "stage-10", index: 10, title: "Stage X – Legacy & Migration Hell",
    problem: "Thêm tính năng vào monolith 7 năm tuổi (god class, no tests, circular dependency), không được rewrite.",
    solution: "Strangler fig pattern, anti‑corruption layer, incremental extraction, dual‑write + backfill.",
    tech: ".NET Framework / .NET Core hybrid, OpenTelemetry, Pact, feature flags",
    techResources: [
      { name: "Strangler Fig Pattern", link: "https://martinfowler.com/bliki/StranglerFigApplication.html" },
      { name: "Anti-Corruption Layer", link: "https://learn.microsoft.com/" }
    ],
    challenges: ["Áp dụng Strangler Fig Pattern.", "Xây dựng Anti-Corruption Layer (ACL).", "Dual-write và chạy background job backfill."],
    constraint: "👥 Team constraint: chỉ 1 người hiểu legacy → phải viết documentation chi tiết và từ từ chuyển giao.", 
    maintenance: "⏳ Bảo trì 3 tháng (dual‑write lệch, feature request ảnh hưởng cả legacy và new, onboarding developer mới, security audit) → viết Maintenance Retrospective.", 
    time: "8 tuần (Full-time) | 16 tuần (Part-time)",
    resources: [
      { category: "Pattern", name: "Strangler Fig Pattern (Martin Fowler)", link: "https://martinfowler.com" },
      { category: "Pattern", name: "Anti-Corruption Layer (Martin Fowler)", link: "https://martinfowler.com" },
      { category: "Book", name: "Working Effectively with Legacy Code", link: "https://github.com" },
      { category: "Demo", name: "Strangler Fig Application Demo (GitHub)", link: "https://github.com" }
    ]
  },
  {
    id: "stage-11", index: 11, title: "Stage Y – Distributed Systems Theory",
    problem: "Đã implement distributed systems nhưng chưa hiểu sâu (split brain, quorum, distributed lock fallacy).",
    solution: "CAP, PACELC, Raft, CRDT, vector clock, quorum, exactly‑once myth. Xây dựng simulator để ép failure.",
    tech: "Go/C# (simulator), Docker Compose (network partition), Jepsen",
    techResources: [
      { name: "Raft Consensus Algorithm", link: "https://raft.github.io/" },
      { name: "Jepsen Testing Framework", link: "https://jepsen.io/" }
    ],
    challenges: ["Mô phỏng Network Partition với Docker Compose.", "Demo giao thức đồng thuận Raft.", "Xử lý xung đột Vector Clock."],
    constraint: "🧠 Thiết kế hệ thống strong consistency chỉ dùng CRDT (bất khả thi) → viết báo cáo phân tích.", 
    time: "8 tuần (Full-time) | 16 tuần (Part-time)",
    resources: [
      { category: "Book", name: "Designing Data-Intensive Applications", link: "https://dataintensive.net/" },
      { category: "Testing", name: "Jepsen (GitHub)", link: "https://github.com/jepsen-io/jepsen" },
      { category: "Theory", name: "Raft Consensus Algorithm Website", link: "https://raft.github.io/" },
      { category: "Theory", name: "CRDTs (Conflict-free Replicated Data Types)", link: "https://crdt.tech/" },
      { category: "Theory", name: "CAP Theorem (Wikipedia)", link: "https://wikipedia.org" },
      { category: "Simulator", name: "Distributed Systems Simulator (GitHub)", link: "https://github.com" }
    ]
  },
  {
    id: "stage-12", index: 12, title: "Stage Z – Security Engineering (chuyên sâu)",
    problem: "OAuth2 + Keycloak chỉ là bề nổi. Cần phòng thủ đa lớp (SSRF, RCE, container escape).",
    solution: "Threat modeling (STRIDE), SSRF, RCE, deserialization attack, zero trust, Vault (dynamic secrets), Falco, Trivy.",
    tech: "OWASP Top 10, CloudFlare WAF, Falco, Trivy, HashiCorp Vault, gVisor",
    techResources: [
      { name: "STRIDE Threat Modeling", link: "https://www.microsoft.com/" },
      { name: "HashiCorp Vault Documentation", link: "https://vaultproject.io" }
    ],
    challenges: ["Thực hiện Threat Modeling STRIDE.", "Cấu hình Falco runtime security.", "Quản lý dynamic secrets qua Vault."],
    constraint: "💰 Security budget = $0 → chỉ dùng miễn phí (Falco OSS, self‑managed WAF), viết Security Tradeoff Report.", 
    time: "8 tuần (Full-time) | 16 tuần (Part-time)",
    resources: [
      { category: "Guidelines", name: "OWASP Top 10", link: "https://owasp.org/" },
      { category: "Secrets", name: "HashiCorp Vault Documentation", link: "https://vaultproject.io" },
      { category: "Runtime Sec", name: "Falco Documentation", link: "https://falco.org/" },
      { category: "Scanner", name: "Trivy Documentation", link: "https://aquasecurity.github.io/trivy" },
      { category: "Sandbox", name: "gVisor Documentation", link: "https://gvisor.dev" },
      { category: "Book", name: "The Web Application Hacker's Handbook", link: "https://book.com" }
    ]
  },
  {
    id: "stage-13", index: 13, title: "Stage Ω – Computer Systems Internals",
    problem: "Không hiểu vì sao async/await nhanh/chậm, CPU cache invalidate gây performance drop.",
    solution: "Memory layout, GC internals, networking (epoll/kqueue), CPU cache (MESI), lock‑free & concurrency, async runtime. Linux kernel cơ bản.",
    tech: "C# (unsafe, Span<T>), C, Linux perf, eBPF, Valgrind, dotnet‑counters",
    techResources: [
      { name: "eBPF Reference Guide", link: "https://ebpf.io/" },
      { name: "Linux Perf Documentation", link: "https://perf.wiki.kernel.org" }
    ],
    challenges: ["Sử dụng Span<T> tối ưu cấp phát bộ nhớ.", "Sử dụng Linux perf & eBPF.", "Phân tích cache-miss."],
    constraint: "⏱️ Time constraint: chỉ 2 tuần để fix performance regression → bắt buộc dùng profiling, viết Profiling Report.", 
    time: "12 tuần (Full-time) | 24 tuần (Part-time)",
    resources: [
      { category: "Profiling", name: "Linux Perf Documentation", link: "https://perf.wiki.kernel.org" },
      { category: "Tracing", name: "eBPF (BPF and XDP Reference Guide)", link: "https://ebpf.io" },
      { category: "Counters", name: ".NET Performance Counters", link: "https://learn.microsoft.com" },
      { category: "Mem Leak", name: "Valgrind Documentation", link: "https://valgrind.org" },
      { category: "Book", name: "Pro .NET Memory Management", link: "https://book.com" },
      { category: "Book", name: "Systems Performance (Brendan Gregg)", link: "http://www.brendangregg.com/" }
    ]
  },
  {
    id: "stage-14", index: 14, title: "Stage Ξ – Extreme Simplification",
    problem: "Startup với $300/tháng cloud, 2 engineers, deadline 3 ngày. Phải loại bỏ complexity.",
    solution: "Loại bỏ ít nhất 3 thành phần (RabbitMQ, Redis, microservice, K8s). Thiết kế lại với tài nguyên 1/10.",
    tech: "SQLite, monolith, polling, single VM, cron job",
    techResources: [
      { name: "SQLite Documentation", link: "https://sqlite.org/" },
      { name: "systemd Documentation", link: "https://systemd.io" }
    ],
    challenges: ["Chuyển đổi toàn bộ cơ sở dữ liệu về SQLite.", "Thay thế K8s bằng systemd và docker-compose.", "Lập lịch tác vụ bằng Cron."],
    constraint: "💰 Budget $30/tháng, team 1 người → merge service, bỏ K8s, dùng SQLite, viết Extreme Tradeoff Report.", 
    time: "4 tuần (Full-time) | 8 tuần (Part-time)",
    resources: [
      { category: "DB", name: "SQLite Documentation", link: "https://sqlite.org/" },
      { category: "System", name: "systemd Documentation", link: "https://systemd.io" },
      { category: "Talk", name: "Simple Architecture vs Complex Architecture", link: "https://mcfunley.com/" },
      { category: "Architecture", name: "The Majestic Monolith (Martin Fowler)", link: "https://martinfowler.com" }
    ]
  }
];

export default function App() {
  const [supabase, setSupabase] = useState(null);
  const [partner, setPartner] = useState(""); 
  const [partnerName, setPartnerName] = useState("");
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Database States
  const [studyProgress, setStudyProgress] = useState({});
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);
  const [stageTimers, setStageTimers] = useState({});
  const [customTechResources, setCustomTechResources] = useState([]);
  const [ideationList, setIdeationList] = useState([]);
  
  // UI Inputs States
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Both");
  const [reportText, setReportText] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("Constraint Report"); 
  const [editingReportId, setEditingReportId] = useState(null);
  const [chatText, setChatText] = useState("");
  const [discoveryTitle, setDiscoveryTitle] = useState("");
  const [discoveryLink, setDiscoveryLink] = useState("");
  const [discoveryNotes, setDiscoveryNotes] = useState("");
  const [newTechName, setNewTechName] = useState("");
  const [newTechLink, setNewTechLink] = useState("");
  const [showAddTech, setShowAddTech] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [ideaStage, setIdeaStage] = useState("General");
  const [ideaStatus, setIdeaStatus] = useState("Draft");
  
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // --- DYNAMIC SUPABASE INJECTION ---
  useEffect(() => {
    const loadSupabaseScript = () => {
      if (window.supabase) {
        setSupabase(window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      script.async = true;
      script.onload = () => {
        if (window.supabase) {
          setSupabase(window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
        }
      };
      document.body.appendChild(script);
    };
    loadSupabaseScript();
  }, []);

  // --- LOCAL STORAGE PROFILE ---
  useEffect(() => {
    const savedPartner = localStorage.getItem("duo_partner_role");
    const savedName = localStorage.getItem("duo_partner_name");
    if (savedPartner && savedName) {
      setPartner(savedPartner);
      setPartnerName(savedName);
      setIsProfileLoaded(true);
    }
  }, []);

  // --- SUPABASE DATA FETCHING ---
  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      try {
        const [prog, tsk, rep, msg, disc, time, tech, idea] = await Promise.all([
          supabase.from('study_progress').select('*'),
          supabase.from('kanban_tasks').select('*').order('timestamp', { ascending: false }),
          supabase.from('reports').select('*').order('timestamp', { ascending: false }),
          supabase.from('chat').select('*').order('timestamp', { ascending: true }),
          supabase.from('discoveries').select('*').order('timestamp', { ascending: false }),
          supabase.from('stage_timers').select('*'),
          supabase.from('custom_tech').select('*').order('timestamp', { ascending: false }),
          supabase.from('ideation').select('*').order('timestamp', { ascending: false })
        ]);

        const progObj = {};
        (prog.data || []).forEach(p => progObj[p.id] = { "Partner A": p.partner_a, "Partner B": p.partner_b });
        setStudyProgress(progObj);

        const timeObj = {};
        (time.data || []).forEach(t => timeObj[t.id] = { startTime: t.start_time, startedBy: t.started_by });
        setStageTimers(timeObj);

        setTasks((tsk.data || []).map(t => ({ ...t, stageId: t.stage_id, createdBy: t.created_by })));
        setReports((rep.data || []).map(r => ({ ...r, stageId: r.stage_id, stageName: r.stage_name })));
        setChatMessages(msg.data || []);
        setDiscoveries(disc.data || []);
        setCustomTechResources((tech.data || []).map(c => ({ ...c, stageId: c.stage_id, addedBy: c.added_by })));
        setIdeationList(idea.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    const intervalId = setInterval(() => fetchData(), 10000); 
    return () => clearInterval(intervalId);
  }, [supabase, refreshTrigger]);

  // --- ACTIONS ---
  const handleLogin = (role, name) => {
    setPartner(role); setPartnerName(name);
    localStorage.setItem("duo_partner_role", role); localStorage.setItem("duo_partner_name", name);
    setIsProfileLoaded(true);
    showNotification(`Đăng nhập thành công: ${name}`);
  };

  const toggleChallengeCheck = async (stageId, challengeIndex, partnerKey) => {
    if (!supabase) return;
    const docId = `${stageId}_challenge_${challengeIndex}`;
    const currentA = studyProgress[docId]?.["Partner A"] || false;
    const currentB = studyProgress[docId]?.["Partner B"] || false;
    const isA = partnerKey === "Partner A";
    await supabase.from('study_progress').upsert({ id: docId, partner_a: isA ? !currentA : currentA, partner_b: !isA ? !currentB : currentB, last_updated: Date.now() });
    setRefreshTrigger(p => p + 1);
  };

  const toggleResourceCheck = async (stageId, resIndex, partnerKey) => {
    if (!supabase) return;
    const docId = `${stageId}_resource_${resIndex}`;
    const currentA = studyProgress[docId]?.["Partner A"] || false;
    const currentB = studyProgress[docId]?.["Partner B"] || false;
    const isA = partnerKey === "Partner A";
    await supabase.from('study_progress').upsert({ id: docId, partner_a: isA ? !currentA : currentA, partner_b: !isA ? !currentB : currentB, last_updated: Date.now() });
    setRefreshTrigger(p => p + 1);
  };

  const handleStartTimer = async (stageId) => {
    if (!supabase) return;
    await supabase.from('stage_timers').upsert({ id: stageId, start_time: Date.now(), started_by: partnerName });
    setRefreshTrigger(p => p + 1);
    showNotification("Bắt đầu tính thời gian!");
  };

  const handleAddCustomTech = async (e, stageId) => {
    e.preventDefault();
    if (!newTechName.trim() || !supabase) return;
    await supabase.from('custom_tech').insert([{ stage_id: stageId, name: newTechName, link: newTechLink, added_by: partnerName, timestamp: Date.now() }]);
    setNewTechName(""); setNewTechLink(""); setShowAddTech(false);
    setRefreshTrigger(p => p + 1);
    showNotification("Đã bổ sung tài liệu!");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !supabase) return;
    let stageId = "general";
    if (currentView.startsWith("stage-")) {
      const idx = parseInt(currentView.replace("stage-", ""));
      stageId = STAGES[idx].id;
    }
    await supabase.from('kanban_tasks').insert([{ title: newTaskTitle, assignee: newTaskAssignee, status: "Pending", stage_id: stageId, created_by: partnerName, timestamp: Date.now() }]);
    setNewTaskTitle(""); setRefreshTrigger(p => p + 1);
    showNotification("Đã thêm Task mới!");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!supabase) return;
    await supabase.from('kanban_tasks').update({ status: newStatus }).eq('id', taskId);
    setRefreshTrigger(p => p + 1);
  };

  const deleteTask = async (taskId) => {
    if (!supabase) return;
    await supabase.from('kanban_tasks').delete().eq('id', taskId);
    setRefreshTrigger(p => p + 1);
  };

  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportText.trim() || !supabase) return;
    let stageId = "general", stageName = "Chung";
    if (currentView.startsWith("stage-")) {
      const idx = parseInt(currentView.replace("stage-", ""));
      stageId = STAGES[idx].id; stageName = STAGES[idx].title;
    }
    const payload = { title: reportTitle, text: reportText, type: reportType, stage_id: stageId, stage_name: stageName, author: partnerName, timestamp: Date.now() };
    if (editingReportId) {
      await supabase.from('reports').update(payload).eq('id', editingReportId);
      setEditingReportId(null); showNotification("Đã cập nhật tài liệu!");
    } else {
      await supabase.from('reports').insert([payload]);
      showNotification("Đã lưu tài liệu thành công!");
    }
    setReportTitle(""); setReportText(""); setRefreshTrigger(p => p + 1);
  };

  const deleteReport = async (repId) => {
    if (!supabase) return;
    await supabase.from('reports').delete().eq('id', repId);
    setRefreshTrigger(p => p + 1); showNotification("Đã xóa báo cáo.");
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatText.trim() || !supabase) return;
    await supabase.from('chat').insert([{ text: chatText, sender: partnerName, role: partner, timestamp: Date.now() }]);
    setChatText(""); setRefreshTrigger(p => p + 1);
  };

  const handleAddDiscovery = async (e) => {
    e.preventDefault();
    if (!discoveryTitle.trim() || !supabase) return;
    await supabase.from('discoveries').insert([{ title: discoveryTitle, link: discoveryLink, notes: discoveryNotes, author: partnerName, role: partner, timestamp: Date.now() }]);
    setDiscoveryTitle(""); setDiscoveryLink(""); setDiscoveryNotes(""); setRefreshTrigger(p => p + 1);
    showNotification("Đã ghim phát hiện mới!");
  };

  const deleteDiscovery = async (id) => {
    if (!supabase) return;
    await supabase.from('discoveries').delete().eq('id', id);
    setRefreshTrigger(p => p + 1);
  };

  const handleAddIdea = async (e) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !supabase) return;
    await supabase.from('ideation').insert([{ title: ideaTitle, desc: ideaDesc, stage: ideaStage, status: "Draft", author: partnerName, timestamp: Date.now(), likes: 0 }]);
    setIdeaTitle(""); setIdeaDesc(""); setIdeaStage("General"); setIdeaStatus("Draft"); setRefreshTrigger(p => p + 1);
    showNotification("Ý tưởng đã được ghim lên bảng!");
  };

  const updateIdeaStatus = async (id, status) => {
    if (!supabase) return;
    await supabase.from('ideation').update({ status }).eq('id', id);
    setRefreshTrigger(p => p + 1);
  };

  const deleteIdea = async (id) => {
    if (!supabase) return;
    await supabase.from('ideation').delete().eq('id', id);
    setRefreshTrigger(p => p + 1);
  };

  const getStageStats = (stage) => {
    const total = stage.challenges.length + stage.resources.length;
    let compA = 0, compB = 0;
    stage.challenges.forEach((_, i) => {
      if (studyProgress[`${stage.id}_challenge_${i}`]?.["Partner A"]) compA++;
      if (studyProgress[`${stage.id}_challenge_${i}`]?.["Partner B"]) compB++;
    });
    stage.resources.forEach((_, i) => {
      if (studyProgress[`${stage.id}_resource_${i}`]?.["Partner A"]) compA++;
      if (studyProgress[`${stage.id}_resource_${i}`]?.["Partner B"]) compB++;
    });
    return { pctA: total > 0 ? Math.round((compA / total) * 100) : 0, pctB: total > 0 ? Math.round((compB / total) * 100) : 0 };
  };

  // ================= LOGIN SCREEN =================
  if (!isProfileLoaded) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden font-sans">
        <div className="w-full max-w-4xl z-10 px-6">
          <div className="text-center mb-16 flex flex-col items-center">
            <img src="image_cd5f46.jpg" alt="Logo" className="w-40 h-40 rounded-full mb-6 border-[6px] border-[#1e293b] shadow-2xl object-cover" onError={(e) => e.target.style.display='none'} />
            <h1 className="text-[40px] font-black tracking-widest uppercase mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-sm">CHIẾN BINH PHỤC THÙ</h1>
            <p className="text-slate-400 text-lg font-medium">Hệ thống Quản lý Học tập & Kiến trúc Phần mềm</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button onClick={() => handleLogin("Partner A", "Thịnh")} className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 p-8 rounded-2xl transition-all duration-300 text-center shadow-xl hover:-translate-y-1 group">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-600 flex items-center justify-center text-2xl text-white font-bold mb-4 shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform">T</div>
              <h2 className="text-2xl font-bold text-white mb-1">Thịnh</h2>
              <p className="text-slate-400 text-sm font-medium">Đăng nhập Workspace →</p>
            </button>
            <button onClick={() => handleLogin("Partner B", "Khang")} className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 p-8 rounded-2xl transition-all duration-300 text-center shadow-xl hover:-translate-y-1 group">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-2xl text-white font-bold mb-4 shadow-lg shadow-blue-900/50 group-hover:scale-105 transition-transform">K</div>
              <h2 className="text-2xl font-bold text-white mb-1">Khang</h2>
              <p className="text-slate-400 text-sm font-medium">Đăng nhập Workspace →</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN APPLICATION DASHBOARD (OWNER DASHBOARD STYLE) =================
  const NavItem = ({ id, label, icon }) => {
    const isActive = currentView === id;
    return (
      <div className="px-4 py-1">
        <button onClick={() => setCurrentView(id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-[#10b981] text-white shadow-md shadow-emerald-900/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'}`}>
          <span className="text-xl w-6 flex justify-center opacity-80">{icon}</span><span className="text-[14px]">{label}</span>
        </button>
      </div>
    );
  };

  const activeStageIndex = currentView.startsWith("stage-") ? parseInt(currentView.replace("stage-", "")) : null;
  const activeStage = activeStageIndex !== null ? STAGES[activeStageIndex] : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans">
      
      {/* MAC-STYLE CUSTOM SCROLLBAR & ANIMATIONS */}
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        aside::-webkit-scrollbar-thumb { background-color: #334155; }
        aside::-webkit-scrollbar-thumb:hover { background-color: #475569; }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* SIDEBAR (Dark Theme - "#0f172a") */}
      <aside className="w-[280px] bg-[#0f172a] flex flex-col shrink-0 h-screen sticky top-0 z-20 border-r border-slate-800">
        
        {/* Brand Header */}
        <div className="px-6 pt-8 pb-6 flex items-center gap-3">
          <img src="image_cd5f46.jpg" alt="Logo" className="w-10 h-10 rounded-full object-cover shadow-md border-2 border-slate-700" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          <div style={{display: 'none'}} className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center text-white font-bold">CB</div>
          <h1 className="text-white font-black tracking-widest text-[15px] uppercase whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">CHIẾN BINH<br/><span className="text-[12px] opacity-80">PHỤC THÙ</span></h1>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-0.5 custom-scrollbar">
          <div className="px-8 pb-3 text-[11px] uppercase font-bold text-slate-500 tracking-wider">MANAGEMENT</div>
          <NavItem id="dashboard" label="Dashboard" icon="❖" />
          <NavItem id="scrum" label="Scrum Board" icon="📋" />
          <NavItem id="reports" label="Reports & Docs" icon="📄" />
          <NavItem id="chat" label="Chat Room" icon="💬" />
          <NavItem id="discoveries" label="Discoveries" icon="💡" />
          <NavItem id="ideation" label="Idea Sandbox" icon="🧠" />

          <div className="px-8 mt-8 pb-3 text-[11px] uppercase font-bold text-slate-500 tracking-wider">SYLLABUS</div>
          {STAGES.map((stage, idx) => {
            const stats = getStageStats(stage);
            const isDone = stats.pctA === 100 && stats.pctB === 100;
            const isCurrent = currentView === `stage-${idx}`;
            return (
              <div key={stage.id} className="px-4 py-0.5">
                <button onClick={() => setCurrentView(`stage-${idx}`)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${isCurrent ? 'bg-[#10b981] text-white shadow-md shadow-emerald-900/20' : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'}`}>
                  <span className="truncate">Stage {stage.index}</span>
                  {isDone ? <span className="text-emerald-300 font-bold">✓</span> : <span className="text-[11px] opacity-60 font-semibold">{stats.pctA}%</span>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom User Profile */}
        <div className="p-5 bg-[#0b1120] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-[15px] shadow-md border border-emerald-500">
            {partner === 'Partner A' ? 'T' : 'K'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-white text-[14px] font-bold truncate leading-tight">{partnerName}</p>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{partner === 'Partner A' ? 'Senior Architect' : 'Lead Engineer'}</p>
          </div>
          <button onClick={() => setIsProfileLoaded(false)} className="text-slate-500 hover:text-white transition-colors" title="Đổi tài khoản">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT (White / Light Minimal Theme matching the "Owner Dashboard" image) */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        
        {/* HEADER SECTION (Text on flat background, no sticky bar) */}
        <header className="px-10 pt-12 pb-8 max-w-[1200px] mx-auto w-full">
           <h2 className="text-[32px] font-extrabold tracking-tight text-slate-900">
             {currentView === 'dashboard' ? 'Owner Dashboard' :
              currentView === 'scrum' ? 'Scrum Management' :
              currentView === 'reports' ? 'Documents & Reports' :
              currentView === 'chat' ? 'Workspace Communication' :
              currentView === 'discoveries' ? 'Learning Discoveries' :
              currentView === 'ideation' ? 'Architecture Ideation Sandbox' :
              activeStage ? `${activeStage.title}` : ''}
           </h2>
           <p className="text-[15px] text-slate-500 mt-1.5 font-medium">
             Welcome back, {partnerName} of Chiến Binh Phục Thù Workspace.
           </p>
        </header>

        {/* CONTENT ENVELOPE */}
        <div className="px-10 pb-20 max-w-[1200px] mx-auto w-full flex-1 fade-in" key={currentView}>
          
          {/* ========================================================
              VIEW 1: DASHBOARD (Owner Dashboard Style matching screenshot)
          ======================================================== */}
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              
              {/* TOP STATS CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-start shadow-sm hover:border-slate-300 transition-colors">
                  <div>
                    <div className="text-[13px] font-semibold text-emerald-600 mb-1.5">Total Stages</div>
                    <div className="text-[32px] font-bold text-[#0f172a] leading-none">{STAGES.filter(s => getStageStats(s).pctA === 100 && getStageStats(s).pctB === 100).length} <span className="text-xl text-slate-400 font-normal">/ 14</span></div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 text-xl">📚</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-start shadow-sm hover:border-slate-300 transition-colors">
                  <div>
                    <div className="text-[13px] font-semibold text-blue-600 mb-1.5">Active Tasks</div>
                    <div className="text-[32px] font-bold text-[#0f172a] leading-none">{tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length}</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-start shadow-sm hover:border-slate-300 transition-colors">
                  <div>
                    <div className="text-[13px] font-semibold text-amber-600 mb-1.5">Documents</div>
                    <div className="text-[32px] font-bold text-[#0f172a] leading-none">{reports.length}</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-start shadow-sm hover:border-slate-300 transition-colors">
                  <div>
                    <div className="text-[13px] font-semibold text-purple-600 mb-1.5">Discoveries</div>
                    <div className="text-[32px] font-bold text-[#0f172a] leading-none">{discoveries.length}</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN GRID FOR LISTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Tasks Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="px-6 py-5 font-bold text-[16px] text-slate-900 border-b border-slate-100 flex justify-between items-center">
                    <span>Recent Tasks</span>
                    <button onClick={() => setCurrentView("scrum")} className="text-[13px] font-semibold text-emerald-600 hover:underline">View All</button>
                  </div>
                  <div className="p-0 flex-1">
                    {tasks.slice(0, 5).map(t => (
                      <div key={t.id} className="flex justify-between items-center p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="text-[15px] font-bold text-slate-800">{t.title}</p>
                          <p className="text-[13px] text-slate-500 mt-1">Assignee: {t.assignee === 'Both' ? 'Thịnh & Khang' : t.assignee}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold ${
                          t.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                          t.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                        }`}>{t.status}</span>
                      </div>
                    ))}
                    {tasks.length === 0 && <div className="text-center text-slate-400 py-10 text-[14px]">Chưa có task nào được tạo.</div>}
                  </div>
                </div>

                {/* System Alerts and Workspace Rules */}
                <div className="flex flex-col gap-6 h-full">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1">
                    <div className="px-6 py-5 font-bold text-[16px] text-slate-900 border-b border-slate-100">
                      System Alerts & Global Rules
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3">
                        <span className="text-rose-600 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                        <div>
                          <h4 className="text-[14px] font-bold text-rose-800 mb-1">Ràng buộc chung (Constraint)</h4>
                          <p className="text-[13px] text-rose-700">Tại các stage có đánh dấu 💰, phải thay đổi thiết kế theo ràng buộc mới. Sau đó phải viết Constraint Tradeoff Report đánh giá thiệt hơn!</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                        <span className="text-amber-500 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>
                        <div>
                          <h4 className="text-[14px] font-bold text-amber-800 mb-1">Mô phỏng bảo trì (Maintenance)</h4>
                          <p className="text-[13px] text-amber-700">Tại các stage có dấu ⏳, không thêm tính năng mới trong 2-3 tháng. Chỉ scale dữ liệu (10x), xử lý random incident, onboard bạn bè và viết Maintenance Retrospective.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 2: SPECIFIC STAGE (SYLLABUS DETAIL)
          ======================================================== */}
          {activeStage && (
            <div className="space-y-6">
              {/* STAGE OVERVIEW CARDS WITH TIME TRACKER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-semibold text-emerald-600">Đo lường thời gian</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 text-lg">⏳</div>
                  </div>
                  {stageTimers[activeStage.id] ? (
                    <div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">
                        {Math.floor((Date.now() - stageTimers[activeStage.id].startTime) / (1000 * 60 * 60 * 24))} <span className="text-sm text-slate-500 font-normal">Ngày</span>
                      </div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium">Bắt đầu bởi {stageTimers[activeStage.id].startedBy}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[15px] font-semibold text-slate-700 mb-3">Dự kiến: {activeStage.time}</div>
                      <button onClick={() => handleStartTimer(activeStage.id)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg text-sm transition-colors">Bắt đầu tính giờ</button>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-semibold text-blue-600">Techstack</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-lg">⚙️</div>
                  </div>
                  <p className="text-[15px] font-bold text-slate-800 leading-snug">{activeStage.tech}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-semibold text-amber-600">Tiến Độ (Quality Gate)</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 text-lg">🎯</div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide"><span>Thịnh</span><span>{getStageStats(activeStage).pctA}%</span></div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{width: `${getStageStats(activeStage).pctA}%`}}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide"><span>Khang</span><span>{getStageStats(activeStage).pctB}%</span></div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{width: `${getStageStats(activeStage).pctB}%`}}></div></div>
                    </div>
                  </div>
                </div>
              </div>

              {activeStage.constraint && activeStage.constraint !== "Không có." && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex gap-3 shadow-sm items-start"><span className="text-xl">⚠️</span><div><h4 className="text-[15px] font-bold text-rose-800">Ràng Buộc Đột Xuất</h4><p className="text-[13px] text-rose-700 mt-1">{activeStage.constraint}</p></div></div>
              )}
              {activeStage.maintenance && (
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex gap-3 shadow-sm items-start"><span className="text-xl">ℹ️</span><div><h4 className="text-[15px] font-bold text-amber-800">Mô phỏng Bảo Trì</h4><p className="text-[13px] text-amber-700 mt-1">{activeStage.maintenance}</p></div></div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Bài Toán Thực Tế (Problem)</h3>
                    <p className="text-[14px] text-slate-600 leading-relaxed">{activeStage.problem}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 font-bold text-[15px] text-slate-800 flex justify-between items-center">
                      <span>BÀI TẬP BẮT BUỘC</span>
                      <span className="text-[11px] bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full border border-emerald-100">{activeStage.challenges.length} Thử thách</span>
                    </div>
                    <div className="p-3">
                      {activeStage.challenges.map((challenge, cIdx) => {
                        const status = studyProgress[`${activeStage.id}_challenge_${cIdx}`] || {};
                        return (
                          <div key={cIdx} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex flex-col gap-3">
                            <p className="text-[14px] text-slate-700 font-semibold">{challenge}</p>
                            <div className="flex gap-2">
                              <button onClick={() => toggleChallengeCheck(activeStage.id, cIdx, "Partner A")} className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all border ${status["Partner A"] ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300'}`}>Thịnh {status["Partner A"] ? '✓' : ''}</button>
                              <button onClick={() => toggleChallengeCheck(activeStage.id, cIdx, "Partner B")} className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all border ${status["Partner B"] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'}`}>Khang {status["Partner B"] ? '✓' : ''}</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Giải Pháp (Solution)</h3>
                    <p className="text-[14px] text-slate-600 leading-relaxed">{activeStage.solution}</p>
                  </div>

                  {/* INLINE DYNAMIC TECHNOLOGY STUDY RESOURCES */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 font-bold text-[15px] text-slate-800 flex justify-between items-center">
                      <span>Nguồn Học & Công Nghệ</span>
                      <button onClick={() => setShowAddTech(!showAddTech)} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-100 transition-colors">+</button>
                    </div>
                    
                    <div className="p-3">
                      {showAddTech && (
                        <form onSubmit={(e) => handleAddCustomTech(e, activeStage.id)} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3">
                          <div className="space-y-3 mb-4">
                            <input required type="text" value={newTechName} onChange={e=>setNewTechName(e.target.value)} placeholder="Tên tài liệu..." className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"/>
                            <input required type="url" value={newTechLink} onChange={e=>setNewTechLink(e.target.value)} placeholder="Link URL" className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"/>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={()=>setShowAddTech(false)} className="text-[13px] font-medium text-slate-500 px-3 hover:text-slate-800">Hủy</button>
                            <button type="submit" className="bg-emerald-500 text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">Lưu</button>
                          </div>
                        </form>
                      )}
                      {[...(activeStage.techResources || []), ...customTechResources.filter(r => r.stageId === activeStage.id)].map((techRes, trIdx) => (
                        <a key={trIdx} href={techRes.link} target="_blank" rel="noreferrer" className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group gap-2">
                          <div>
                            <span className="text-[14px] font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">{techRes.name}</span>
                            {techRes.addedBy && <div className="text-[11px] text-slate-400 mt-1">Added by {techRes.addedBy}</div>}
                          </div>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors whitespace-nowrap">Xem ↗</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 font-bold text-[15px] text-slate-800">Tài Liệu Syllabus Đầy Đủ</div>
                    <div className="p-3">
                      {activeStage.resources.map((res, rIdx) => {
                        const docId = `${activeStage.id}_resource_${rIdx}`;
                        const status = studyProgress[docId] || {};
                        return (
                          <div key={rIdx} className="p-4 border-b border-slate-100 last:border-0 flex items-center justify-between gap-4 hover:bg-slate-50 transition-all">
                            <div className="min-w-0 flex-1">
                              <a href={res.link} target="_blank" rel="noreferrer" className="text-[14px] font-semibold text-slate-700 hover:text-emerald-600 block truncate">{res.name}</a>
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1 inline-block">{res.category}</span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => toggleResourceCheck(activeStage.id, rIdx, "Partner A")} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold border transition-all ${status["Partner A"] ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300'}`}>T</button>
                              <button onClick={() => toggleResourceCheck(activeStage.id, rIdx, "Partner B")} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold border transition-all ${status["Partner B"] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'}`}>K</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 3: SCRUM BOARD 
          ======================================================== */}
          {currentView === 'scrum' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-semibold text-slate-600 mb-2">Tên tác vụ / Công việc cần xử lý</label>
                    <input required type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Ví dụ: Thiết kế Database Schema..." />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-600 mb-2">Phân công (Assignee)</label>
                    <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all">
                      <option value="Both">Cả hai người</option><option value="Thịnh">Thịnh</option><option value="Khang">Khang</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">Tạo Task</button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
                {["Backlog", "Pending", "In Progress", "Review", "Done"].map((columnStatus) => {
                  const columnTasks = tasks.filter(t => t.status === columnStatus);
                  return (
                    <div key={columnStatus} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col min-h-[600px]">
                      <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-[13px] font-bold text-slate-700 uppercase">{columnStatus}</span>
                        <span className="bg-slate-200 text-slate-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{columnTasks.length}</span>
                      </div>
                      
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] custom-scrollbar">
                        {columnTasks.map((task) => (
                          <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3 relative group hover:border-emerald-300 transition-all">
                            <button onClick={() => deleteTask(task.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                            <span className={`text-[10px] w-fit px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${task.assignee === 'Thịnh' ? 'bg-emerald-50 text-emerald-700' : task.assignee === 'Khang' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{task.assignee === 'Both' ? '👥 Cả hai' : task.assignee}</span>
                            <h4 className="text-[14px] font-bold text-slate-800 leading-snug">{task.title}</h4>
                            <div className="flex justify-between mt-1 pt-3 border-t border-slate-100 text-[11px] font-semibold">
                              {columnStatus !== "Backlog" ? <button onClick={() => updateTaskStatus(task.id, { "Pending": "Backlog", "In Progress": "Pending", "Review": "In Progress", "Done": "Review" }[columnStatus])} className="text-slate-400 hover:text-slate-600">← Lùi</button> : <span/>}
                              {columnStatus !== "Done" ? <button onClick={() => updateTaskStatus(task.id, { "Backlog": "Pending", "Pending": "In Progress", "In Progress": "Review", "Review": "Done" }[columnStatus])} className="text-emerald-600 hover:underline">Tiến →</button> : <span/>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 4: REPORTS
          ======================================================== */}
          {currentView === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-fit">
                <h3 className="font-bold text-slate-800 mb-6 text-lg">{editingReportId ? "Hiệu chỉnh tài liệu" : "Viết tài liệu quyết định kiến trúc"}</h3>
                <form onSubmit={handleSaveReport} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-600 mb-2">Phân loại tài liệu</label>
                      <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                        <option value="Constraint Report">Constraint Report</option>
                        <option value="Maintenance Retrospective">Maintenance Retrospective</option>
                        <option value="General Note">Ghi chú & Review chặng</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-600 mb-2">Tiêu đề tài liệu</label>
                      <input type="text" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-600 mb-2">Nội dung chi tiết (Markdown)</label>
                    <textarea rows={10} value={reportText} onChange={(e) => setReportText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500" required></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    {editingReportId && <button type="button" onClick={() => {setEditingReportId(null); setReportTitle(""); setReportText("");}} className="text-sm font-medium text-slate-500 px-4 hover:text-slate-800">Hủy</button>}
                    <button type="submit" className="bg-[#10b981] hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">Lưu Tài Liệu</button>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[700px] flex flex-col">
                  <div className="px-6 py-5 border-b border-slate-100 font-bold text-base text-slate-800">Kho lưu trữ Quyết định</div>
                  <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                    {reports.map(rep => (
                      <div key={rep.id} className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col gap-2 hover:border-slate-200 transition-colors">
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${rep.type.includes('Constraint') ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>{rep.type}</span>
                          <div className="text-[11px] text-slate-400 flex gap-3 font-semibold">
                            <button onClick={() => { setEditingReportId(rep.id); setReportTitle(rep.title); setReportText(rep.text); setReportType(rep.type); }} className="hover:text-emerald-600">Sửa</button>
                            <button onClick={() => deleteReport(rep.id)} className="hover:text-rose-500">Xóa</button>
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-[15px]">{rep.title}</h4>
                        <div className="text-[12px] text-slate-500 font-medium">Stage: {rep.stageName}</div>
                        <div className="text-[10px] text-slate-400 text-right mt-1 font-medium">Biên soạn bởi {rep.author}</div>
                      </div>
                    ))}
                    {reports.length === 0 && <div className="text-sm text-slate-400 text-center py-10 font-medium">Chưa có tài liệu nào được lưu.</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 5: CHAT ROOM
          ======================================================== */}
          {currentView === 'chat' && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[700px] overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <div><h3 className="font-bold text-slate-800 text-base">Phòng Thảo Luận Song Hành</h3><p className="text-[13px] text-slate-500 mt-0.5">Trao đổi thời gian thực giữa Thịnh & Khang</p></div>
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">LIVE 🟢</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col gap-1 max-w-[75%] ${msg.sender === partnerName ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400"><span className={msg.sender === "Thịnh" ? "text-emerald-600" : "text-blue-600"}>{msg.sender}</span><span>{new Date(msg.timestamp).toLocaleTimeString()}</span></div>
                    <div className={`p-3.5 rounded-2xl text-[14px] shadow-sm leading-relaxed ${msg.sender === partnerName ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>{msg.text}</div>
                  </div>
                ))}
                {chatMessages.length === 0 && <div className="text-center text-slate-400 mt-32 text-sm font-medium">Mọi thứ đã sẵn sàng. Hãy gửi tin nhắn đầu tiên...</div>}
              </div>
              <form onSubmit={handleSendChat} className="p-5 bg-white border-t border-slate-100 flex gap-3">
                <input required type="text" value={chatText} onChange={e => setChatText(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Nhập tin nhắn..." />
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all">Gửi</button>
              </form>
            </div>
          )}

          {/* ========================================================
              VIEW 6: DISCOVERIES & GLOBAL LIBRARY
          ======================================================== */}
          {currentView === 'discoveries' && (
            <div className="space-y-10">
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider mb-5">Ghi Nhận & Chia sẻ</h3>
                <form onSubmit={handleAddDiscovery} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2"><label className="block text-[13px] font-semibold text-slate-600 mb-2">Tiêu đề phát hiện / Tên bài viết</label><input required type="text" value={discoveryTitle} onChange={e => setDiscoveryTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="VD: Khắc phục lỗi Deadlock..." /></div>
                  <div><label className="block text-[13px] font-semibold text-slate-600 mb-2">Đường dẫn tham khảo (Link)</label><input type="url" value={discoveryLink} onChange={e => setDiscoveryLink(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="https://..." /></div>
                  <div><label className="block text-[13px] font-semibold text-slate-600 mb-2">Ghi chú ngắn</label><input type="text" value={discoveryNotes} onChange={e => setDiscoveryNotes(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Rất hữu ích cho chặng sau..." /></div>
                  <div className="md:col-span-2 flex justify-end pt-2"><button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">Ghim Phát Hiện</button></div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoveries.map(d => (
                  <div key={d.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <button onClick={() => deleteDiscovery(d.id)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                    <div>
                      <h4 className="font-bold text-slate-800 pr-6 text-[15px] mb-2">{d.title}</h4>
                      {d.notes && <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{d.notes}</p>}
                    </div>
                    <div>
                      {d.link && <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-[13px] hover:underline mt-4 inline-block font-semibold">Mở liên kết ↗</a>}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 font-medium"><span className={`w-2 h-2 rounded-full ${d.author === 'Thịnh' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>Bởi {d.author} • {new Date(d.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TÀI LIỆU SÁCH & BLOG KINH ĐIỂN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                  <div className="px-6 py-5 font-bold text-[16px] text-slate-800 border-b border-slate-100 flex items-center gap-2">
                    📚 Sách Tổng Hợp Về Kiến Trúc
                  </div>
                  <div className="p-0">
                    {GLOBAL_BOOKS.map((book, idx) => (
                      <div key={idx} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <p className="text-[14px] font-bold text-slate-800">{book.title}</p>
                        <p className="text-[12px] text-slate-500 mt-0.5">Tác giả: <span className="font-semibold">{book.author}</span></p>
                        <p className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded inline-block mt-2">{book.topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                  <div className="px-6 py-5 font-bold text-[16px] text-slate-800 border-b border-slate-100 flex items-center gap-2">
                    🌐 Blog Công Nghệ Khuyên Đọc
                  </div>
                  <div className="p-0">
                    {GLOBAL_BLOGS.map((blog, idx) => (
                      <a key={idx} href={blog.url} target="_blank" rel="noopener noreferrer" className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors block group">
                        <p className="text-[14px] font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{blog.name} ↗</p>
                        <p className="text-[13px] text-slate-500 mt-1">{blog.topic}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 7: ARCHITECTURE IDEATION SANDBOX 
          ======================================================== */}
          {currentView === 'ideation' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2"><span className="text-2xl">🧠</span><h3 className="font-bold text-slate-800 text-base uppercase tracking-wider">Ý Tưởng Đột Phá</h3></div>
                <p className="text-[13px] text-slate-500 mb-6">Đề xuất kiến trúc mới hoặc thay đổi công nghệ để thảo luận.</p>
                
                <form onSubmit={handleAddIdea} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                  <div className="md:col-span-4"><label className="block text-[13px] font-semibold text-slate-600 mb-2">Tên Ý Tưởng / Giải Pháp</label><input required type="text" value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="VD: Dùng Redis Streams..."/></div>
                  <div className="md:col-span-4"><label className="block text-[13px] font-semibold text-slate-600 mb-2">Mô tả tóm tắt</label><input required type="text" value={ideaDesc} onChange={e => setIdeaDesc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="VD: Giảm tải vận hành infra..."/></div>
                  <div className="md:col-span-2"><label className="block text-[13px] font-semibold text-slate-600 mb-2">Stage</label><select value={ideaStage} onChange={e => setIdeaStage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"><option value="General">Chung</option>{STAGES.map(s => (<option key={s.id} value={s.title.split('–')[0]}>Chặng {s.index}</option>))}</select></div>
                  <div className="md:col-span-2"><button type="submit" className="w-full bg-[#10b981] hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">Đề Xuất</button></div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideationList.map(idea => (
                  <div key={idea.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-all flex flex-col justify-between min-h-[200px]">
                    <button onClick={() => deleteIdea(idea.id)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">{idea.stage}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${idea.status === 'Implemented' ? 'bg-emerald-100 text-emerald-700' : idea.status === 'Approved' ? 'bg-blue-100 text-blue-700' : idea.status === 'Under Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{idea.status}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-[15px] mb-2">{idea.title}</h4>
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{idea.desc}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium"><span className={`w-2 h-2 rounded-full ${idea.author === 'Thịnh' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>{idea.author}</div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => updateIdeaStatus(idea.id, "Under Review")} className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded font-semibold">Duyệt</button>
                        <button onClick={() => updateIdeaStatus(idea.id, "Approved")} className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">Ok</button>
                        <button onClick={() => updateIdeaStatus(idea.id, "Implemented")} className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-semibold">Done</button>
                      </div>
                    </div>
                  </div>
                ))}
                {ideationList.length === 0 && <div className="col-span-full text-center py-16 text-slate-400 text-sm font-medium">Chưa có ý kiến nào trên Sandbox.</div>}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className="fixed bottom-8 right-8 bg-slate-800 border border-slate-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-enter">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-[13px] font-medium">{notification}</span>
        </div>
      )}
    </div>
  );