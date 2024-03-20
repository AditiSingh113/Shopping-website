var mysql=require('mysql2');
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'first_project'
});
con.connect(function(error){
    if(error)throw error;
    console.log("connected");

    con.query('select * from login',(function(err,result){
        if(err)throw err;
        console.warn('All result here',result);
    }

    ));
});