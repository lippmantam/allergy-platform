import Fastify from 'fastify'
import cors    from '@fastify/cors'
import jwt     from '@fastify/jwt'

const server = Fastify({ logger: true })

// Plugins
await server.register(cors, { origin: process.env.CORS_ORIGIN ?? '*' })
await server.register(jwt,  { secret: process.env.SUPABASE_JWT_SECRET ?? 'dev-secret' })

// Health check
server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

// TODO: Register route plugins
// await server.register(placesRoutes,      { prefix: '/places' })
// await server.register(allergensRoutes,   { prefix: '/allergens' })
// await server.register(reportsRoutes,     { prefix: '/reports' })
// await server.register(reviewsRoutes,     { prefix: '/reviews' })
// await server.register(contributorsRoutes,{ prefix: '/contributors' })

const port = Number(process.env.PORT ?? 3001)

try {
  await server.listen({ port, host: '0.0.0.0' })
  console.log(`API running on http://localhost:${port}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
