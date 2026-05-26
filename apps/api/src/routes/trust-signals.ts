import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../plugins/auth.js'
import { recalculateTrustScore } from '../lib/trust-score.js'

const prisma = new PrismaClient()

const VALID_TYPES = ['structured_report', 'narrative_review']
const VALID_SIGNALS = ['helpful', 'confirm', 'outdated']

const trustSignalsRoutes: FastifyPluginAsync = async (server) => {
  // POST /trust-signals — cast a helpful / confirm / outdated signal
  server.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = request.body as Record<string, unknown>
    const { targetId, targetType, signalType } = body

    if (!targetId || !targetType || !signalType) {
      return reply.status(400).send({ error: 'targetId, targetType, and signalType are required' })
    }
    if (!VALID_TYPES.includes(String(targetType))) {
      return reply.status(400).send({ error: `targetType must be one of: ${VALID_TYPES.join(', ')}` })
    }
    if (!VALID_SIGNALS.includes(String(signalType))) {
      return reply.status(400).send({ error: `signalType must be one of: ${VALID_SIGNALS.join(', ')}` })
    }

    // Verify the target exists
    const target = targetType === 'structured_report'
      ? await prisma.structuredReport.findFirst({ where: { id: String(targetId), deletedAt: null } })
      : await prisma.narrativeReview.findFirst({ where: { id: String(targetId), deletedAt: null } })

    if (!target) return reply.status(404).send({ error: 'Target not found' })

    // Prevent self-voting
    if ((target as { contributorId: string }).contributorId === request.userId) {
      return reply.status(400).send({ error: 'You cannot vote on your own content' })
    }

    try {
      const signal = await prisma.trustSignal.create({
        data: {
          targetId: String(targetId),
          targetType: String(targetType),
          contributorId: request.userId,
          signalType: String(signalType),
        },
      })

      // Increment helpful_votes on target's author for helpful/confirm signals
      if (signalType === 'helpful' || signalType === 'confirm') {
        const authorId = (target as { contributorId: string }).contributorId
        await prisma.contributor.update({
          where: { id: authorId },
          data: { helpfulVotes: { increment: 1 } },
        })
        await recalculateTrustScore(prisma, authorId)
      }

      return reply.status(201).send(signal)
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'P2002') {
        return reply.status(409).send({ error: 'You have already voted on this item' })
      }
      throw err
    }
  })

  // GET /trust-signals?targetId= — count signals for display
  server.get('/', async (request) => {
    const { targetId } = request.query as Record<string, string>
    if (!targetId) return { helpful: 0, confirm: 0, outdated: 0 }

    const counts = await prisma.trustSignal.groupBy({
      by: ['signalType'],
      where: { targetId },
      _count: { id: true },
    })

    const result: Record<string, number> = { helpful: 0, confirm: 0, outdated: 0 }
    for (const c of counts) result[c.signalType] = c._count.id
    return result
  })
}

export default trustSignalsRoutes
