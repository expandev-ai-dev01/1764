/**
 * @summary
 * Main API router with version management
 * Routes all API requests to appropriate version handlers
 *
 * @module routes
 */

import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

router.use('/v1', v1Routes);

export default router;
