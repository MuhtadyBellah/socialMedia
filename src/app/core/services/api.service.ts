import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseURL;
  private readonly TOKEN_KEY = environment.userToken;

  // Cache for GET requests (key: endpoint, value: cached response)
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = environment.cacheTTL;
  private readonly REQUEST_TIMEOUT = environment.requestTimeout;

  constructor(private http: HttpClient) {}

  /**
   * Build HTTP headers with authorization token
   * Includes Content-Type and Authorization Bearer token if available
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Handle HTTP errors and convert to user-friendly messages
   * Updates app state with error notification
   *
   * @param error - HttpErrorResponse from failed request
   * @returns Error object with user-friendly message
   */
  private handleError(error: HttpErrorResponse): Error {
    let errorMessage = 'Something went wrong. Please try again.';
    let errorCode = error.status || 'UNKNOWN';
    let detailedError = '';

    switch (errorCode) {
      case 0:
        errorMessage = 'Unable to connect to server. Please check your connection and try again.';
        detailedError = `Cannot connect to ${this.baseUrl}. Ensure the API server is running.`;
        break;
      case 400:
        errorMessage = error.error?.message || 'Invalid request. Please check your input.';
        detailedError = JSON.stringify(error.error, null, 2);
        break;
      case 401:
        errorMessage = 'Session expired. Please log in again.';
        localStorage.removeItem(this.TOKEN_KEY);
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        detailedError = error.error?.message || '';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        detailedError = `Endpoint not found: ${error.url}`;
        break;
      case 409:
        errorMessage = error.error?.message || 'Conflict: Resource already exists.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        detailedError = error.error?.message || '';
        break;
      default:
        errorMessage = error.error?.message || errorMessage;
        if (error.error && typeof error.error === 'object') {
          detailedError = JSON.stringify(error.error, null, 2);
        }
    }

    // Log error for debugging
    console.error('API Error:', {
      status: error.status,
      statusText: error.statusText,
      message: errorMessage,
      url: error.url,
      details: detailedError,
      timestamp: new Date().toISOString(),
    });

    return new Error(errorMessage);
  }

  clearCache(endpoint?: string): void {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Clear cache entries related to a specific endpoint
   * Useful for invalidating related cached data
   *
   * @param endpoint - The endpoint that was modified
   */
  private clearRelatedCache(endpoint: string): void {
    // Extract the base resource name (e.g., 'product' from 'product/1')
    const baseResource = endpoint.split('/')[0];

    // Clear cache entries related to this resource
    for (const key of this.cache.keys()) {
      if (key.startsWith(baseResource)) {
        this.cache.delete(key);
      }
    }
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    try {
      // Check if data is in cache and not expired
      const cachedData = this.cache.get(endpoint);
      if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_TTL) {
        console.log(`Using cached data for: ${endpoint}`);
        return cachedData.data;
      }

      const response = this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params: params,
      });
      // Cache the response
      this.cache.set(endpoint, {
        data: response,
        timestamp: Date.now(),
      });

      return response;
    } catch (error) {
      throw this.handleError(error as HttpErrorResponse);
    }
  }

  post<T>(endpoint: string, data?: object): Observable<T> {
    try {
      // Clear cache for related endpoints
      this.clearRelatedCache(endpoint);

      const response = this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
        headers: this.getHeaders(),
      });

      return response;
    } catch (error) {
      throw this.handleError(error as HttpErrorResponse);
    }
  }

  put<T>(endpoint: string, data?: object): Observable<T> {
    try {
      // Clear cache for related endpoints
      this.clearRelatedCache(endpoint);

      const response = this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, {
        headers: this.getHeaders(),
      });

      return response;
    } catch (error) {
      throw this.handleError(error as HttpErrorResponse);
    }
  }

  delete<T>(endpoint: string): Observable<T> {
    try {
      // Clear cache for related endpoints
      this.clearRelatedCache(endpoint);

      const response = this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
      });

      return response;
    } catch (error) {
      throw this.handleError(error as HttpErrorResponse);
    }
  }
}
