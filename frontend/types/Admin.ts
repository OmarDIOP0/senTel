
export interface AdminProfile {
  id: number
  nomComplet: string
  role: string
  email: string
  telephone?: string | null
  actif: boolean
  codeSecret?: string | null
}
