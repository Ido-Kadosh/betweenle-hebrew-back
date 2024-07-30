import express from 'express';

import { getDailyData, checkIsWord } from './game.controller';

const router = express.Router();

router.get('/daily', getDailyData);
router.get('/check', checkIsWord);

export const gameRoutes = router;
