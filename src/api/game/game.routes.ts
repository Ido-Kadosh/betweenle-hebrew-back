import express from 'express';

import { getDailyData, checkIsWord, calculateProximity } from './game.controller';

const router = express.Router();

router.get('/daily', getDailyData);
router.get('/check', checkIsWord);
router.get('/proximity', calculateProximity);

export const gameRoutes = router;
