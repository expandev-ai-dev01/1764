/**
 * @summary
 * Database connection and query execution utilities
 * Provides centralized database access with connection pooling
 *
 * @module utils/database
 */

import sql from 'mssql';
import { config } from '@/config';

export enum ExpectedReturn {
  Single = 'single',
  Multi = 'multi',
  None = 'none',
}

export interface IRecordSet<T = any> {
  recordset: T[];
  rowsAffected: number[];
}

let pool: sql.ConnectionPool | null = null;

/**
 * @summary
 * Get or create database connection pool
 *
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config.database);
  }
  return pool;
}

/**
 * @summary
 * Replace [dbo] schema with project-specific schema based on PROJECT_ID
 *
 * @param {string} routine - Stored procedure name with schema
 * @returns {string} Routine with replaced schema
 */
function replaceSchemaInRoutine(routine: string): string {
  const projectId = config.project.id;

  if (!projectId) {
    return routine;
  }

  const projectSchema = `project_${projectId}`;

  let replaced = routine.replace(/\[dbo\]\./gi, `[${projectSchema}].`);
  replaced = replaced.replace(/\bdbo\./gi, `[${projectSchema}].`);

  return replaced;
}

/**
 * @summary
 * Execute database stored procedure with automatic schema replacement
 *
 * @param {string} routine - Stored procedure name
 * @param {Record<string, any>} parameters - Procedure parameters
 * @param {ExpectedReturn} expectedReturn - Expected return type
 * @param {sql.Transaction} transaction - Optional transaction
 * @param {string[]} resultSetNames - Optional result set names
 * @returns {Promise<any>} Query results
 */
export async function dbRequest(
  routine: string,
  parameters: Record<string, any>,
  expectedReturn: ExpectedReturn,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  const schemaReplacedRoutine = replaceSchemaInRoutine(routine);

  const connectionPool = transaction ? transaction : await getPool();
  const request = connectionPool.request();

  for (const [key, value] of Object.entries(parameters)) {
    request.input(key, value);
  }

  const result = await request.execute(schemaReplacedRoutine);

  if (expectedReturn === ExpectedReturn.None) {
    return null;
  }

  if (expectedReturn === ExpectedReturn.Single) {
    return result.recordset[0] || null;
  }

  if (expectedReturn === ExpectedReturn.Multi) {
    if (resultSetNames && resultSetNames.length > 0) {
      const namedResults: Record<string, any> = {};
      resultSetNames.forEach((name, index) => {
        if (Array.isArray(result.recordsets)) {
          namedResults[name] = result.recordsets[index] || [];
        }
      });
      return namedResults;
    }
    return result.recordsets;
  }

  return result.recordset;
}

/**
 * @summary
 * Begin database transaction
 *
 * @returns {Promise<sql.Transaction>} Transaction object
 */
export async function beginTransaction(): Promise<sql.Transaction> {
  const connectionPool = await getPool();
  const transaction = new sql.Transaction(connectionPool);
  await transaction.begin();
  return transaction;
}

/**
 * @summary
 * Commit database transaction
 *
 * @param {sql.Transaction} transaction - Transaction to commit
 */
export async function commitTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.commit();
}

/**
 * @summary
 * Rollback database transaction
 *
 * @param {sql.Transaction} transaction - Transaction to rollback
 */
export async function rollbackTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.rollback();
}

/**
 * @summary
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}
