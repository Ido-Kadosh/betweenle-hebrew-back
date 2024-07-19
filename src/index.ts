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

// general error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
	console.log('server is running on port:' + port);
});
