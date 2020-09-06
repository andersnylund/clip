export interface Http {
  info: string
  status: number
}

export class HttpError extends Error implements Http {
  info: string
  status: number

  constructor(message: string, info: string, status: number) {
    super(message)
    this.info = info
    this.status = status
  }
}
