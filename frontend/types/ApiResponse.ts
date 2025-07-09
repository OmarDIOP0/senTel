export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
export interface ErrorResponse {
  success: boolean
  message: string
  error: string
}
