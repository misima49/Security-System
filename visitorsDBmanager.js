    const mongoose = require('mongoose');
    const vehicleDBmanager = require(__dirname + "/vehicleDBmanager.js");

    exports.adder = adder;
    exports.fetchAll = fetchAll;
    exports.fetchOne = fetchOne;
    exports.deleter = deleter;
    exports.updateStat = updateStat;
    exports.fetchInCampus = fetchInCampus;

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

    const visitorSchema = new mongoose.Schema({
        _id: {
            type: String,
            required: [true, "Enter the faculty id no."]
        },

        purpose: {
            type: String,
            required: [true, "Missing password"]
        },

        name: {
            type: String,
            required: [true, "Missing onwer "]
        },

        origin: {
            type: String,
            required: true,
        },

        entry: String,
        exit: String,

        vehicleOwnd: vehicleSchema
    });


    const visitor = mongoose.model("visitor", visitorSchema);
    const vehicle = vehicleDBmanager.vehicle; //mongoose.model("vehicle", vehicleSchema);





    async function adder(vId, vPosrpose, vname, vOrigin, vVehicle) {

        const vehicleDoc = await new vehicle({
            _id: vVehicle.no,
            model: vVehicle.modl,
            onwer: vVehicle.own,
            origin: "V"
        });

        console.log(vehicleDoc);

        if (!vehicleDoc._id) {
            const visitorDoc = new visitor({
                _id: vId,
                purpose: vPosrpose,
                name: vname,
                origin: vOrigin,
                entry: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false }),
                exit: "In Campus"
            });

            visitorDoc.save(function(err, resul) {
                if (err) console.log(err);
                console.log(resul);
            });

        } else {

            vehicleDoc.save();
            const visitorDoc = new visitor({
                _id: vId,
                purpose: vPosrpose,
                name: vname,
                origin: vOrigin,
                entry: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false }),
                exit: "In Campus",
                vehicleOwnd: vehicleDoc
            });
            visitorDoc.save(function(err, resul) {
                if (err) console.log(err);
                console.log(resul);
            });
        }
    }

    async function deleter(vid) {
        visitor.findOne({ _id: vid })
            .then(function(visit) {
                console.log(visit.vehicleOwnd);
                if (visit.vehicleOwnd != undefined) {
                    vehicle.deleteOne({ _id: visit.vehicleOwnd._id })
                        .then(function(delVEh) {
                            console.log("deleting Veh" + delVEh);
                        });
                }
            })
            .then(function() {
                visitor.deleteOne({ _id: vid })
                    .then(function(deletedVis) {
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

    async function updateStat(vid) {

        visitor.updateOne({ _id: vid }, { exit: new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false }) })
            .then(function(upVis) {
                console.log(upVis);
                return;
            });

    }


    async function fetchOne(vid) {
        let reqVisitor = await visitor.findOne({ _id: vid });
        return reqVisitor;
    }


    async function fetchAll() {
        let allVisitor = await visitor.find()
        return allVisitor;
    }

    async function fetchInCampus() {
        let reqVis = await visitor.find({ exit: "In Campus" });
        return reqVis;

    }

    //adder("v255", "visiting student", "Dimpul", "Kendrapara", { no: "" });
    //fetchInCampus();
    //     updateStat("v254");
    //     fetchOne("v255").then(function(req) {
    //     console.log(req);
    // });