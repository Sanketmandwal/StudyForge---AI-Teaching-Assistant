import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : [true , "Please Provide a Username"],
    unique : true,
    trim : true,
    minlength : [3, "Username must be at least 3 Character"]
  },
  email :{
    type :String,
    required : [true , "Please Provide a Email"],
    unique : true,
    lowercase : true,
  },
  password :{
    type : String,
    required:true,
    minlength:6,
    select : false,
  },
  profileImage : {
    type : String,
    default : null
  },
},{
    timestamps:true
})


userSchema.pre('save',async function () {
    if(!this.isModified('password')){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model('User',userSchema)

export default User