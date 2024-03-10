// This function removes non-ASCII characters from the strings
// to prevent errors when adding to the database.
// it also sets the string to 'unknown' if it is empty

const e = require("connect-flash");

function sanitizeString(string) {
    if (string) {
        return string.replace(/[^\x00-\x7F]/g, '');
    } else {
        string = 'unknown';
        return string
    }
}

exports.sanitizeString = sanitizeString;