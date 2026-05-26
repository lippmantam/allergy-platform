const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// Pass this from useAuth().session?.access_token on client components that write data
export type AuthToken = string | null | undefined

export type PlaceAllergen = {
  id: string
  placeId: string
  allergenCode: string
  accommodationLevel: string
  dedicatedKitchen: boolean
  sharedFryerRisk: boolean
  staffTrainingLevel: string
  confidenceLevel: string | null
  notes: string | null
}

export type Place = {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  cuisineType: string
  phone: string | null
  website: string | null
  hours: string | null
  allergenAware: string
  dateAdded: string
  completenessScore: number
  communityConfirmations: number
  allergens: PlaceAllergen[]
}

export type PlaceDetail = Place & {
  reports: unknown[]
  reviews: unknown[]
}

export type SearchResult = {
  places: Place[]
  total: number
  limit: number
  offset: number
}

export type CreatePlaceInput = {
  name: string
  address: string
  latitude: number
  longitude: number
  cuisineType: string
  phone?: string
  website?: string
  hours?: string
  allergenAware?: string
}

async function apiFetch<T>(path: string, init?: RequestInit, token?: AuthToken): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...headers, ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

export async function searchPlaces(params: {
  q?: string
  allergens?: string[]
  limit?: number
  offset?: number
}): Promise<SearchResult> {
  const qs = new URLSearchParams()
  if (params.q) qs.set('q', params.q)
  if (params.allergens?.length) qs.set('allergens', params.allergens.join(','))
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))
  return apiFetch<SearchResult>(`/places?${qs.toString()}`)
}

export async function getPlace(id: string): Promise<PlaceDetail> {
  return apiFetch<PlaceDetail>(`/places/${id}`)
}

export async function createPlace(data: CreatePlaceInput): Promise<Place> {
  return apiFetch<Place>('/places', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePlace(id: string, data: Partial<CreatePlaceInput>): Promise<Place> {
  return apiFetch<Place>(`/places/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deletePlace(id: string): Promise<void> {
  await apiFetch<void>(`/places/${id}`, { method: 'DELETE' })
}

export async function upsertPlaceAllergen(
  placeId: string,
  data: Omit<PlaceAllergen, 'id' | 'placeId'>,
): Promise<PlaceAllergen> {
  return apiFetch<PlaceAllergen>(`/places/${placeId}/allergens`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function removePlaceAllergen(placeId: string, allergenCode: string): Promise<void> {
  await apiFetch<void>(`/places/${placeId}/allergens/${allergenCode}`, { method: 'DELETE' })
}

// ---- Reports ----

export type Contributor = {
  id: string
  displayName: string
  trustScore: number
}

export type StructuredReport = {
  id: string
  placeId: string
  contributorId: string
  contributor: Contributor
  allergensConfirmed: string[]
  reactionStatus: string
  verificationMethod: string
  visitDate: string
  partyType: string
  severityLevel: string
  languageUsed: string | null
  createdAt: string
  helpfulCount: number
}

export type CreateReportInput = {
  placeId: string
  allergensConfirmed: string[]
  reactionStatus: string
  verificationMethod: string
  visitDate: string
  partyType: string
  severityLevel: string
  languageUsed?: string
}

export type ReportsResult = {
  reports: StructuredReport[]
  total: number
}

export async function getReports(placeId: string): Promise<ReportsResult> {
  return apiFetch<ReportsResult>(`/reports?placeId=${placeId}`)
}

export async function createReport(data: CreateReportInput, token: AuthToken): Promise<StructuredReport> {
  return apiFetch<StructuredReport>('/reports', { method: 'POST', body: JSON.stringify(data) }, token)
}

export async function deleteReport(id: string, token: AuthToken): Promise<void> {
  await apiFetch<void>(`/reports/${id}`, { method: 'DELETE' }, token)
}

// ---- Reviews ----

export type NarrativeReview = {
  id: string
  placeId: string
  contributorId: string
  contributor: Contributor
  experienceText: string
  safetyRating: number
  tips: string | null
  photoUrls: string[]
  cuisineContext: string | null
  wouldReturn: string
  createdAt: string
  helpfulCount: number
}

export type CreateReviewInput = {
  placeId: string
  experienceText: string
  safetyRating: number
  tips?: string
  wouldReturn: string
}

export type ReviewsResult = {
  reviews: NarrativeReview[]
  total: number
}

export async function getReviews(placeId: string): Promise<ReviewsResult> {
  return apiFetch<ReviewsResult>(`/reviews?placeId=${placeId}`)
}

export async function createReview(data: CreateReviewInput, token: AuthToken): Promise<NarrativeReview> {
  return apiFetch<NarrativeReview>('/reviews', { method: 'POST', body: JSON.stringify(data) }, token)
}

export async function deleteReview(id: string, token: AuthToken): Promise<void> {
  await apiFetch<void>(`/reviews/${id}`, { method: 'DELETE' }, token)
}

// ---- Contributors ----

export type ContributorProfile = {
  id: string
  displayName: string
  allergenProfile: string[]
  contributionCount: number
  helpfulVotes: number
  trustScore: number
  verifiedParent: boolean
  memberSince: string
  reports: {
    id: string
    placeId: string
    allergensConfirmed: string[]
    reactionStatus: string
    visitDate: string
    createdAt: string
    place: { id: string; name: string }
  }[]
  reviews: {
    id: string
    placeId: string
    safetyRating: number
    experienceText: string
    wouldReturn: string
    createdAt: string
    place: { id: string; name: string }
  }[]
}

export async function getContributor(id: string): Promise<ContributorProfile> {
  return apiFetch<ContributorProfile>(`/contributors/${id}`)
}

export async function updateContributor(
  id: string,
  data: { displayName?: string; allergenProfile?: string[] },
  token: AuthToken,
): Promise<ContributorProfile> {
  return apiFetch<ContributorProfile>(`/contributors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, token)
}

// ---- Trust signals ----

export async function castTrustSignal(
  data: { targetId: string; targetType: string; signalType: string },
  token: AuthToken,
): Promise<void> {
  await apiFetch<unknown>('/trust-signals', { method: 'POST', body: JSON.stringify(data) }, token)
}

// ---- Disputes ----

export async function raiseDispute(
  data: { targetId: string; targetType: string; reason: string },
  token: AuthToken,
): Promise<void> {
  await apiFetch<unknown>('/disputes', { method: 'POST', body: JSON.stringify(data) }, token)
}
