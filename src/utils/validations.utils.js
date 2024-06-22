const {lettersAndNumbers} = require("./regex.utils");

const validateString = (inputString, regex)  => {

    const regexToTest = regex || lettersAndNumbers;

    return regexToTest.test(inputString);
}

module.exports = {validateString}