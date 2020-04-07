var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose')
// var Patients = mongoose.model('Patients')
var Patients = require('../models/Patients')
var upload = require('./upload')
var add = require('./add');
var hash = require('./hash')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', function(req, res, next){
  upload(req, res, (error) => {
    if (error){
      res.redirect('/?msg=203');
    }else {
      var doc = {
        name : req.body.name,
        birthDate : req.body.birthDate,
        infection : req.body.infection,
        date : req.body.date,
        travelRoute: req.body.travelRoute,
        note: req.body.note,
        tid: "",
        pid: "",
        cid: "",
        timestamp: ""
      };

      pid = doc.name.concat(" ", doc.birthDate, " ", doc.infection, " ", doc.date, " ", doc.travelRoute, " ", doc.note )
      doc.pid = hash.getHash(pid)
      cid = pid.concat.concat(" ", "oslab")
      doc.cid = hash.getHash(cid)
      
      // TODO : add timstamp, cid, pid ...
      (async () => {
        await add.getID(doc.cid, doc.pid, doc.name, doc.birthDate, doc.infection, doc.date, doc.travelRoute, doc.note, doc.note, function callback(txID){
          if (txID[0] == null){
            return res.redirect('/?msg=204');
          }else {
            doc.tid = txID[0];
            var patient = new Patients(doc);
            console.log("patient information : ", patient)
            patient.save(function(error) {
              if (error) {
                throw error;
              }
              return res.redirect('/?msg=201');
            });
          }
        })
      })();
    }
  });
});

module.exports = router;
