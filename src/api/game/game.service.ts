import fs from 'fs';
import { createClient } from 'redis';
import { logger } from '../../services/logger.service';
import path from 'path';

const FILE_PATH = process.env.WORDS_PATH || './data/words.txt';
const USED_WORDS_PATH = process.env.USED_WORDS_PATH || './data/used_words.txt';
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
			if (data.includes(guess)) {
				return resolve(true);
			}

			fs.readFile(USED_WORDS_PATH, 'utf8', (err, usedData) => {
				if (err) {
					return reject(err);
				}
				resolve(usedData.includes(guess));
			});
		});
	});
};

const getDailyData = async () => {
	try {
		await client.connect();
		const dailyWord = await client.get('dailyWord');

		if (dailyWord) {
			const dayNumber = await _getDayNumber();
			return { dailyWord, dayNumber };
		}

		const { word, dayNumber } = await _getRandomWord();
		logger.info(`New daily word selected: ${word}`);
		// Set the daily word with an expiry date of midnight
		await client.setEx('dailyWord', _calculateTTL(), word);
		return { dailyWord: word, dayNumber };
	} catch (err) {
		logger.error('Error getting daily word:', err);
		throw err;
	} finally {
		await client.quit();
	}
};

const _getDayNumber = (): Promise<number> => {
	return new Promise((resolve, reject) => {
		fs.readFile(USED_WORDS_PATH, 'utf8', (err, data) => {
			if (err && err.code !== 'ENOENT') {
				return reject(err);
			}
			const usedWords = data ? data.split(/\r?\n/).filter(word => word.trim() !== '') : [];
			resolve(usedWords.length);
		});
	});
};

const _getRandomWord = (): Promise<{ word: string; dayNumber: number }> => {
	return new Promise((resolve, reject) => {
		fs.readFile(FILE_PATH, 'utf8', (err, data) => {
			if (err) {
				return reject(err);
			}

			const words = data.split(/\r?\n/).filter(word => word.trim() !== '');

			// probably won't reach here ever.
			if (words.length === 0) {
				return reject(new Error('No words left in the file.'));
			}

			const randomIndex = Math.floor(Math.random() * words.length);
			const randomWord = words[randomIndex];

			words.splice(randomIndex, 1);

			fs.writeFile(FILE_PATH, words.join('\n'), err => {
				if (err) {
					return reject(err);
				}

				fs.readFile(USED_WORDS_PATH, 'utf8', (err, usedWordsData) => {
					// don't reject if file doesn't exist
					if (err && err.code !== 'ENOENT') {
						return reject(err);
					}

					const usedWords = usedWordsData ? usedWordsData.split(/\r?\n/).filter(word => word.trim() !== '') : [];
					usedWords.push(randomWord);

					fs.writeFile(USED_WORDS_PATH, usedWords.join('\n'), err => {
						if (err) {
							return reject(err);
						}

						resolve({ word: randomWord, dayNumber: usedWords.length });
					});
				});
			});
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
	getDailyData,
};
