import fs from 'fs';
import { createClient } from 'redis';
import { logger } from '../../services/logger.service';
const FILE_PATH = process.env.WORDS_PATH || './data/output.txt';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = createClient({
	url: REDIS_URL,
});

const checkIsWord = (guess: string) => {
	return new Promise((resolve, reject) => {
		fs.readFile(FILE_PATH, 'utf8', (err, data) => {
			if (err) {
				return reject(err);
			}
			resolve(data.includes(guess));
		});
	});
};

const getDailyWord = async () => {
	try {
		await client.connect();
		const dailyWord = await client.get('dailyWord');

		if (dailyWord) return dailyWord;

		const newDailyWord = await _getRandomWord();
		logger.info(`New daily word selected: ${newDailyWord}`);
		// Set the daily word with an expiry date of midnight
		await client.setEx('dailyWord', _calculateTTL(), newDailyWord);
		return newDailyWord;
	} catch (err) {
		logger.error('Error getting daily word:', err);
		throw err;
	} finally {
		await client.quit();
	}
};

const _getRandomWord = (): Promise<string> => {
	return new Promise((resolve, reject) => {
		fs.readFile(FILE_PATH, 'utf8', (err, data) => {
			if (err) {
				return reject(err);
			}

			const words = data.split(/\r?\n/);
			const randomWord = words[Math.floor(Math.random() * words.length)];
			resolve(randomWord);
		});
	});
};

const _calculateTTL = (): number => {
	const now = new Date();
	const midnight = new Date();
	midnight.setHours(24, 0, 0, 0);
	return Math.floor((midnight.getTime() - now.getTime()) / 1000); // TTL in seconds
};

export const gameService = {
	checkIsWord,
	getDailyWord,
};
