import { z } from "zod";

/**
 * Convert a Zod schema to JSON Schema format for MCP SDK compatibility
 * This is a simplified version that handles the most common cases
 */
export function zodToJsonSchema(zodSchema: z.ZodSchema): any {
  // For now, return a basic object schema since the MCP SDK expects JSON Schema
  // The actual validation will be done with Zod in the handler
  return {
    type: "object",
    properties: {},
    additionalProperties: true,
  };
}

/**
 * Validate data against a Zod schema and return the validated data
 */
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Validate data against a Zod schema and return the validated data or throw a formatted error
 */
export function validateWithZodSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(`Validation failed: ${formattedErrors}`);
    }
    throw error;
  }
}
