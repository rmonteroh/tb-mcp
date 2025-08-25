import config from '../config/index.js';

export interface TokenValidationResult {
  valid: boolean;
  error?: string;
  userId?: string;
  scopes?: string[];
}

export interface AuthContext {
  userId?: string;
  scopes?: string[];
  token: string;
}

/**
 * Simple token validator that checks against configured valid tokens
 * In production, this could be replaced with JWT validation or external API calls
 */
export class TokenValidator {
  private validTokens: Map<string, AuthContext>;

  constructor() {
    this.validTokens = new Map();
    this.initializeTokens();
  }

  private initializeTokens() {
    // Initialize with environment-based tokens
    const envToken = process.env.VALID_TEST_TOKENS;
    if (envToken) {
      const tokens = envToken.split(',');
      tokens.forEach((token, index) => {
        this.validTokens.set(token.trim(), {
          userId: `user-${index + 1}`,
          scopes: ['read', 'write'],
          token: token.trim()
        });
      });
    }

    // Add default test tokens for development
    if (process.env.NODE_ENV !== 'production') {
      this.addTestTokens();
    }
  }

  private addTestTokens() {
    const testTokens = [
      { token: 'test-token-123', userId: 'test-user-1', scopes: ['read', 'write'] },
      { token: 'readonly-token-456', userId: 'test-user-2', scopes: ['read'] },
      { token: 'admin-token-789', userId: 'admin-user', scopes: ['read', 'write', 'admin'] }
    ];

    testTokens.forEach(({ token, userId, scopes }) => {
      this.validTokens.set(token, { userId, scopes, token });
    });
  }

  async validateToken(token: string): Promise<TokenValidationResult> {
    if (!token) {
      return { valid: false, error: 'Token is required' };
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/, '');

    const authContext = this.validTokens.get(cleanToken);
    if (!authContext) {
      return { valid: false, error: 'Invalid token' };
    }

    return {
      valid: true,
      userId: authContext.userId,
      scopes: authContext.scopes
    };
  }

  getAuthContext(token: string): AuthContext | null {
    const cleanToken = token.replace(/^Bearer\s+/, '');
    return this.validTokens.get(cleanToken) || null;
  }

  // Method to add tokens dynamically (useful for testing)
  addToken(token: string, userId: string, scopes: string[] = ['read']) {
    this.validTokens.set(token, { userId, scopes, token });
  }

  // Method to remove tokens
  removeToken(token: string) {
    this.validTokens.delete(token);
  }

  // List all valid tokens (for debugging - should not be used in production)
  listTokens(): string[] {
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    return Array.from(this.validTokens.keys());
  }
}

export const tokenValidator = new TokenValidator();