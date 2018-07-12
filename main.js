const tj = require('togeojson');
const fs = require('fs');
const path = require('path');
const resolve = require('path').resolve;

// node doesn't have xml parsing or a dom. use xmldom
const DOMParser = require('xmldom').DOMParser;
const gpxDir = resolve(__dirname, './files');

function convertGpxToGeojson(gpxFile) {

    const gpx = new DOMParser().parseFromString(fs.readFileSync(`${gpxDir}/${gpxFile}`, 'utf8'));

    const converted = tj.gpx(gpx);

    return converted;
}

fs.readdir(gpxDir, (err, items) => {
    console.log('\x1b[36m%s\x1b[0m', `Read ${items.length} gpx files`);  //cyan

    const featureCollection = {
        type: 'FeatureCollection',
        features: []
    }

    items.forEach(item => {
        if (item.endsWith('.gpx')) {
            const fc = convertGpxToGeojson(item);

            fc.features.forEach(f => {
                featureCollection.features.push(f);
            })

        }
    })

    fs.writeFile(
        'output.json',
        JSON.stringify(featureCollection),
        'utf8',
        () => {
            console.log('\x1b[36m%s\x1b[0m', 'Saved to output.json');  //cyan
        }
    );
});
