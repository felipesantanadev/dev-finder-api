module.exports = {
    stringToArray(stringToParse, separator){
        return  stringToParse.split(separator).map(tech => tech.trim());
    },
}