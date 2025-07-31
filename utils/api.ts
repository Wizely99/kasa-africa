// @ts-nocheck
import { getToken } from 'next-auth/jwt'; 
import { cookies } from 'next/headers';

export class APIError extends Error {
    constructor(
      message: string,
      public status?: number,
      public code?: string
    ) {
      super(message)
      this.name = 'APIError'
    }
  }



/**
 * Retrieves the authentication token from cookies.
 * 
 * This function extracts the JWT stored in cookies using `next-auth/jwt` and returns
 * the access token for authenticated requests.
 * 
 * @returns {Promise<string>} The access token if found.
 * @throws {Error} If the token is missing or cannot be retrieved.
 */
export async function getTokenFromCookies(): Promise<string> {
  try {
    const token = await getToken({
      req: { cookies: await cookies() },
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.access_token) {
      throw new Error("No access token found");
    }

    return token.access_token as string;
  } catch {
    throw new Error("Unauthorized: Unable to retrieve token");
  }
}

  
  export async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || 'API request failed',
        response.status,
        errorData.code
      )
    }
  
    // Handle empty responses
    if (response.status === 204) {
      return {} as T
    }
  
    try {
      return await response.json()
    } catch (error) {
      throw new APIError(`Invalid JSON response from API\n${error}`)
    }
  }
  
  export function buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item.toString()))
        } else {
          searchParams.append(key, value.toString())
        }
      }
    })
    
    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
  }
  


/**
 * Creates an HTTP headers object for API requests.
 *
 * This function generates a headers object with a default `Content-Type` of `application/json`.
 * If `addAuthToken` is `true`, it adds an `Authorization` header with a Bearer token retrieved from cookies.
 *
 * @param {boolean} [addAuthToken=true] - Whether to include the authentication token.
 * @returns {Promise<HeadersInit>} A headers object ready for use in fetch requests.
 * @throws {Error} If the authentication token cannot be retrieved.
 */
export async function createHeaders(addAuthToken: boolean = true): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (addAuthToken) {
    try {
      const token = await getTokenFromCookies();
      headers["Authorization"] = `Bearer ${token}`;
    } catch  {
      throw new Error("Unauthorized: Unable to create headers with token.");
    }
  }

  return headers;
}

  
  export async function fetchWithTimeout(
    input: RequestInfo | URL,
    init?: RequestInit & { timeout?: number }
  ): Promise<Response> {
    const { timeout = 5000, ...options } = init || {}
  
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
  
    try {
      const response = await fetch(input, {
        ...options,
        signal: controller.signal,
      })
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }
  
  export function handleFormData(formData: FormData): Record<string, any> {
    const data: Record<string, any> = {}
    
    formData.forEach((value, key) => {
      // Handle multiple values for the same key
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]]
        }
        data[key].push(value)
      } else {
        // Convert 'true' and 'false' strings to booleans
        if (value === 'true') value = true
        if (value === 'false') value = false
        
        // Convert numeric strings to numbers
        if (!isNaN(value as any) && value !== '') {
          value = Number(value)
        }
        
        data[key] = value
      }
    })
    
    return data
  }
  
  // Type guard for checking API errors
  export function isAPIError(error: unknown): error is APIError {
    return error instanceof APIError
  }
  
  // Retry mechanism for failed requests
  export async function withRetry<T>(
    fn: () => Promise<T>,
    options: {
      retries?: number;
      delay?: number;
      onRetry?: (error: Error, attempt: number) => void;
    } = {}
  ): Promise<T> {
    const { retries = 3, delay = 1000, onRetry } = options
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (attempt === retries) throw error
        
        if (onRetry) {
          onRetry(error as Error, attempt)
        }
        
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
    
    throw new Error('Retry mechanism failed')
  }