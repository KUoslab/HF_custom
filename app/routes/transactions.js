module.exports = {
	getTransaction: function (req, callback) {
	    var request = require('request')
	    var EventEmitter = require("events").EventEmitter;
	    var emitter = new EventEmitter()
      
	    var cid = req.params.cid;
	    var url = 'http://localhost:5000/api/org.thefact.io.PublishNotary/' + cid
      
	    var txList = []
	    try {
	        request(url, function (err, res, body) {
		  console.log('[FABRIC] In', body)
      
		  if (res.statusCode == 200) {
		      body = JSON.parse(body)
		      console.log('[FABRIC] Parse', body)
		      emitter.txID = body['transactionId']
		      emitter.txConfirmedTime = body['timestamp']
		      emitter.txContentHash = body.notary['Content']
		      emitter.txDigitalsignature = body.notary['DigitalSignature']
		      emitter.emit('updated')
		  } else {
		      emitter.txID = cid
		      emitter.txConfirmedTime = 'unknown'
		      emitter.txContentHash = 'unknown'
		      emitter.txDigitalsignature = 'unknown'
		      emitter.emit('updated')
		  }
	        })
      
	        emitter.on('updated', function () {
		  txList.push(emitter.txID, emitter.txConfirmedTime, emitter.txContentHash, emitter.txDigitalsignature)
		  callback(txList)
	        })
      
	    } catch (e) {
	        console.log('[HYPERLEDGER] COMPOSER N/A')
	        callback(null);
	    }
      
	}
      }