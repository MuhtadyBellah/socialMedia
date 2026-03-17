import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';

export interface ErrorDetails {
  message: string;
  code: number | string;
  details?: string;
}

export interface SuccessDetails {
  message: string;
  title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly toastr = inject(ToastrService);
  private readonly baseUrl = environment.baseURL;

  /**
   * Handle HTTP errors and convert to user-friendly messages
   * Shows toast notification and logs error for debugging
   */
  handleError(error: HttpErrorResponse): ErrorDetails {
    const errorDetails = this.parseError(error);

    // Show toast notification to user
    this.toastr.error(errorDetails.message, 'Social App');

    // Log detailed error for debugging
    console.error('API Error:', {
      status: error.status,
      statusText: error.statusText,
      message: errorDetails.message,
      url: error.url,
      details: errorDetails.details,
      timestamp: new Date().toISOString(),
    });

    return errorDetails;
  }

  /**
   * Parse HTTP error response and extract user-friendly message
   */
  private parseError(error: HttpErrorResponse): ErrorDetails {
    let message = 'Something went wrong. Please try again.';
    let code = error.status || 'UNKNOWN';
    let details = '';

    switch (code) {
      case 0:
        message = 'Unable to connect to server. Please check your connection and try again.';
        details = `Cannot connect to ${this.baseUrl}. Ensure the API server is running.`;
        break;

      case 400:
        message = 'Incorrect Bad Request';
        details = this.stringifyError(error.error);
        break;

      case 401:
        message = error.error?.message || 'Session expired. Please log in again.';
        this.clearUserToken();
        break;

      case 403:
        message = 'You do not have permission to perform this action.';
        details = error.error?.message || '';
        break;

      case 404:
        message = 'The requested resource was not found.';
        details = `Endpoint not found: ${error.url}`;
        break;

      case 409:
        message = 'Resource already exists.';
        break;

      case 500:
        message = 'Server error. Please try again later.';
        details = error.error?.message || '';
        break;

      default:
        message = error.error?.message || message;
        if (error.error && typeof error.error === 'object') {
          details = this.stringifyError(error.error);
        }
    }

    return { message, code, details };
  }

  /**
   * Safely stringify error object for logging
   */
  private stringifyError(errorObj: any): string {
    try {
      return typeof errorObj === 'string' ? errorObj : JSON.stringify(errorObj, null, 2);
    } catch {
      return String(errorObj);
    }
  }

  /**
   * Clear user token on authentication failure
   */
  private clearUserToken(): void {
    localStorage.removeItem(environment.userToken);
  }

  /**
   * Handle HTTP success responses
   * Shows success toast notification if response contains a message
   */
  handleSuccess(response: any): SuccessDetails | null {
    const message = response?.message || response?.data?.message || '';

    if (!message) {
      return null;
    }

    const successDetails: SuccessDetails = {
      message: String(message),
      title: 'Success',
    };

    this.toastr.success(successDetails.message, successDetails.title);

    console.log('API Success:', {
      message: successDetails.message,
      timestamp: new Date().toISOString(),
    });

    return successDetails;
  }

  shouldShowSuccessNotification(url: string, method: string): boolean {
    if (method === 'GET') {
      return false;
    }

    const excludedPaths = ['/auth/signin', '/auth/signup'];
    return !excludedPaths.some((path) => url.includes(path));
  }
}
