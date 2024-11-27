const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
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

// Pre-Save Hook to implement bcrypt
// UserSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

UserSchema.methods.createHash = async function(plainTextPassword){
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
    // When need control over the salt ->
    //   const salt = await bcrypt.genSalt(saltRounds);
    //   return await bcrypt.hash(plainTextPassword, salt);
};

UserSchema.methods.validatePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
} 

const AccountSchema = new mongoose.Schema({
    userId : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
});


const User = mongoose.model('Users', UserSchema);
const Account = mongoose.model('Account', AccountSchema);
module.exports = {
    User,
    Account
};

