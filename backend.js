const Origin = 'http://localhost:4200'
const eml = require('express-mongo-login')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/testerki')
const users = new mongoose.model("users",new mongoose.Schema({
  Username:String,
  Email:String,
  Password:String,
  PF:String
}))
const CookieSecret = '12345678'
const Login = eml(users,{
  maxDevices:1,
  maxUsers:null,
  authTimeout:1000*60*10*3,
  authenticationMode:"lose",
  cookieName:"users",
  findWith:"Username,Email",
  authWith:"Password",
  secret:CookieSecret,
  cookie:{},
  Session:{
    secret:CookieSecret,
    cookie:{},
  },
})
const Signup = new eml.tools.signup(users,{
  findWith:"Username,Email",
  timeout:1000*60*3,
  keyLength:8,
  characters:"0123456789"
})
const express = require('express')
const cors = require('cors');
const app = express().use(cors({ credentials: true, origin:Origin })).use(express.json()).use(Login)
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server,{cors:{
  origin:[Origin],
  methods: ["GET", "POST"],
  allowedHeaders:["socket"],
  credentials:true
}})
io.use(Login.io())
app.post("/signup/generate",async(req,res)=>{
      const {Email,Username,Password} = req.body
      if(typeof Email!="string"||typeof Username !="string"||typeof Password !="string")
        return res.json({error:{santax:true}})
      const generated = await Signup.generateKey({Email,Username,Password})
      if(generated.error)
        return res.json(generated)
      const Key = generated.success
      res.json({success:true})
})
app.post("/signup/confirm",async(req,res)=>{
  const {Email,Key} = req.body
  if(typeof Email!="string"||typeof Key !="string")
    return res.json({error:{santax:true}})
  const response = Signup.confirmKey(Email,Key)
  if(response.error)return res.json({error:response.error})
  await database.Users.create({...response.success})
  res.json({success:true})
}) 
app.post('/login',async(req,res,next)=>res.json(await res.mongo.users.login(req.body.input,{remember:req.body.Remember})))
app.post('/logout',async(req,res,next)=>res.json(await res.mongo.users.logout(req.body.index)))
app.post('/logoutAll',async(req,res,next)=>res.json(await res.mongo.users.logoutAll()))
io.on('connection', async(socket) => {
  const auth = await socket.request.mongo.users.authenticate()
  if(auth.success){
    const users = []
    for(let user of auth.success)
      users.push({
        Email:user.Email,
        Username:user.Username,
        PF:user.PF
      })
    socket.emit('users',users)
  }
  socket.on('disconnect',()=> {

  })
})
server.listen(4201)
