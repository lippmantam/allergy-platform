import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_CONTRIBUTOR_ID = '00000000-0000-0000-0000-000000000001'

const placesRoutes: FastifyPluginAsync = async (server) => {
  // GET /places?q=&allergens=PNUT,SES&limit=20&offset=0
  server.get('/', async (request) => {
    const { q, allergens, limit = '20', offset = '0' } = request.query as Record<string, string>

    const allergenCodes = allergens
      ? allergens.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const where: Record<string, unknown> = {}

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { cuisineType: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (allergenCodes.length > 0) {
      where.AND = allergenCodes.map((code) => ({
        allergens: { some: { allergenCode: code } },
      }))
    }

    const take = Math.min(Math.max(Number(limit) || 20, 1), 100)
    const skip = Math.max(Number(offset) || 0, 0)

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: { allergens: true },
        take,
        skip,
        orderBy: { completenessScore: 'desc' },
      }),
      prisma.place.count({ where }),
    ])

    return { places, total, limit: take, offset: skip }
  })

  // GET /places/:id
  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        allergens: true,
        reports: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        reviews: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!place) {
      return reply.status(404).send({ error: 'Place not found' })
    }

    return place
  })

  // POST /places
  server.post('/', async (request, reply) => {
    const body = request.body as Record<string, unknown>

    if (!body.name || !body.address || body.latitude == null || body.longitude == null || !body.cuisineType) {
      return reply.status(400).send({ error: 'name, address, latitude, longitude, and cuisineType are required' })
    }

    const place = await prisma.place.create({
      data: {
        name: String(body.name),
        address: String(body.address),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        cuisineType: String(body.cuisineType),
        phone: body.phone ? String(body.phone) : null,
        website: body.website ? String(body.website) : null,
        hours: body.hours ? String(body.hours) : null,
        allergenAware: body.allergenAware ? String(body.allergenAware) : 'unknown',
        addedByContributorId: SEED_CONTRIBUTOR_ID,
      },
      include: { allergens: true },
    })

    return reply.status(201).send(place)
  })

  // PATCH /places/:id
  server.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = request.body as Record<string, unknown>

    try {
      const place = await prisma.place.update({
        where: { id },
        data: {
          ...(body.name != null && { name: String(body.name) }),
          ...(body.address != null && { address: String(body.address) }),
          ...(body.latitude != null && { latitude: Number(body.latitude) }),
          ...(body.longitude != null && { longitude: Number(body.longitude) }),
          ...(body.cuisineType != null && { cuisineType: String(body.cuisineType) }),
          ...(body.phone !== undefined && { phone: body.phone ? String(body.phone) : null }),
          ...(body.website !== undefined && { website: body.website ? String(body.website) : null }),
          ...(body.hours !== undefined && { hours: body.hours ? String(body.hours) : null }),
          ...(body.allergenAware != null && { allergenAware: String(body.allergenAware) }),
        },
        include: { allergens: true },
      })
      return place
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Place not found' })
      }
      throw err
    }
  })

  // DELETE /places/:id
  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      await prisma.place.delete({ where: { id } })
      return reply.status(204).send()
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Place not found' })
      }
      throw err
    }
  })

  // POST /places/:id/allergens  — upsert an allergen record
  server.post('/:id/allergens', async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = request.body as Record<string, unknown>

    if (!body.allergenCode) {
      return reply.status(400).send({ error: 'allergenCode is required' })
    }

    const allergenCode = String(body.allergenCode)

    const record = await prisma.placeAllergen.upsert({
      where: { placeId_allergenCode: { placeId: id, allergenCode } },
      create: {
        placeId: id,
        allergenCode,
        accommodationLevel: body.accommodationLevel ? String(body.accommodationLevel) : 'aware',
        dedicatedKitchen: Boolean(body.dedicatedKitchen),
        sharedFryerRisk: Boolean(body.sharedFryerRisk),
        staffTrainingLevel: body.staffTrainingLevel ? String(body.staffTrainingLevel) : 'none',
        confidenceLevel: body.confidenceLevel ? String(body.confidenceLevel) : null,
        notes: body.notes ? String(body.notes) : null,
      },
      update: {
        accommodationLevel: body.accommodationLevel ? String(body.accommodationLevel) : 'aware',
        dedicatedKitchen: Boolean(body.dedicatedKitchen),
        sharedFryerRisk: Boolean(body.sharedFryerRisk),
        staffTrainingLevel: body.staffTrainingLevel ? String(body.staffTrainingLevel) : 'none',
        confidenceLevel: body.confidenceLevel ? String(body.confidenceLevel) : null,
        notes: body.notes ? String(body.notes) : null,
      },
    })

    return reply.status(201).send(record)
  })

  // DELETE /places/:id/allergens/:code
  server.delete('/:id/allergens/:code', async (request, reply) => {
    const { id, code } = request.params as { id: string; code: string }

    try {
      await prisma.placeAllergen.delete({
        where: { placeId_allergenCode: { placeId: id, allergenCode: code } },
      })
      return reply.status(204).send()
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'P2025') {
        return reply.status(404).send({ error: 'Allergen record not found' })
      }
      throw err
    }
  })
}

export default placesRoutes
