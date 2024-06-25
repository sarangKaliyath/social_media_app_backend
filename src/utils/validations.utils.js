const {lettersAndNumbers} = require("./regex.utils");

const validateString = (inputString, regex)  => {

    const regexToTest = regex || lettersAndNumbers;

    return regexToTest.test(inputString);
}

const isExpired = (givenTimeInSeconds) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return currentTimeInSeconds > givenTimeInSeconds
}

module.exports = {validateString, isExpired}