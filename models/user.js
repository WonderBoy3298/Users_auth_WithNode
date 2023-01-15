const mongoose = require("mongoose") ; 
const {isEmail} = require("validator");
const bcrypt = require("bcrypt")
const userShema = new mongoose.Schema({
    email : {
        type:String,
        required:[true,' Please Enter a valid Email '],
        unique:true,
        validate:[isEmail,' Please Enter a valide Email ']
    },
    password:{
        type:String,
        required:[true,'Please Enter a Password'],
        minlength:[6,'Minimun Password Lenght is 6 characters']
    }

})

userShema.pre('save',async function (next){
    
    this.password= await bcrypt.hash(this.password,10)
    next() ;
})

module.exports = mongoose.model('useq',userShema)