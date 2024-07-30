import { Request, Response } from 'express';
import { gameService } from './game.service';
export const getDailyData = async (req: Request, res: Response) => {
	try {
		const dailyData = await gameService.getDailyData();
		res.json(dailyData);
	} catch (err) {
		res.status(500).send({ err: 'Failed to get daily word' });
	}
};
export const checkIsWord = async (req: Request, res: Response) => {
	try {
		const guess = req.query.guess;
		const isWord = await gameService.checkIsWord(guess as string);
		res.json(isWord);
	} catch (err) {
		res.status(500).send({ err: 'Failed to check if word exists in dictionary' });
	}
};

export const calculateProximity = async (req: Request, res: Response) => {
	try {
		const { topWord, midWord, bottomWord } = req.query;
		const { top, bottom } = await gameService.calculateProximity(
			topWord as string,
			midWord as string,
			bottomWord as string
		);
		res.json({ top, bottom });
	} catch (err) {
		res.status(500).send({ err: 'Failed to calculate proximity' });
	}
};
