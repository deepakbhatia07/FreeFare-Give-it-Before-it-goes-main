const mongoose = require("mongoose");

/**
 * User schema definition representing registered users,
 * their roles, locations, and ban statuses.
 */
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    contact:{
        type:String
    },
    address:{
        type:String
    },
location: {
  city: { type: String, default: "" },
  region: { type: String, default: "" },
  country: { type: String, default: "" },

  lat: { type: Number },
  lng: { type: Number },

  source: {
    type: String,
    enum: ["gps", "manual"],
    default: "gps",
  },
},

    isBanned:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
module.exports=mongoose.model("User",userSchema);