const mongoose = require("mongoose");
mongoose.connect("mongo_url")
.then(() => console.log("DB Connected"))
.catch(e => console.log(`Error occured ${e}`));

const UserSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : [true, "User name is required"],
        trim : true,
        unique : true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    firstName : {
        type : String,
        required :  [true, "First name is Required"],
        trim : true,
        minLength : [2, "First name must be atleast 2 characters long"],
        maxLength : [20, "First name cannot exceed 20 characters"]
    },
    lastName : {
        type : String,
        required :  [true, "Last name is Required"],
        trim : true,
        minLength : [2, "Last name must be atleast 2 characters long"],
        maxLength : [20, "Last name cannot exceed 20 characters"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        trim : true,
    }
});


const User = mongoose.model('Users', UserSchema);
module.exports = {
    User
};

