const fs = require('fs-extra');

fs.copySync('src/public', 'dist/public');
fs.copySync('./data/', 'dist/data');
