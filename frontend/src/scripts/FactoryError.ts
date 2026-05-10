export class FactoryError extends Error {
  code: number
  description: string
  title: string
  timestamp: Date

  constructor(message: string, code: number, description: string, title: string) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.description = description
    this.title = title
    this.timestamp = new Date()
    
    Error.captureStackTrace(this, this.constructor)
  }

  toConsole(): void {
    console.error(`%c[${this.title}]`, 'color: red; font-weight: bold;')
    console.error(`Código: ${this.code}`)
    console.error(`Descripción: ${this.description}`)
    console.error(`Mensaje: ${this.message}`)
    console.error(`Timestamp: ${this.timestamp.toISOString()}`)
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      title: this.title,
      description: this.description,
      message: this.message,
      timestamp: this.timestamp.toISOString()
    }
  }
}

export class BadRequestError extends FactoryError {
  constructor(message = 'Solicitud incorrecta') {
    super(message, 400, 'Los datos enviados son inválidos o incompletos', 'Bad Request')
  }
}

export class UnauthorizedError extends FactoryError {
  constructor(message = 'No autorizado') {
    super(message, 401, 'Debes iniciar sesión o tu sesión ha expirado', 'Unauthorized')
  }
}

export class ForbiddenError extends FactoryError {
  constructor(message = 'Acceso denegado') {
    super(message, 403, 'No tienes permisos para acceder a este recurso', 'Forbidden')
  }
}

export class InternalServerError extends FactoryError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500, 'Ha ocurrido un error en el servidor. Intenta más tarde', 'Internal Server Error')
  }
}

export const ErrorFactory = {
  createError: (status: number, message?: string): FactoryError => {
    const errors: Record<number, new (message?: string) => FactoryError> = {
      400: BadRequestError,
      401: UnauthorizedError,
      403: ForbiddenError,
      500: InternalServerError
    }

    const ErrorClass = errors[status]
    if (!ErrorClass) {
      return new FactoryError(message || 'Error desconocido', status, 'Error desconocido', 'Unknown Error')
    }

    return new ErrorClass(message)
  }
}
