const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = createClient({
	url: REDIS_URL,
});

const resetWord = async () => {
	try {
		await client.connect();
		await client.del('dailyWord');
	} catch (err) {
		console.error('error resetting word:', err);
	} finally {
		await client.quit();
	}
};

resetWord();
