const mongoose = require('mongoose');
const dotenv = require('dotenv'); // config environment variable
dotenv.config();

const user = process.env.NAME || "root";
const pass = process.env.PASSWORD || '';

mongoose.set('useCreateIndex', true);
mongoose.connect(`${"mongodb+srv://"+user+":"+pass+"@db-booking-k1njq.gcp.mongodb.net/test?retryWrites=true"}`,{ useNewUrlParser: true })
.then(
    (res) => {
     console.log("Connected to Database Successfully.")
    }
  ).catch(() => {
    console.log("Conntection to database failed.");
});
