import fs from 'fs';

const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}

const getTime = () => {
	let now = new Date();
	return now.toLocaleString('he');
};

const isError = (e: any) => {
	return e && e.stack && e.message;
};

const doLog = (type: string, ...args: any) => {
	// get strings and errors as is, but stringify non-error objects.
	const strs = args.map((arg: any) => (typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg)));

	var line = strs.join(' | ');
	line = `${getTime()} - ${type} - ${line}\n`;
	console.log(line);
	fs.appendFile('./logs/backend.log', line, err => {
		if (err) console.log('FATAL: cannot write to log file');
	});
};

export const logger = {
	debug(...args: any) {
		if (process.env.NODE_ENV === 'production') return;
		doLog('DEBUG', ...args);
	},
	info(...args: any) {
		doLog('INFO', ...args);
	},
	warn(...args: any) {
		doLog('WARN', ...args);
	},
	error(...args: any) {
		doLog('ERROR', ...args);
	},
};
