const https = require('https');
const fs = require('fs');

https.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1000&mkt=en-US', response => {
    let data = '';

    response.on('data', chunk => {
        data += chunk;
    });

    response.on('end', () => {
        const json = JSON.parse(data);
        const images = json.images;

        images.forEach(image => {
            const imageUrl = `https://www.bing.com${image.url}`;
            const startDate = image.startdate;
            const fileName = `${startDate}.jpg`;

            https.get(imageUrl, response => {
                response.pipe(fs.createWriteStream(fileName));
            });
        });
    });
});