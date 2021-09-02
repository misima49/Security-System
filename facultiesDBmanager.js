    const mongoose = require('mongoose');
    const vehicleDBmanager = require(__dirname + "/vehicleDBmanager.js");

    exports.adder = adder;
    exports.fetchAll = fetchAll;
    exports.fetchOne = fetchOne;
    exports.deleter = deleter;
    exports.updateStat = updateStat;

    mongoose.connect(process.env.mongoAtlas || 'mongodb://localhost/DbmsPro', { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Connected successfully!!");
    });

    //console.log("Point 1");

    const vehicleSchema = vehicleDBmanager.vehicleSchema; //new mongoose.Schema({
    //     _id: {
    //         type: String,
    //         required: [true, "Enter the vehilcle no."]
    //     },

    //     model: {
    //         type: String,
    //         required: [true, "Missing password"]
    //     },

    //     onwer: {
    //         type: String,
    //         required: [true, "Missing onwer "]
    //     },

    //     origin: {
    //         type: String,
    //         enum: ["S", "F", "V"],
    //         required: true,

    //     }

    // });

    const facultySchema = new mongoose.Schema({
        _id: {
            type: String,
            required: [true, "Enter the faculty id no."]
        },

        dept: {
            type: String,
            required: [true, "Missing password"]
        },

        name: {
            type: String,
            required: [true, "Missing onwer "]
        },

        dob: {
            type: String,
            required: true,
        },

        currStatus: String,

        vehicleOwnd: vehicleSchema
    });


    const faculty = mongoose.model("faculty", facultySchema);
    const vehicle = vehicleDBmanager.vehicle; //mongoose.model("vehicle", vehicleSchema);





    async function adder(fId, fDept, fname, fDOB, fstatus, fVehicle) {
        const vehicleDoc = await new vehicle({
            _id: fVehicle.no,
            model: fVehicle.modl,
            onwer: fVehicle.own,
            origin: "F"
        })

        console.log(vehicleDoc);

        if (!vehicleDoc._id) {
            const facultyDoc = new faculty({
                _id: fId,
                dept: fDept,
                name: fname,
                dob: fDOB,
                currStatus: fstatus,
            });
            facultyDoc.save(function(err, resul) {
                if (err) console.log(err);
                console.log(resul);
            });
        } else {
            vehicleDoc.save();
            const facultyDoc = new faculty({
                _id: fId,
                dept: fDept,
                name: fname,
                dob: fDOB,
                currStatus: fstatus,
                vehicleOwnd: vehicleDoc
            });
            facultyDoc.save(function(err, resul) {
                if (err) console.log(err);
                console.log(resul);
            });
        }
    }
    async function deleter(fid) {
        faculty.findOne({ _id: fid })
            .then(function(fact) {
                console.log(fact.vehicleOwnd);
                if (fact.vehicleOwnd != undefined) {
                    vehicle.deleteOne({ _id: fact.vehicleOwnd._id })
                        .then(function(delVEh) {
                            console.log("deleting Veh" + delVEh);
                        });
                }
            })
            .then(function() {
                faculty.deleteOne({ _id: fid })
                    .then(function(deletedFac) {
                        return;

                    });
            });






        // if (deletedFac.hasOwnProperty("vehicleOwnd")) {
        //     vehicle.deleteOne({ _id: deletedFac.vehicleOwnd._id })
        //         .then(function(delVEh) {
        //             console.log("deleting Veh" + delVEh);
        //         });
        // }


    }

    async function updateStat(fid) {
        faculty.findOne({ _id: fid }, "currStatus -_id")
            .then(function(stat) {

                if (stat.currStatus === "I") {
                    faculty.updateOne({ _id: fid }, { currStatus: "O" })
                        .then(function(upFac) {
                            console.log(upFac);
                            return;
                        });

                } else {
                    faculty.updateOne({ _id: fid }, { currStatus: "I" })
                        .then(function(upFac) {
                            console.log(upFac);
                            return;
                        });
                }
            });

    }


    async function fetchOne(fid) {
        let reqFaculty = await faculty.findById(fid);
        return reqFaculty;
    }


    async function fetchAll() {
        let allFaculty = await faculty.find()
        return allFaculty;
    }

    //adder("c110031", "CSE", "Mayur", '1973-07-05', "I", { no: "", modl: "Tesla", own: "Sambit" });
    //updateStat("C560035");
    updateStat("C560045");