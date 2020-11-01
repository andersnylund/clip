export interface Http {
  info: string
  statusCode: number
}

export class HttpError extends Error implements Http {
  info: string
  statusCode: number

  constructor(message: string, info: string, status: number) {
    super(message)
    this.info = info
    this.statusCode = status
  }
}
