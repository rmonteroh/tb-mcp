import { ZodRawShape } from "zod";

// Tool definition interface
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ZodRawShape;
  handler: (
    args: any,
    //  extra?: { authContext?: string } // TODO: Fix type to RequestHandlerExtra<any, any>
    extra?: any
  ) => Promise<{ content: { type: "text"; text: string }[] }>;
}
