    const express = require("express");
    const bodyParser = require("body-parser");

    const loginManager = require(__dirname + "/loginManager.js");
    const vehicleDBmanager = require(__dirname + "/vehicleDBmanager.js");
    const facultiesDBmanager = require(__dirname + "/facultiesDBmanager.js");
    const studentsDBmanager = require(__dirname + "/studentsDBmanager.js");
    const visitorsDBmanager = require(__dirname + "/visitorsDBmanager.js");

    const app = express();

    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));

    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/index.html");
    });
    app.get("/login", function(req, res) {
        res.render("login", { error: false });
    });

    app.post("/login", function(req, res) {
        let error = false;
        loginManager.verifier(req.body.userID, req.body.userPassword)
            .then(function(resul) {
                if (resul === 1) {
                    res.redirect("/faculties");
                } else {
                    errorC = true;
                    res.render("login", { error: errorC });
                }
            });
    });

    app.get("/userHome", function(req, res) {
        vehicleDBmanager.fetchAll().then(function(resul) {
            //console.log(resul);
            res.render("allCarView", { vehicleList: resul });
        });

    });

    app.post("/userHome", function(req, res) {
        let vehNo = req.body.vehNo;
        let vehMod = req.body.vehMod;
        let vehOwn = req.body.vehOwn;
        let vehOrig = req.body.vehOrig;

        vehicleDBmanager.adder(vehNo, vehMod, vehOwn, vehOrig);

        res.redirect("/userHome");
    });


    app.get("/faculties", function(req, res) {
        reqFacult = {};
        res.render("faculties.ejs", { faculty: reqFacult });
    });

    app.post("/faculties", function(req, res) {

        if (Object.keys(req.body)[0] == "idSearch") {

            if (req.body.idSearch === "a:") {
                facultiesDBmanager.fetchAll()
                    .then(function(facList) {
                        res.render("allFacultiesView.ejs", { faculties: facList });
                    });

            } else {

                facultiesDBmanager.fetchOne(req.body.idSearch)
                    .then(function(reqFacult) {
                        res.render("faculties.ejs", { faculty: reqFacult });

                        console.log(reqFacult);
                    });
            }

        } else if (Object.keys(req.body)[0] == "delBut") {
            facultiesDBmanager.deleter(req.body.delBut)
                .then(function(deletedFac) {

                    res.render("faculties.ejs", { faculty: {} });

                });

        } else if (Object.keys(req.body)[0] == "chngStat") {

            facultiesDBmanager.updateStat(req.body.chngStat)
                .then(function() {
                    facultiesDBmanager.fetchOne(req.body.chngStat)
                        .then(function(reqFacult) {
                            console.log("Point 2");
                            res.redirect("/faculties");

                        });
                });


        } else if (Object.keys(req.body)[6] == "addFacBut") {
            console.log("adder being called");

            let fID = req.body.fID;
            let fName = req.body.fName;
            let fDep = req.body.fDep;
            let fDOB = req.body.fDOB;
            let fStat = "I";

            if (req.body.vehNo != 'na') {
                let fVehicle = { no: req.body.vehNo, modl: req.body.vehMod, own: fName };
                facultiesDBmanager.adder(fID, fDep, fName, fDOB, fStat, fVehicle);

            } else {
                let fVehicle = { no: "" };
                facultiesDBmanager.adder(fID, fDep, fName, fDOB, fStat, fVehicle);

            }




            //console.log(req.body);
        }



    });


    app.get("/students", function(req, res) {
        reqStud = {};
        res.render("students.ejs", { student: reqStud });
    });


    app.post("/students", function(req, res) {
        console.log(req.body);

        if (Object.keys(req.body)[0] == "idSearch") {
            if (req.body.idSearch === "a:") {
                studentsDBmanager.fetchAll()
                    .then(function(stuList) {
                        res.render("allStudentsView.ejs", { students: stuList });
                    });

            } else {

                studentsDBmanager.fetchOne(req.body.idSearch)
                    .then(function(reqStud) {
                        res.render("students.ejs", { student: reqStud });

                        console.log(reqStud);
                    });
            }

        } else if (Object.keys(req.body)[0] == "delBut") {
            studentsDBmanager.deleter(req.body.delBut)
                .then(function(deletedStud) {

                    res.render("students.ejs", { faculty: {} });

                });

        } else if (Object.keys(req.body)[0] == "chngStat") {
            studentsDBmanager.updateStat(req.body.chngStat)
                .then(function() {
                    studentsDBmanager.fetchOne(req.body.chngStat)
                        .then(function(reqStud) {
                            res.redirect("/students");

                        });
                });


        } else if (Object.keys(req.body)[6] == "addStudBut") {
            console.log("adder being called");

            let sID = req.body.sID;
            let sName = req.body.sName;
            let sBatch = req.body.sBatch;
            let sDOB = req.body.sDOB;
            let sStat = "I";

            if (req.body.vehNo != 'na') {
                let sVehicle = { no: req.body.vehNo, modl: req.body.vehMod, own: sName };
                studentsDBmanager.adder(sID, sBatch, sName, sDOB, sStat, sVehicle);

            } else {
                let sVehicle = { no: "" };
                studentsDBmanager.adder(sID, sBatch, sName, sDOB, sStat, sVehicle);

            }




            //console.log(req.body);
        }



    });








    app.get("/visitors", function(req, res) {
        visitorsDBmanager.fetchInCampus().then(function(reqVis) {
            res.render("visitorsList.ejs", { visitors: reqVis });
            console.log(reqVis);
        }).catch(function(err) {
            console.log(err);
        });
    });


    app.post("/visitors", function(req, res) {
        console.log(req.body);

        if (Object.keys(req.body)[0] == "idSearch") {
            if (req.body.idSearch === "a:") {
                visitorsDBmanager.fetchAll()
                    .then(function(visList) {
                        res.render("allVisitorsView.ejs", { visitors: visList });
                    });

            } else {
                visitorsDBmanager.fetchOne(req.body.idSearch)
                    .then(function(reqVis) {
                        res.render("visitors.ejs", { visitor: reqVis });

                        console.log(reqVis);
                    });
            }

        } else if (Object.keys(req.body)[0] == "delBut") {
            visitorsDBmanager.deleter(req.body.delBut)
                .then(function(deletedVis) {

                    res.redirect("/visitors");

                });

        } else if (Object.keys(req.body)[0] == "chngStat") {
            visitorsDBmanager.updateStat(req.body.chngStat)
                .then(function() {

                    res.redirect("/visitors");

                });



        } else if (Object.keys(req.body)[6] == "addStudBut") {
            console.log("adder being called");

            let vID = req.body.vID;
            let vName = req.body.vName;
            let vReason = req.body.vReason;
            let vOrigin = req.body.vOrigin;


            if (req.body.vehNo != 'na') {
                let vVehicle = { no: req.body.vehNo, modl: req.body.vehMod, own: vName };
                visitorsDBmanager.adder(vID, vReason, vName, vOrigin, vVehicle)
                    .then(function() {
                        res.redirect("/visitors");
                    });

            } else {
                let vVehicle = { no: "" };
                visitorsDBmanager.adder(vID, vReason, vName, vOrigin, vVehicle)
                    .then(function() {
                        res.redirect("/visitors");
                    });

            }
        }



    });









    app.post("/login", function(req, res) {
        //console.log("lol" + addInDatabase(req.body.userID, parseInt(req.body.userPassword)));
        res.send("Doso");
    });






    app.listen(process.env.PORT || 3000, function() {
        console.log("server is running on port 3000");
    })