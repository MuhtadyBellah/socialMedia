import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseURL;
  private readonly CACHE_TTL = environment.cacheTTL;

  // Cache for GET requests (key: endpoint, value: cached response)
  private cache = new Map<string, { data: Observable<any>; timestamp: number }>();

  clearCache(endpoint?: string): void {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  private clearRelatedCache(endpoint: string): void {
    const baseResource = endpoint.split('/')[0];
    for (const key of this.cache.keys()) {
      if (key.startsWith(baseResource)) {
        this.cache.delete(key);
      }
    }
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    const cachedData = this.cache.get(endpoint);
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_TTL) {
      console.log(`[ApiService] Using cached data for: ${endpoint}`);
      return cachedData.data;
    }

    const response = this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
    this.cache.set(endpoint, {
      data: response,
      timestamp: Date.now(),
    });

    return response;
  }

  post<T>(endpoint: string, data?: object): Observable<T> {
    this.clearRelatedCache(endpoint);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  put<T>(endpoint: string, data?: object): Observable<T> {
    this.clearRelatedCache(endpoint);
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  patch<T>(endpoint: string, data?: object): Observable<T> {
    this.clearRelatedCache(endpoint);
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    this.clearRelatedCache(endpoint);
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
