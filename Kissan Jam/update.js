const fs = require('fs');

let pathSeed = 'c:/Users/ME/Desktop/Cardano/backend/app/seed_data.py';
let content = fs.readFileSync(pathSeed, 'utf8');

const reps = {
  '"price_ada": 0.5': '"price_ada": 2.5',
  '"price_ada": 0.3': '"price_ada": 3.0',
  '"price_ada": 0.8': '"price_ada": 2.8',
  '"price_ada": 1.0': '"price_ada": 3.5',
  '"price_ada": 0.2': '"price_ada": 2.2',
  '"price_ada": 0.15': '"price_ada": 2.0',
  '"price_ada": 0.4': '"price_ada": 4.5',
  '"price_ada": 2.0': '"price_ada": 5.0',
  '"price_ada": 0.6': '"price_ada": 2.6',
  '"price_ada": 1.5': '"price_ada": 4.0',
  '"price_ada": 3.0': '"price_ada": 6.0',
  '"price_ada": 0.05': '"price_ada": 1.5'
};

for (const [k, v] of Object.entries(reps)) {
  content = content.replace(new RegExp(k.replace(/\./g, '\\.'), 'g'), v);
}

const newItems = `            {
                "provider": "CodeForge AI",
                "category": "coding",
                "name": "Neural Quantum Simulator",
                "description": "Simulate complex quantum circuits using distributed AI nodes. Enterprise access.",
                "short_description": "Enterprise quantum simulation",
                "price_ada": 1000.0,
                "endpoint_url": "https://api.codeforge.ai/v2/quantum",
                "avg_latency_ms": 250000,
                "success_rate": 99.9,
                "total_jobs": 50,
                "rating": 5.0,
                "review_count": 5,
                "model_name": "QuantumSim-Pro",
                "version": "1.0.0",
                "tags": "quantum,simulation,enterprise",
                "example_input": '{"circuit_url": "s3://q-circuits/test.qasm"}',
                "example_output": '{"state_vector": [...], "probabilities": [...]}',
            },
            {
                "provider": "VisionAI Labs",
                "category": "vision",
                "name": "Global Weather Predictor AI",
                "description": "Generate ultra-high resolution climate models and weather predictions over a 10-year period.",
                "short_description": "Global high-res weather modeling",
                "price_ada": 2500.0,
                "endpoint_url": "https://api.visionai.labs/v3/climate",
                "avg_latency_ms": 600000,
                "success_rate": 99.9,
                "total_jobs": 10,
                "rating": 4.9,
                "review_count": 3,
                "model_name": "ClimateVision-X",
                "version": "1.0.0",
                "tags": "climate,weather,vision,modeling",
                "example_input": '{"region": "global", "timeline_years": 10}',
                "example_output": '{"forecast_data_url": "s3://climate/result.nc"}',
            },
        ]`;

content = content.replace('        ]', newItems);
fs.writeFileSync(pathSeed, content);

let pathMock = 'c:/Users/ME/Desktop/Cardano/frontend/src/lib/mock-data.ts';
let mockContent = fs.readFileSync(pathMock, 'utf8');

const mockReps = {
  'price_ada: 0.5': 'price_ada: 2.5',
  'price_ada: 0.3': 'price_ada: 3.0',
  'price_ada: 0.8': 'price_ada: 2.8',
  'price_ada: 1.0': 'price_ada: 3.5',
  'price_ada: 0.2': 'price_ada: 2.2',
  'price_ada: 0.15': 'price_ada: 2.0',
  'price_ada: 0.4': 'price_ada: 4.5',
  'price_ada: 2.0': 'price_ada: 5.0',
  'price_ada: 0.6': 'price_ada: 2.6',
  'price_ada: 1.5': 'price_ada: 4.0',
  'price_ada: 3.0': 'price_ada: 6.0',
  'price_ada: 0.05': 'price_ada: 1.5',
  'price_ada: 50.0': 'price_ada: 150.0',
  'price_ada: 150.0': 'price_ada: 500.0'
};

for (const [k, v] of Object.entries(mockReps)) {
  mockContent = mockContent.replace(new RegExp(k.replace(/\./g, '\\.'), 'g'), v);
}

const newMock = `  {
    id: "s15", provider_id: "p6", category_id: "7", name: "Neural Quantum Simulator",
    description: "Simulate complex quantum circuits using distributed AI nodes. Enterprise access.",
    short_description: "Enterprise quantum simulation",
    price_ada: 1000.0, endpoint_url: "https://api.codeforge.ai/v2/quantum",
    docs_url: null, avg_latency_ms: 250000, success_rate: 99.9,
    total_jobs: 50, uptime: 100.0, rating: 5.0, review_count: 5,
    version: "1.0.0", model_name: "QuantumSim-Pro",
    example_input: '{"circuit_url": "s3://q-circuits/test.qasm"}',
    example_output: '{"state_vector": [...]}',
    tags: "quantum,simulation,enterprise", status: "active",
    created_at: "2026-06-01T10:00:00Z", updated_at: "2026-07-12T10:00:00Z",
    provider_name: "CodeForge AI", provider_wallet: "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp",
    category_name: "Coding", category_icon: "💻",
  },
  {
    id: "s16", provider_id: "p1", category_id: "3", name: "Global Weather Predictor AI",
    description: "Generate ultra-high resolution climate models and weather predictions over a 10-year period.",
    short_description: "Global high-res weather modeling",
    price_ada: 2500.0, endpoint_url: "https://api.visionai.labs/v3/climate",
    docs_url: null, avg_latency_ms: 600000, success_rate: 99.9,
    total_jobs: 10, uptime: 100.0, rating: 4.9, review_count: 3,
    version: "1.0.0", model_name: "ClimateVision-X",
    example_input: '{"region": "global", "timeline_years": 10}',
    example_output: '{"forecast_data_url": "s3://climate/result.nc"}',
    tags: "climate,weather,vision,modeling", status: "active",
    created_at: "2026-06-15T10:00:00Z", updated_at: "2026-07-12T10:00:00Z",
    provider_name: "VisionAI Labs", provider_wallet: "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp",
    category_name: "Vision", category_icon: "👁️",
  }
];`;

mockContent = mockContent.replace('];', newMock);
fs.writeFileSync(pathMock, mockContent);

console.log('Updated prices and added expensive items.');
