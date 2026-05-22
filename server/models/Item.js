const mongoose=require('mongoose');
const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:String,
    category:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['free','paid'],
        default:'free'
    },
    price:{
        type:String,
        default:"0"
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    location: {
        city: { type: String, default: "" },
        region: { type: String, default: "" },
        country: { type: String, default: "" },
    },

    images:[String],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    taken:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
module.exports=mongoose.model('Item',itemSchema);