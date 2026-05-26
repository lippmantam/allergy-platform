import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../plugins/auth.js'

const prisma = new PrismaClient()

const reviewsRoutes: FastifyPluginAsync = async (server) => {
  // GET /reviews?placeId=  — list non-deleted reviews for a place, newest first
  server.get('/', async (request, reply) => {
    const { placeId, limit = '20', offset = '0' } = request.query as Record<string, string>

    if (!placeId) {
      return reply.status(400).send({ error: 'placeId query parameter is required' })
    }

    const take = Math.min(Math.max(Number(limit) || 20, 1), 100)
    const skip = Math.max(Number(offset) || 0, 0)

    const [reviews, total] = await Promise.all([
      prisma.narrativeReview.findMany({
        where: { placeId, deletedAt: null },
        include: {
          contributor: {
            select: { id: true, displayName: true, trustScore: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.narrativeReview.count({ where: { placeId, deletedAt: null } }),
    ])

    const reviewIds = reviews.map((v) => v.id)
    const signalCounts = await prisma.trustSignal.groupBy({
      by: ['targetId'],
      where: { targetId: { in: reviewIds }, signalType: { in: ['helpful', 'confirm'] } },
      _count: { id: true },
    })
    const countMap = Object.fromEntries(signalCounts.map((s) => [s.targetId, s._count.id]))
    const reviewsWithCounts = reviews.map((v) => ({ ...v, helpfulCount: countMap[v.id] ?? 0 }))

    return { reviews: reviewsWithCounts, total, limit: take, offset: skip }
  })

  // POST /reviews  — submit a narrative review (authenticated)
  server.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = request.body as Record<string, unknown>

    if (!body.placeId || !body.experienceText || body.safetyRating == null || !body.wouldReturn) {
      return reply.status(400).send({
        error: 'placeId, experienceText, safetyRating, and wouldReturn are required',
      })
    }

    const safetyRating = Number(body.safetyRating)
    if (!Number.isInteger(safetyRating) || safetyRating < 1 || safetyRating > 5) {
      return reply.status(400).send({ error: 'safetyRating must be an integer between 1 and 5' })
    }

    const experienceText = String(body.experienceText)
    if (experienceText.length < 20) {
      return reply.status(400).send({ error: 'experienceText must be at least 20 characters' })
    }

    const review = await prisma.narrativeReview.create({
      data: {
        placeId: String(body.placeId),
        contributorId: request.userId,
        experienceText,
        safetyRating,
        tips: body.tips ? String(body.tips) : null,
        photoUrls: Array.isArray(body.photoUrls)
          ? (body.photoUrls as unknown[]).map(String)
          : [],
        cuisineContext: body.cuisineContext ? String(body.cuisineContext) : null,
        wouldReturn: String(body.wouldReturn),
      },
      include: {
        contributor: {
          select: { id: true, displayName: true, trustScore: true },
        },
      },
    })

    // Increment contributor's contribution count
    await prisma.contributor.update({
      where: { id: request.userId },
      data: { contributionCount: { increment: 1 } },
    })

    return reply.status(201).send(review)
  })

  // DELETE /reviews/:id  — soft delete (owner only)
  server.delete('/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const review = await prisma.narrativeReview.findUnique({ where: { id } })

    if (!review || review.deletedAt !== null) {
      return reply.status(404).send({ error: 'Review not found' })
    }

    if (review.contributorId !== request.userId) {
      return reply.status(403).send({ error: 'You can only delete your own reviews' })
    }

    await prisma.narrativeReview.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return reply.status(204).send()
  })
}

export default reviewsRoutes
