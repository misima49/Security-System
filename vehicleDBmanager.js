    const mongoose = require('mongoose');

    exports.adder = adder;
    exports.fetchAll = fetchAll;

    mongoose.connect('mongodb://localhost/DbmsPro', { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {

        console.log("Connected successfully!!");
    });

    console.log("Point 1");

    const vehicleSchema = new mongoose.Schema({
        _id: {
            type: String,
            required: [true, "Enter the vehilcle no."]
        },

        model: {
            type: String,
            required: [true, "Missing password"]
        },

        onwer: {
            type: String,
            required: [true, "Missing onwer "]
        },

        origin: {
            type: String,
            enum: ["S", "F", "V"],
            required: true,

        }

    });

    const vehicle = mongoose.model("vehicle", vehicleSchema);

    exports.vehicle = vehicle;
    exports.vehicleSchema = vehicleSchema;

    async function adder(vehNo, modl, own, orig) {

        const vehicleDoc = new vehicle({
            _id: vehNo,
            model: modl,
            onwer: own,
            origin: orig
        });

        await vehicleDoc.save();
        console.log("Record added");

    }

    async function fetchAll() {
        let allVehicles = await vehicle.find()
        return allVehicles;
    }

    //adder("UP65DF5070", "TVS", "Kartikey", "S");