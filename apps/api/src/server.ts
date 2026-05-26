import 'dotenv/config'
import Fastify from 'fastify'
import cors    from '@fastify/cors'
import placesRoutes    from './routes/places.js'
import allergensRoutes from './routes/allergens.js'
import reportsRoutes      from './routes/reports.js'
import reviewsRoutes      from './routes/reviews.js'
import contributorsRoutes from './routes/contributors.js'
import trustSignalsRoutes from './routes/trust-signals.js'
import disputesRoutes     from './routes/disputes.js'

const server = Fastify({ logger: true })

await server.register(cors, {
  origin: process.env.CORS_ORIGIN ?? '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// Initialise request.userId so the type decoration is always present
server.decorateRequest('userId', '')

// Health check
server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

// Routes
await server.register(placesRoutes,    { prefix: '/places' })
await server.register(allergensRoutes, { prefix: '/allergens' })
await server.register(reportsRoutes,      { prefix: '/reports' })
await server.register(reviewsRoutes,      { prefix: '/reviews' })
await server.register(contributorsRoutes, { prefix: '/contributors' })
await server.register(trustSignalsRoutes, { prefix: '/trust-signals' })
await server.register(disputesRoutes,     { prefix: '/disputes' })

const port = Number(process.env.PORT ?? 3001)

try {
  await server.listen({ port, host: '0.0.0.0' })
  console.log(`API running on http://localhost:${port}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
