import express from 'express';

import { getDailyWord, checkIsWord } from './game.controller';

const router = express.Router();

router.get('/word', getDailyWord);
router.get('/check', checkIsWord);

export const gameRoutes = router;
