require('dotenv').config(); // Load environment variables from .env file

const fs = require('fs');
const base64 = require('base-64');

const rootFolder = './android/app/';
const fileName = 'google-services.json';

// Decode the base64 encoded GOOGLE_SERVICES_JSON
const encodedJson = process.env.GOOGLE_SERVICES_JSON;

// Ensure the directory structure exists
fs.mkdir(rootFolder, {recursive: true}, err => {
  if (err) {
    console.error('Error creating directory:', err);
    process.exit(1);
  }

  // Write the decoded JSON to file
  fs.writeFile(rootFolder + fileName, base64.decode(encodedJson), error => {
    if (err) {
      console.error('Error writing file:', error);
      process.exit(1);
    }
    console.log(`Generated ${fileName} successfully!`);
  });
});
