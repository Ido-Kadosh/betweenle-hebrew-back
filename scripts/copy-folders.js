const fs = require('fs-extra');

fs.copySync('./public', 'dist/public');
fs.copySync('./data/', 'dist/data');
