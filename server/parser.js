function parseUIFile(path, filename, outpath) {
    const { XMLParser } = require("fast-xml-parser");
    const fs = require("fs");

    const options = { ignoreAttributes: false };

    try {
        const xmlDataStr = fs.readFileSync(path, "utf8");

        const parser = new XMLParser(options);
        let jsonObj = parser.parse(xmlDataStr);

        fs.writeFileSync(`${outpath}/${filename}.json`, JSON.stringify(jsonObj));
    } catch (err) {
        console.error(err);
    }
}

module.exports = { parseUIFile }