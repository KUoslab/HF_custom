module.exports = {
	getID: function(cid, pid, name, birthDate, infection, date, travelRoute, note, callback) {
	    const request = require('request');
	    var data = {
	        "$class": "org.oslab.ac.kr.PublishCOVID",
	        "COVIDId": cid,
	        "covid": {
		  "$class": "org.oslab.ac.kr.COVID",
		  "patientId": {
		      "$class": "org.oslab.ac.kr.Patients",
		      "PatientId": pid
		  },
		  "name": name,
		  "birthDate": birthDate,
		  "infection": infection,
		  "date": date,
		  "travelRoute": travelRoute,
		  "note": note
	        }
	    }
	    var json = JSON.stringify(data);
      
	    var options = {
	        headers: {
		  'Content-Type': 'application/json',
		  'Accept': 'application/json'
	        },
	        json: JSON.parse(json),
	        url: 'http://localhost:5000/api/org.oslab.ac.kr.PublishCOVID'
	    }
      
	    var txID = []
      
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
		      txID.push(transactionID)
		      callback(txID)
		  }

	        }
	    );
	}
      }
      