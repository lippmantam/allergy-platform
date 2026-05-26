import { FastifyPluginAsync } from 'fastify'
import { ALLERGENS } from '@allergy-platform/shared'

const allergensRoutes: FastifyPluginAsync = async (server) => {
  // GET /allergens — full vocabulary
  server.get('/', async () => {
    return { allergens: ALLERGENS }
  })

  // GET /allergens/:code
  server.get('/:code', async (request, reply) => {
    const { code } = request.params as { code: string }
    const allergen = ALLERGENS.find((a) => a.code === code)
    if (!allergen) {
      return reply.status(404).send({ error: 'Allergen not found' })
    }
    return allergen
  })
}

export default allergensRoutes
