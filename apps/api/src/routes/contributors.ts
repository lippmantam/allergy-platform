import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../plugins/auth.js'

const prisma = new PrismaClient()

const contributorsRoutes: FastifyPluginAsync = async (server) => {
  // GET /contributors/:id — public profile + contribution history
  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const contributor = await prisma.contributor.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        allergenProfile: true,
        contributionCount: true,
        helpfulVotes: true,
        trustScore: true,
        verifiedParent: true,
        memberSince: true,
        reports: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            placeId: true,
            allergensConfirmed: true,
            reactionStatus: true,
            visitDate: true,
            createdAt: true,
            place: { select: { id: true, name: true } },
          },
        },
        reviews: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            placeId: true,
            safetyRating: true,
            experienceText: true,
            wouldReturn: true,
            createdAt: true,
            place: { select: { id: true, name: true } },
          },
        },
      },
    })

    if (!contributor) return reply.status(404).send({ error: 'Contributor not found' })
    return contributor
  })

  // PATCH /contributors/:id — update display name and allergen profile (owner only)
  server.patch('/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }

    if (request.userId !== id) {
      return reply.status(403).send({ error: 'You can only update your own profile' })
    }

    const body = request.body as Record<string, unknown>
    const data: { displayName?: string; allergenProfile?: string[] } = {}

    if (typeof body.displayName === 'string' && body.displayName.trim()) {
      data.displayName = body.displayName.trim()
    }
    if (Array.isArray(body.allergenProfile)) {
      data.allergenProfile = (body.allergenProfile as unknown[]).map(String)
    }

    if (Object.keys(data).length === 0) {
      return reply.status(400).send({ error: 'No valid fields to update' })
    }

    const contributor = await prisma.contributor.update({
      where: { id },
      data,
      select: {
        id: true,
        displayName: true,
        allergenProfile: true,
        contributionCount: true,
        helpfulVotes: true,
        trustScore: true,
        verifiedParent: true,
        memberSince: true,
      },
    })

    return contributor
  })
}

export default contributorsRoutes
