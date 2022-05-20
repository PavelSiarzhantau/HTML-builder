const process = require('process');
const { stdout, stderr } = process;
const path = require('path');
const fs = require('fs');
let data = '';
const stream = fs.createReadStream(path.join(__dirname, './text.txt'), 'utf-8');
stream.on('data', chunk => data += chunk);
stream.on('end', () => stdout.write(data));
stream.on('error', error => stderr.write(error.message));