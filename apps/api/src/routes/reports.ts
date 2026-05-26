import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../plugins/auth.js'

const prisma = new PrismaClient()

const reportsRoutes: FastifyPluginAsync = async (server) => {
  // GET /reports?placeId=  — list non-deleted reports for a place, newest first
  server.get('/', async (request, reply) => {
    const { placeId, limit = '20', offset = '0' } = request.query as Record<string, string>

    if (!placeId) {
      return reply.status(400).send({ error: 'placeId query parameter is required' })
    }

    const take = Math.min(Math.max(Number(limit) || 20, 1), 100)
    const skip = Math.max(Number(offset) || 0, 0)

    const [reports, total] = await Promise.all([
      prisma.structuredReport.findMany({
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
      prisma.structuredReport.count({ where: { placeId, deletedAt: null } }),
    ])

    const reportIds = reports.map((r) => r.id)
    const signalCounts = await prisma.trustSignal.groupBy({
      by: ['targetId'],
      where: { targetId: { in: reportIds }, signalType: { in: ['helpful', 'confirm'] } },
      _count: { id: true },
    })
    const countMap = Object.fromEntries(signalCounts.map((s) => [s.targetId, s._count.id]))
    const reportsWithCounts = reports.map((r) => ({ ...r, helpfulCount: countMap[r.id] ?? 0 }))

    return { reports: reportsWithCounts, total, limit: take, offset: skip }
  })

  // POST /reports  — submit a structured report (authenticated)
  server.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = request.body as Record<string, unknown>

    if (!body.placeId || !body.reactionStatus || !body.verificationMethod ||
        !body.visitDate || !body.partyType || !body.severityLevel) {
      return reply.status(400).send({
        error: 'placeId, reactionStatus, verificationMethod, visitDate, partyType, and severityLevel are required',
      })
    }

    const allergensConfirmed = Array.isArray(body.allergensConfirmed)
      ? (body.allergensConfirmed as unknown[]).map(String)
      : []

    const report = await prisma.structuredReport.create({
      data: {
        placeId: String(body.placeId),
        contributorId: request.userId,
        allergensConfirmed,
        reactionStatus: String(body.reactionStatus),
        verificationMethod: String(body.verificationMethod),
        visitDate: new Date(String(body.visitDate)),
        partyType: String(body.partyType),
        severityLevel: String(body.severityLevel),
        languageUsed: body.languageUsed ? String(body.languageUsed) : null,
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

    return reply.status(201).send(report)
  })

  // DELETE /reports/:id  — soft delete (owner only)
  server.delete('/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const report = await prisma.structuredReport.findUnique({ where: { id } })

    if (!report || report.deletedAt !== null) {
      return reply.status(404).send({ error: 'Report not found' })
    }

    if (report.contributorId !== request.userId) {
      return reply.status(403).send({ error: 'You can only delete your own reports' })
    }

    await prisma.structuredReport.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return reply.status(204).send()
  })
}

export default reportsRoutes
