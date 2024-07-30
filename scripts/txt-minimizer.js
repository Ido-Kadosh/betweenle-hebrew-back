const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Input and output file paths
const inputFilePath = './data/all_with_fatverb.txt';
const outputFilePath = './data/words.txt';

const fileExtension = path.extname(inputFilePath);

const readStream = fs.createReadStream(inputFilePath);
const writeStream = fs.createWriteStream(outputFilePath);

const rl = readline.createInterface({
	input: readStream,
	crlfDelay: Infinity, // Ensures the readline interface correctly handles CRLF and LF newlines
});

// match exactly 5 Hebrew letters
const hebrewRegex = /^[א-ת]{5}$/;

rl.on('line', line => {
	let text, number;
	if (fileExtension === '.csv') {
		[text, number] = line.split(',');
	} else if (fileExtension === '.txt') {
		text = line;
	}

	// when csv, need to check if text, and if number >= 100. when txt, need to trim, and short circuit number check
	if (text && hebrewRegex.test(text.trim()) && (!number || parseInt(number) >= 100)) {
		writeStream.write(text + '\n');
	}
});
// Handle the end of the input file
rl.on('close', () => {
	console.log('Processing completed.');
	writeStream.end();
});
