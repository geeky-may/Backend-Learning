import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const UserSchema= new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },        
        fullname:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true,
            default:"https://res.cloudinary.com/dv9yqjzqj/image/upload/v1690143877/avatar/default-avatar_qxv1b4.png"
        },
        coverImage:{
            type:String,
            default:"https://res.cloudinary.com/dv9yqjzqj/image/upload/v1690143877/avatar/default-cover-image_eb8l1k.png"
        },
        password:{
            type:String,
            required:true,
        },
        watchHistory:[{
            type:mongoose.Schema.types.ObjectId,
            ref:"Video"
        }],
        refreshToken:{
            type:String,
        },
},
    {
        timestamps:true
    })

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }
    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }catch(err){
        next(err)
    }
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {id:this._id,email:this.email,
        username:this.username,fullname:this.fullname},
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {id:this._id},
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})}

UserSchema.methods.generateRefreshToken = function(){

}

export const User = mongoose.model("User",UserSchema)


