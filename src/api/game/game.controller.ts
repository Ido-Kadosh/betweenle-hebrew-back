import { Request, Response } from 'express';
import { gameService } from './game.service';
export const getDailyWord = async (req: Request, res: Response) => {
	try {
		const dailyWord = await gameService.getDailyWord();
		res.json(dailyWord);
	} catch (err) {
		res.status(400).send({ err: 'Failed to get daily word' });
	}
};
export const checkIsWord = async (req: Request, res: Response) => {
	try {
		const guess = req.query.guess;
		const isWord = await gameService.checkIsWord(guess as string);
		res.json(isWord);
	} catch (err) {
		res.status(400).send({ err: 'Failed to check if word exists in dictionary' });
	}
};
