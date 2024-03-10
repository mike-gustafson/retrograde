function sanitizeString(string) {
    if (string) {
        return string.replace(/[^\x00-\x7F]/g, '');
    } else {
        string = 'unknown';
        return string
    }
}

module.exports = sanitizeString;