module.exports = {
	getID: function(cid, contentHash, signature, callback) {
	    const request = require('request');
	    var data = {
	        "$class": "org.thefact.io.PublishNotary",
	        "NotaryId": cid,
	        "notary": {
		  "$class": "org.thefact.io.Notary",
		  "owner": {
		      "$class": "org.thefact.io.Users",
		      "userWallet": 'dst'
		  },
		  "Content": contentHash,
		  "DigitalSignature": signature
	        }
	    }
	    var json = JSON.stringify(data);
      
	    var options = {
	        headers: {
		  'Content-Type': 'application/json',
		  'Accept': 'application/json'
	        },
	        json: JSON.parse(json),
	        url: 'http://localhost:5000/api/org.thefact.io.PublishNotary'
      
	    }
      
	    var ID = []
      
	    request.post(options,
	        function (err, response, body) {
		  var firstKey = Object.keys(body)[0];
	
		  if (firstKey === 'error') {
		      const msg = ((body || {}).error || {}).message;
		      console.log('failed to store in the blockchain; the same content might exist in the blockchain')
		      callback(ID)
      
		  } else {
		      console.log('succeeded in storing into the blockchain');
		      var transactionID = body['transactionId'];
		      ID.push(transactionID)
		      callback(ID)
		  }
      
	        }
	    );
	}
      }
      