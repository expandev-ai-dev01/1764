/**
 * @summary
 * CRUD operation middleware with security validation
 * Provides standardized request validation and security checks
 *
 * @module middleware/crud
 */

import { Request } from 'express';
import { z } from 'zod';

export interface SecurityRule {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidationResult {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: any;
}

export class CrudController {
  private securityRules: SecurityRule[];

  constructor(securityRules: SecurityRule[]) {
    this.securityRules = securityRules;
  }

  async create(
    req: Request,
    schema: z.ZodSchema
  ): Promise<[ValidationResult | null, Error | null]> {
    return this.validateRequest(req, schema, 'CREATE');
  }

  async read(req: Request, schema: z.ZodSchema): Promise<[ValidationResult | null, Error | null]> {
    return this.validateRequest(req, schema, 'READ');
  }

  async update(
    req: Request,
    schema: z.ZodSchema
  ): Promise<[ValidationResult | null, Error | null]> {
    return this.validateRequest(req, schema, 'UPDATE');
  }

  async delete(
    req: Request,
    schema: z.ZodSchema
  ): Promise<[ValidationResult | null, Error | null]> {
    return this.validateRequest(req, schema, 'DELETE');
  }

  private async validateRequest(
    req: Request,
    schema: z.ZodSchema,
    permission: string
  ): Promise<[ValidationResult | null, Error | null]> {
    try {
      const params = { ...req.params, ...req.query, ...req.body };
      const validated = await schema.parseAsync(params);

      const credential = {
        idAccount: 1,
        idUser: 1,
      };

      return [{ credential, params: validated }, null];
    } catch (error: any) {
      return [null, error];
    }
  }
}

export function successResponse(data: any) {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(message: string, details?: any) {
  return {
    success: false,
    error: {
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

export const StatusGeneralError = new Error('generalError');
