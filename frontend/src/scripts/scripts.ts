import { ErrorFactory, FactoryError, UnauthorizedError, BadRequestError, ForbiddenError, InternalServerError } from './FactoryError';
import { FetchOptions } from "./types";

const URLBASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

const createErrorFromStatus = (res: Response): FactoryError => {
  const error = ErrorFactory.createError(res.status)
  error.toConsole()
  return error
}

const createConnectionError = (): FactoryError => {
  const error = ErrorFactory.createError(500, 'Error al conectar con la API')
  error.toConsole()
  return error
}

const processResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 401) {
    throw createErrorFromStatus(res)
  }
  if (res.status === 403) {
    throw createErrorFromStatus(res)
  }
  if (res.status === 400) {
    const data = await res.json().catch(() => ({}))
    throw ErrorFactory.createError(400, data.message || 'Datos inválidos')
  }
  if (res.status >= 500) {
    throw createErrorFromStatus(res)
  }
  
  if (!res.ok) {
    throw createErrorFromStatus(res)
  }
  return res.json() as Promise<T>
}

const fetchApi = async <T>(options: FetchOptions = {}): Promise<T | null> => {
  try {
    const res = await fetch(URLBASE, options)
    // if(!res.ok) processResponse<T>(res)
    if(!res.ok) console.error("ha ocurrido un error:", await res.json())
    return await res.json()
  } catch (error) {
    if (error instanceof FactoryError) {
      throw error
    }
    throw createConnectionError()
  }
}

export { URLBASE, fetchApi };
