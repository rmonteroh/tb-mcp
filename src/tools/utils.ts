// Utility functions for the TicketBeep MCP server

/**
 * Helper function to create a standardized JSON response
 * @param data - The data to be serialized as JSON
 * @returns Formatted response object for MCP tools
 */
export function createJsonResponse(data: any): { content: { type: "text"; text: string }[] } {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Helper function to create a success message response
 * @param message - The success message to display
 * @returns Formatted response object for MCP tools
 */
export function createSuccessResponse(message: string): { content: { type: "text"; text: string }[] } {
  return {
    content: [{ type: "text", text: message }],
  };
}

/**
 * Helper function to create an error response
 * @param error - The error message or object
 * @returns Formatted error response object
 */
export function createErrorResponse(error: string | Error): { content: { type: "text"; text: string }[] } {
  const errorMessage = error instanceof Error ? error.message : error;
  return {
    content: [{ type: "text", text: `Error: ${errorMessage}` }],
  };
}

/**
 * Helper function to format dates to YYYY-MM-DD string format
 * @param date - The date string or Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDateToString(date: string | Date): string {
  return new Date(date).toISOString().split("T")[0];
}

/**
 * Helper function to validate required fields in an object
 * @param data - The object to validate
 * @param requiredFields - Array of required field names
 * @throws Error if any required field is missing
 */
export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
}

/**
 * Helper function to sanitize and validate year parameters
 * @param year - The year value to validate
 * @param minYear - Minimum allowed year (default: 2000)
 * @param maxYear - Maximum allowed year (default: current year + 10)
 * @returns Validated year number
 */
export function validateYear(year: number, minYear: number = 2000, maxYear: number = new Date().getFullYear() + 10): number {
  if (typeof year !== "number" || isNaN(year)) {
    throw new Error("Year must be a valid number");
  }
  
  if (year < minYear || year > maxYear) {
    throw new Error(`Year must be between ${minYear} and ${maxYear}`);
  }
  
  return year;
}

/**
 * Helper function to validate pagination parameters
 * @param page - Page number (1-based)
 * @param pageSize - Items per page
 * @returns Validated pagination object
 */
export function validatePagination(page?: number, pageSize?: number): { page: number; pageSize: number } {
  const validatedPage = Math.max(1, page || 1);
  const validatedPageSize = Math.min(100, Math.max(1, pageSize || 20));
  
  return {
    page: validatedPage,
    pageSize: validatedPageSize,
  };
}

/**
 * Helper function to safely parse JSON strings
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("Failed to parse JSON:", error);
    return fallback;
  }
}

/**
 * Helper function to create a standardized API error response
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param details - Optional error details
 * @returns Formatted API error response
 */
export function createApiErrorResponse(
  statusCode: number,
  message: string,
  details?: any
): { content: { type: "text"; text: string }[] } {
  const errorResponse = {
    error: {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    },
  };
  
  return createJsonResponse(errorResponse);
}

/**
 * Helper function to truncate long strings for display
 * @param str - The string to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + "...";
}

/**
 * Helper function to create a loading/processing response
 * @param operation - Description of the operation being performed
 * @returns Formatted loading response
 */
export function createLoadingResponse(operation: string): { content: { type: "text"; text: string }[] } {
  return {
    content: [{ type: "text", text: `Processing ${operation}...` }],
  };
}

/**
 * Helper function to format large numbers with commas
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Helper function to format currency values
 * @param amount - The amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}