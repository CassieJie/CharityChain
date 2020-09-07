const rimraf = require('rimraf');
const path = require('path');
console.log(`Removing azure-git folder...`);
rimraf(path.join(__dirname, 'azure-git'), function (err) {
    if (err) {
        console.error(`Failed to remove directory: azure-git with error: ${err}`);
    } else {
        console.log(`Removing dist folder...`);
        rimraf(path.join(__dirname, 'dist'), function (err) {
            if (err) {
                console.error(`Failed to remove directory: dist with error: ${err}`)
            } else {
                console.log('Clean completed!');
            }
        })
    }
});