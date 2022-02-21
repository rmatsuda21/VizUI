const {XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const fs = require('fs')

try {
	const xmlDataStr = fs.readFileSync('test.xml', 'utf8')
	console.log(xmlDataStr)

	const parser = new XMLParser()
	let jsonObj = parser.parse(xmlDataStr)
	console.log(jsonObj)

	const builder = new XMLBuilder()
	let xmlData = builder.build(jsonObj)
	console.log(xmlData)
} catch (err) {
	console.error(err)
}


