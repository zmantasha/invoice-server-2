const DataUrlParser = require("datauri/parser")

const path = require("path")

const getDataUri =(file)=>{
    const parser=new DataUrlParser();
    const extName = path.extname(file.originalname).toString()
    return parser.format(extName, file.buffer)

} 

module.exports = getDataUri