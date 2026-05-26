import { PrismaClient } from '@prisma/client'

export async function recalculateTrustScore(prisma: PrismaClient, contributorId: string) {
  const c = await prisma.contributor.findUnique({ where: { id: contributorId } })
  if (!c) return
  const ageYears = (Date.now() - c.memberSince.getTime()) / (365.25 * 24 * 3600 * 1000)
  const score = Math.min(1.0,
    Math.min(c.contributionCount / 20, 1) * 0.4 +
    Math.min(c.helpfulVotes / 50, 1) * 0.4 +
    Math.min(ageYears, 1) * 0.2,
  )
  await prisma.contributor.update({ where: { id: contributorId }, data: { trustScore: score } })
}
