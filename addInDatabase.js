    const mysqlx = require('@mysql/xdevapi');


    module.exports = adder;
    let match = 0;

    myAsyncFunction("mrinal", 27);

    function adder(id, pass) {
        //point 1
        console.log(id + "  " + pass);

        let session;

        let config = {
            user: 'root',
            password: 'mrinal123',
            host: 'localhost',
            port: '33060'
        }

        //point 2

        mysqlx.getSession(config)
            .then(function(s) {
                session = s;
                console.log("session get");
                return session.getSchema("testbed");
            })
            .then(function() {
                session.sql("USE testbed;").execute(),
                    session.sql("SELECT * FROM student WHERE name = \"mrinal\";").execute(function(result) {
                        console.log(result);
                        match++;
                        return;
                    })
                    .then(function() {
                        console.log(match + "inside");
                        return match;
                    })
            });


        //point 3
        return "fuk u";


    }

    // point 4
    //     function verifier(name, pass) {
    //     var temp = adder(name, pass);
    //     console.log(temp + " welp");
    // }


    async function myAsyncFunction(name, pass) {
        const result = await adder(name, pass);

        console.log(match + " welp");
        console.log(result);
    }