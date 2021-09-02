    const mongoose = require('mongoose');

    exports.verifier = verifier;

    mongoose.connect(process.env.mongoAtlas || 'mongodb://localhost/DbmsPro', { useNewUrlParser: true, useUnifiedTopology: true });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {

        console.log("Connected successfully!!");
    });

    console.log("Point 1");

    const userPasswordSchema = new mongoose.Schema({
        _id: {
            type: String,
            required: [true, "There are 2 rams so there can be 2 you"]
        },

        pass: {
            type: String,
            required: [true, "Missing password"]
        }
    });
    const userPassword = mongoose.model("userPassword", userPasswordSchema);

    let user1 = new userPassword({
        _id: "superUser",
        pass: "kick123"
    });

    //user1.save();


    async function verifier(uid, upass) {
        let rqUser = await userPassword.findOne({ _id: uid });
        if (rqUser.pass === upass) {
            return 1;
        } else {
            return -1;
        }

    }


    //     verifier("superUser", "kick123").then(function(kk) {
                //     console.log(kk);
                // });