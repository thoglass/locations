const express = require('express');
const fs = require('fs');
const router = express.Router();

// for file upload
const multer = require('multer');
const csv = require('fast-csv');

const upload = multer({dest: 'tmp/file/'});

// import db
const db = require('./database/db');

/* POST a location via file.
  Accepted format: filename = location-name
                   content = csv
                   format = lat, lng, information
                   example: filename: PiloteersBerlin
                            content: 52.502931, 13.408249, office in Berlin

*/
router.post('/', upload.single('file'), function(req, res, next) {
  if(!req.file){
    res.status(400).send("No file found");
    return;
  }
  
  // getting filename without type-ending
  const locationName = req.file.originalname.split(".")[0];
  const locations = [];
  csv.parseFile(req.file.path)
    .on("data", (data)  => {
      //pushing file rows into array; results in array (rows) of arrays (csv)
      locations.push(data);
    })
    .on("end", () => {
      fs.unlinkSync(req.file.path); 
      // TO DO: delete saved files in tmp
      const location = locations[0];

      // error if more than one location or more values than expected
      if(locations.length > 1 || location.length > 3) {
        res.status(400).send("Make sure to only send one location at a time");
        return;
      };
      // parse strings into floats
      const lat = parseFloat(location[0]);
      const lng = parseFloat(location[1]);
      // getting rid of whitespaced
      const info = location[2].trim();

      // error if not the right format
      if(typeof lat != 'number' || typeof lng != 'number' || typeof info != 'string'){
        res.status(400).send("Make sure to send your location in the format lat, lng, extra information")
        return;
      };

      const locationjson = {name: locationName, lat, lng, info};
      // TO DO: save to DB
      console.log(locationjson)
      

      db.insert(locationjson)

      console.log(db().stringify());

      res.status(200).send("location saved successfully");
      return;
      


    })
});

module.exports = router;
