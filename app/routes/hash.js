var crypto = require('crypto');

module.exports = {
    getHash: function(text){
        var shasum = crypto.createHash('sha1');
        shasum.update(text);
        var output = shasum.digest('hex');
    
        return output
    }
}


