const fs = require('fs');
const path = require('path');
const https = require('https');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function listJsonFiles(callback) {
    fs.readdir('.', (err, files) => {
        if (err) throw err;

        const jsonFiles = files.filter(file => file.endsWith('.json'));
        const fileData = jsonFiles.map(file => {
            const ext = path.extname(file);
            const prefix = path.basename(file, ext);
            return { prefix, ext };
        });

        callback(fileData);
    });
}

async function downloadImages(file_prefix, file_ext) {
    const jsonFile = file_prefix + file_ext;

    console.log('file.prefix = ', file_prefix + ' file.ext = ', file_ext);
    const dirName = file_prefix + '/';
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
    }

    fs.readFile(jsonFile, async (err, data) => {
        if (err) throw err;

        const json = JSON.parse(data);
        for (const item of json) {
            for (const image of item.images) {
                const imageUrl = image.url;
                const fileName = dirName + image.startdate + '.jpg';
                const filePath = path.join(__dirname, fileName);

                if (fs.existsSync(filePath)) {
                    console.log(`Skipping download of ${fileName} - file already exists`);
                    continue;
                }

                https.get('https://www.bing.com' + imageUrl, (res) => {
                    res.pipe(fs.createWriteStream(fileName));
                });

                await sleep(200);
            };
        };
    });
}

listJsonFiles(fileData => {
    for (const file of fileData) {
        console.log(`AAA file.prefix = ${file.prefix}, file.ext = ${file.ext}`);
        downloadImages(file.prefix, file.ext);
    }
});