type Errors = Record<string, string>

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors: Errors = {}
  ) {
    super(message)

    this.status = status
    this.errors = errors
  }

  static BadRequest(message: string, errors: Errors = {}) {
    return new ApiError(400, message, errors)
  }

  static NotFound(message?: string) {
    return new ApiError(404, message ?? 'Not found')
  }

  static InternalError(message?: string) {
    return new ApiError(500, message ?? 'Internal server error')
  }
}
