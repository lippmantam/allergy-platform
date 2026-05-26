import { FastifyRequest, FastifyReply } from 'fastify'
import { createRemoteJWKSet, jwtVerify } from 'jose'

declare module 'fastify' {
  interface FastifyRequest { userId: string }
}

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
)

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  const token = authHeader.slice(7)
  try {
    const { payload } = await jwtVerify(token, JWKS)
    if (!payload.sub) {
      return reply.status(401).send({ error: 'Invalid token: missing sub claim' })
    }
    request.userId = payload.sub
  } catch (err) {
    request.log.error({ err }, 'jwtVerify failed')
    return reply.status(401).send({ error: 'Unauthorized' })
  }
}
