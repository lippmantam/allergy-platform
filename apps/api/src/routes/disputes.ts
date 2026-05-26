import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../plugins/auth.js'

const prisma = new PrismaClient()

const VALID_TYPES = ['structured_report', 'narrative_review']

const disputesRoutes: FastifyPluginAsync = async (server) => {
  // POST /disputes — raise a dispute on a report or review
  server.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = request.body as Record<string, unknown>
    const { targetId, targetType, reason } = body

    if (!targetId || !targetType || !reason) {
      return reply.status(400).send({ error: 'targetId, targetType, and reason are required' })
    }
    if (!VALID_TYPES.includes(String(targetType))) {
      return reply.status(400).send({ error: `targetType must be one of: ${VALID_TYPES.join(', ')}` })
    }
    if (String(reason).trim().length < 10) {
      return reply.status(400).send({ error: 'reason must be at least 10 characters' })
    }

    const target = targetType === 'structured_report'
      ? await prisma.structuredReport.findFirst({ where: { id: String(targetId), deletedAt: null } })
      : await prisma.narrativeReview.findFirst({ where: { id: String(targetId), deletedAt: null } })

    if (!target) return reply.status(404).send({ error: 'Target not found' })

    const dispute = await prisma.dispute.create({
      data: {
        targetId: String(targetId),
        targetType: String(targetType),
        raisedBy: request.userId,
        reason: String(reason).trim(),
      },
    })

    return reply.status(201).send(dispute)
  })
}

export default disputesRoutes
