import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { gameRoutes } from './api/game/game.routes';

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'public')));
} else {
	const corsOptions = {
		origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
		credentials: true,
	};
	app.use(cors(corsOptions));
}

app.use('/api/game', gameRoutes);

app.get('/api/time-til-midnight', (req, res) => {
	const now = new Date();
	const midnight = new Date(now);
	midnight.setHours(24, 0, 0, 0);

	const timeTilMidnight = midnight.getTime() - now.getTime(); // Time in milliseconds
	res.json(timeTilMidnight);
});

app.get('/**', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// general error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
	console.log('server is running on port:' + port);
});
