
const express = require("express")
const { default: mongoose } = require("mongoose")
const users = require("./models/user")
const app= express()
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const auth = require("./auth/auth")
const cle = require("./auth/cle")
PORT=3030

var bodyParser = require('body-parser')
const user = require("./models/user")
app.use(bodyParser.json())

const handleError = (err)=>{
    if(err.code===11000){
        error="l'Email existe deja essayer de se connecter avec un autre"
        return error
    }
}


uri = "mongodb+srv://WonderBoy:HAMza2001@cluster0.pr3hal0.mongodb.net/?retryWrites=true&w=majority"

app.get("",(req,res)=>{
    res.send("l application marche")
})
mongoose.set('strictQuery', true);
function connection(){
    mongoose.connect(uri).then(()=>{console.log("conection successful")})
    .catch((err)=>{
        console.log(err)
    })
}


connection()
//Voir les user 
app.get('/users',auth,async(req,res)=>{
    try{
        await users.find({}).then(result=>{
            res.json(result)
    
        })
    }catch(err){

        console.error(err)
    
    }
    
})
// Creation du User
app.post('/users',async(req,res)=>{
   
   try{ let user = new users({
        email : req.body.email,
        password:req.body.password
    })
    await user.save()
    res.send("creer avec succes ")
}catch(err){
    if(err.code===11000){
        res.json("l Email existe Deja")
    }
    res.json(err)
}

})
//se connccter
app.post('/login',async(req,res)=>{
    try{
        users.findOne({"email":req.body.email}).then(user=>{

            if(!user){
                res.json("l'utilisateur n'existe pas")
            }

            bcrypt.compare(req.body.password,user.password).then(isValid=>{
                if(isValid){
                    
                    const token = JWT.sign(
                        {userId:user.id},
                        cle,
                        {expiresIn:'24h'}
                        )
                        const message = "L'utilisatuer est connecter avec succes"
                    res.json({message,token})
                }
                else{
                    const message = "Le mot de passe est incorrecte"
                    res.json(message)
                }
            })
        }).catch((err)=>console.log("Lutilisateur n existe pas"))
    }catch(err){
        res.json("l utilisateur n existe pas")
    }
       

    
})



app.listen(PORT,()=>{console.log(`l application marche dans http://localhost:${PORT}`)})






