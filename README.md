backend/
│
├── src/
│ │
│ ├── config/
│ │ ├── db.ts
│ │ ├── redis.ts
│ │ ├── env.ts
│ │ └── bullmq.ts
│ │
│ ├── controllers/
│ │ ├── auth.controller.ts
│ │ ├── user.controller.ts
│ │ ├── product.controller.ts
│ │ ├── cart.controller.ts
│ │ ├── order.controller.ts
│ │ └── payment.controller.ts
│ │
│ ├── services/
│ │ ├── auth.service.ts
│ │ ├── user.service.ts
│ │ ├── product.service.ts
│ │ ├── cart.service.ts
│ │ ├── order.service.ts
│ │ └── payment.service.ts
│ │
│ ├── repositories/
│ │ ├── user.repository.ts
│ │ ├── product.repository.ts
│ │ ├── cart.repository.ts
│ │ └── order.repository.ts
│ │
│ ├── routes/
│ │ ├── auth.routes.ts
│ │ ├── user.routes.ts
│ │ ├── product.routes.ts
│ │ ├── cart.routes.ts
│ │ ├── order.routes.ts
│ │ └── payment.routes.ts
│ │
│ ├── models/
│ │ ├── User.ts
│ │ ├── Product.ts
│ │ ├── Cart.ts
│ │ ├── Order.ts
│ │ ├── Category.ts
│ │ └── Review.ts
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ ├── admin.middleware.ts
│ │ ├── rateLimit.middleware.ts
│ │ └── validate.middleware.ts
│ │
│ ├── validators/
│ │ ├── auth.validator.ts
│ │ ├── product.validator.ts
│ │ └── order.validator.ts
│ │
│ ├── cache/
│ │ ├── product.cache.ts
│ │ └── user.cache.ts
│ │
│ ├── jobs/
│ │ ├── email.job.ts
│ │ ├── order.job.ts
│ │ └── inventory.job.ts
│ │
│ ├── workers/
│ │ ├── email.worker.ts
│ │ ├── order.worker.ts
│ │ └── inventory.worker.ts
│ │
│ ├── utils/
│ │ ├── jwt.ts
│ │ ├── hash.ts
│ │ ├── logger.ts
│ │ ├── response.ts
│ │ └── asyncHandler.ts
│ │
│ ├── types/
│ │ ├── express.d.ts
│ │ └── common.types.ts
│ │
│ ├── app.ts
│ └── index.ts
│
├── tests/
│ ├── auth.test.ts
│ ├── product.test.ts
│ └── order.test.ts
│
├── logs/
│ ├── combined.log
│ └── error.log
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
