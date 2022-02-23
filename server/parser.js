const {XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser')
const fs = require('fs')

const options = {ignoreAttributes: false}

try
{
  const xmlDataStr = fs.readFileSync('form.ui', 'utf8')

  const parser = new XMLParser(options)
  let jsonObj = parser.parse(xmlDataStr)

  fs.writeFileSync('test.json', JSON.stringify(jsonObj))
}
catch (err)
{
  console.error(err)
}


