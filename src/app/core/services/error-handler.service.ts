import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';

interface ErrorDetails {
  message: string;
  code: string | number;
  details: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private readonly toastr = inject(ToastrService);
  private readonly baseUrl = environment.baseURL;
  private readonly TOKEN_KEY = environment.userToken;

  /**
   * Handle HTTP errors and convert to user-friendly messages
   * Shows toast notification and logs error for debugging
   */
  handleError(err: HttpErrorResponse): ErrorDetails {
    const errorDetails = this.parseError(err);

    // Show toast notification to user
    this.toastr.error(errorDetails.message, 'Social App');

    // Log detailed error for debugging
    console.error('API Error:', {
      status: err.status,
      statusText: err.statusText,
      message: errorDetails.message,
      url: err.url,
      details: errorDetails.details,
      timestamp: new Date().toISOString(),
    });

    return errorDetails;
  }

  /**
   * Parse HTTP error response and extract user-friendly message
   */
  private parseError(err: HttpErrorResponse): ErrorDetails {
    debugger;
    let message = 'Something went wrong. Please try again.';
    let code = err.status || 'UNKNOWN';
    let details = '';

    switch (code) {
      case 0:
        message = 'Unable to connect to server. Please check your connection and try again.';
        details = `Cannot connect to ${this.baseUrl}. Ensure the API server is running.`;
        break;

      case 400:
        message = 'Incorrect Email or Password';
        details = this.stringifyError(err.error);
        break;

      case 401:
        message = 'Session expired. Please log in again.';
        this.clearUserToken();
        break;

      case 403:
        message = 'You do not have permission to perform this action.';
        details = err.error?.message || '';
        break;

      case 404:
        message = 'The requested resource was not found.';
        details = `Endpoint not found: ${err.url}`;
        break;

      case 409:
        message = 'Resource already exists.';
        break;

      case 500:
        message = 'Server err. Please try again later.';
        details = err.error?.message || '';
        break;

      default:
        message = err.error?.message || message;
        if (err.error && typeof err.error === 'object') {
          details = this.stringifyError(err.error);
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
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
