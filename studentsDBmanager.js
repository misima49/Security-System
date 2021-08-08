    const mongoose = require('mongoose');
    const vehicleDBmanager = require(__dirname + "/vehicleDBmanager.js");

    exports.adder = adder;
    exports.fetchAll = fetchAll;
    exports.fetchOne = fetchOne;
    exports.deleter = deleter;
    exports.updateStat = updateStat;

    mongoose.connect('mongodb://localhost/DbmsPro', { useNewUrlParser: true, useUnifiedTopology: true });

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

    const studentSchema = new mongoose.Schema({
        _id: {
            type: String,
            required: [true, "Enter the student id no."]
        },

        batch: {
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


    const student = mongoose.model("student", studentSchema);
    const vehicle = vehicleDBmanager.vehicle; //mongoose.model("vehicle", vehicleSchema);





    async function adder(sId, sBatch, sname, sDOB, sStatus, sVehicle) {
        const vehicleDoc = await new vehicle({
            _id: sVehicle.no,
            model: sVehicle.modl,
            onwer: sVehicle.own,
            origin: "S"
        })

        //console.log(vehicleDoc);

        if (!vehicleDoc._id) {

            const studentDoc = new student({
                _id: sId,
                batch: sBatch,
                name: sname,
                dob: sDOB,
                currStatus: sStatus,
            });
            studentDoc.save(function(err, resul) {
                if (err) console.log(err);
                console.log(resul);
            });

        } else {

            vehicleDoc.save();
            const studentDoc = new student({
                _id: sId,
                batch: sBatch,
                name: sname,
                dob: sDOB,
                currStatus: sStatus,
                vehicleOwnd: vehicleDoc
            });
            studentDoc.save(function(err, resul) {
                if (err) console.log(err);
                console.log(resul);
            });
        }
    }


    async function deleter(sid) {
        student.findOne({ _id: sid })
            .then(function(stud) {
                console.log(stud.vehicleOwnd);
                if (stud.vehicleOwnd != undefined) {
                    vehicle.deleteOne({ _id: stud.vehicleOwnd._id })
                        .then(function(delVEh) {
                            console.log("deleting Veh" + delVEh);
                        });
                }
            })
            .then(function() {
                student.deleteOne({ _id: sid })
                    .then(function(deletedStu) {
                        return;

                    });
            });
    }



    async function updateStat(sid) {
        student.findOne({ _id: sid }, "currStatus -_id")
            .then(function(stat) {

                if (stat.currStatus === "I") {
                    student.updateOne({ _id: sid }, { currStatus: "O" })
                        .then(function() {
                            console.log("Updated successfully");
                            return;
                        });

                } else {
                    student.updateOne({ _id: sid }, { currStatus: "I" })
                        .then(function() {
                            console.log("Updated successfully");
                            return;
                        });
                }
            });

    }


    async function fetchOne(sid) {
        let reqStud = await student.findById(sid);
        return reqStud;
    }


    async function fetchAll() {
        let allStud = await student.find()
        return allStud;
    }

    //adder("c110031", "CSE", "Mayur", '1973-07-05', "I", { no: "", modl: "Tesla", own: "Sambit" });
    //updateStat("C560035");