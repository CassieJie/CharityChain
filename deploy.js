const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { spawn } = require('child_process');
const ncp = require('ncp').ncp;
const os = require('os');
const moment = require('moment');
const decoder = new TextDecoder();

const deployInfo = `Auto deploy from ${os.hostname()} at ${moment().format('LLL')}.`;
const buildMode = process.argv.indexOf('build') > -1;
const deployMode = process.argv.indexOf('deploy') > -1;

let gitPath = path.join(__dirname, 'azure-git');
const execOption = {
    cwd: gitPath
};
console.log('Checking if azure-git folder exists...');
function handleGitSpawnData(data) {
    let str = decoder.decode(data);
    if (str.endsWith('\n')) {
        process.stdout.cursorTo(0);
        process.stdout.write(str);
    } else {
        let messages = str.split('\r');
        let message = '';
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].trim().length) {
                message = messages[i].trim();
                break;
            }
        }
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(message);
    }
}

if (buildMode) {
    startBuild();
} else if (deployMode) {
    startDeploy();
}

function startBuild() {
    if (fs.existsSync(gitPath)) {
        console.log('azure-git folder already existed');
        gitPull();
    } else {
        console.log('azure-git folder not found, cloning remote repository...');
        let cp = spawn('git', ['clone', 'https://realcharitychain.scm.azurewebsites.net:443/realcharitychain.git', 'azure-git', '--progress']);

        cp.stderr.on('data', handleGitSpawnData);
        cp.on('close', function (code) {
            if (code == 0) {
                prepareFiles();
            } else {
                console.log(`git clone failed with exit code: ${code}`);
            }
        });
    }
}


function gitPull() {
    console.log('Pulling the latest update from remote repository');
    let cp = spawn('git', ['pull', '--progress'], execOption);
    cp.stdout.on('data', handleGitSpawnData);
    cp.stderr.on('data', handleGitSpawnData);
    cp.on('close', function (code) {
        if (code == 0) {
            prepareFiles();
        } else {
            console.log(`git pull failed with exit code: ${code}`);
        }
    });
}

function prepareFiles() {
    let rootFiles = fs.readdirSync(gitPath);
    rootFiles.forEach(file => {
        let filePath = path.join(gitPath, file);
        if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
        }
    })
    copyDist();
    function copyDist() {
        let distPath = path.join(gitPath, 'dist');
        if (fs.existsSync(distPath)) {
            console.log('Removing dist folder');
            rimraf(distPath, function (err) {
                if (err) {
                    console.log(`Failed to remove dist folder with err: ${err}`);
                } else {
                    _copyDist();
                }
            });
        } else {
            _copyDist();
        }
    }
    function _copyDist() {
        console.log('Copying dist folder');
        ncp(path.join(__dirname, 'dist'), path.join(gitPath, 'dist'), function (err) {
            if (err) {
                console.log(`Failed to copy dist folder with error: ${err}`);
            } else {
                copyRouters();
            }
        })
    }
    function copyRouters() {
        let srcPath = path.join(gitPath, 'src');
        if (!fs.existsSync(srcPath)) {
            fs.mkdirSync(srcPath);
            _copyRouters();
        } else {
            console.log('Removing src folder');
            rimraf(srcPath, function (err) {
                if (err) {
                    console.log(`Failed to remove src folder with error: ${err}`);
                } else {
                    fs.mkdirSync(srcPath);
                    _copyRouters();
                }
            });
        }
    }
    function _copyRouters() {
        console.log('Copying routers folder');
        ncp(path.join(__dirname, 'src', 'routers'), path.join(gitPath, 'src', 'routers'), function (err) {
            if (err) {
                console.log(`Failed to copy routers folder with error: ${err}`);
            } else {
                copyClasses();
            }
        });
    }
    function copyClasses() {
        console.log('Copying classes folder');
        ncp(path.join(__dirname, 'src', 'classes'), path.join(gitPath, 'src', 'classes'), function (err) {
            if (err) {
                console.log(`Failed to copy classes folder with error: ${err}`);
            } else {
                copyTemplates();
            }
        })
    }
    function copyTemplates() {
        console.log('Copying templates folder');
        ncp(path.join(__dirname, 'src', 'templates'), path.join(gitPath, 'src', 'templates'), function (err) {
            if (err) {
                console.log(`Failed to copy templates folder with error: ${err}`);
            } else {
                copyMainFile();
            }
        });
    }
    function copyMainFile() {
        console.log('Copying server.ts, tsconfig.json');
        fs.copyFileSync(path.join(__dirname, 'server.ts'), path.join(gitPath, 'server.ts'));
        fs.copyFileSync(path.join(__dirname, 'tsconfig.json'), path.join(gitPath, 'tsconfig.json'));
        fs.copyFileSync(path.join(__dirname, 'prod-ignore'), path.join(gitPath, '.gitignore'));
        copyDBFolder();
    }
    function copyDBFolder() {
        console.log('Copying db folder');
        ncp(path.join(__dirname, 'db'), path.join(gitPath, 'db'), function (err) {
            if (err) {
                console.log(`Failed to copy db folder with error: ${err}`);
            } else {
                createPackageJson();
            }
        });
    }
    function createPackageJson() {
        console.log('Creating package.json');
        let packageJson = require('./package.json');
        packageJson.scripts = {
            start: 'ts-node server.ts'
        };
        packageJson.deployInfo = deployInfo;
        delete packageJson.nodemonConfig;
        delete packageJson.devDependencies;
        fs.writeFileSync(path.join(gitPath, 'package.json'), JSON.stringify(packageJson, null, 4));
        if (deployMode) {
            startDeploy();
        }
    }
}

function startDeploy() {
    gitAdd();
}

function gitAdd() {
    console.log('Adding files.');
    let cp = spawn('git', ['add', '-A'], execOption);
    cp.stdout.on('data', handleGitSpawnData);
    cp.stderr.on('data', handleGitSpawnData);
    cp.on('close', function (code) {
        if (code == 0) {
            gitCommit();
        } else {
            console.log(`git add failed with exit code: ${code}`);
        }
    });
}

function gitCommit() {
    console.log(`Commiting changes: ${deployInfo}`);
    let cp = spawn('git', ['commit', '-m', deployInfo], execOption);
    cp.stdout.on('data', handleGitSpawnData);
    cp.stderr.on('data', handleGitSpawnData);
    cp.on('close', function (code) {
        if (code == 0) {
            gitPush();
        } else {
            console.log(`git commit failed with exit code: ${code}`);
        }
    });
}

function gitPush() {
    console.log(`Pushing the content.`);
    let cp = spawn('git', ['push', 'origin', 'master', '--progress'], execOption);
    cp.stdout.on('data', handleGitSpawnData);
    cp.stderr.on('data', handleGitSpawnData);
    cp.on('close', function (code) {
        if (code == 0) {
            console.log('Done');
        } else {
            console.log(`git push failed with exit code: ${code}`);
        }
    });
}