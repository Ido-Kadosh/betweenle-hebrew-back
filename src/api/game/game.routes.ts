import express from 'express';

import { getDailyWord, checkIsWord } from './game.controller';

const router = express.Router();

router.get('/daily', getDailyWord);
router.get('/check', checkIsWord);

export const gameRoutes = router;
