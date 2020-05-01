var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose')
// var Patients = mongoose.model('Patients')
var Patients = require('../models/Patients')
var upload = require('./upload')
var add = require('./add');
var hash = require('./hash')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/', function (req, res, next){

  Patients.find({}, ["cid", "pid", "name", "birthDate", "infection", "date", "travelRoute", "note", "tid", "timestamp"], {sort: { _i: -1}}, function(err, patients){
    res.render('index', { title: 'CORONA', msg: req.query.msg, patientlist: patients})
  }).limit(5);
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

      pid = doc.name.concat(" ", doc.birthDate, " ", doc.infection, " ", doc.date, " ", doc.travelRoute, " ", doc.note );
      doc.pid = hash.getHash(pid);
      cid = pid.concat(" ", "oslab");
      doc.cid = hash.getHash(cid);
      
      // TODO : add timstamp, cid, pid ...
      (async () => {
        await add.getID(doc.cid, doc.pid, doc.name, doc.birthDate, doc.infection, doc.date, doc.travelRoute, doc.note, function callback(txID){
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

router.get('/namelist', function (req, res, next){
  Patients.aggregate().
    group({ _id: '$name'}).
    exec(function (err, result){
    if (err) return handleError(err);
    // console.log(result)
    res.end(JSON.stringify(result));
    
  });
});

router.get('/name', async(req, res, next)=> {
  try{
    // console.log('query name', req.query.name)
    const results = await Promise.all([
      Patients.find({ name: { $regex: ".*"+req.query.name + ".*"}}, {  _id: 1, cid:1, pid: 1, name: 1, birthDate: 1, infection: 1, date: 1, travelRoute: 1, note: 1, tid:1, timestamp: 1}).sort({ _id: -1})
    ]);
    if (results[0].length == 0){
      // console.log(results)
      res.render('index');
    } else {
      console.log(results)
      res.render('query', {
        patientlist: results[0],
      });
    }
  }catch (err){
    console.log(err);
    res.render('index'); 
  }

});

module.exports = router;
