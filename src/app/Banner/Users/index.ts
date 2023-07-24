import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';
@Component({
  standalone:true,
  imports: [CommonModule],
  selector: 'app-users',
  templateUrl:"./users.html",
  styleUrls: ['./users.css'],
})
export default class Users {
  backendURl = 'http://localhost:4201'
  Login={
    passwordMessage:"",
    emailMessage:"",
  }
  Signup={
    emailMessage:"",
    usernameMessage:"",
    passwordMessage:"",
  }
  signupMenu = false
  loginMenu = true
  socket:any = null
  Users: {PF:string,Email:string,Password:string,index:number}[] = [];
  User:{PF:string,Email:string,Password:string,Username:string} = {
    PF:"",
    Email:"",
    Password:"",
    Username:""
  }
  UsersLength = 0
  change_index(index:number){
    localStorage.setItem('ActiveUserIndex',String(index))
    window.location.reload()
  }
  ngOnInit(){
    this.socket = io(this.backendURl,{withCredentials: true,extraHeaders: { socket: '0' }})
    this.socket.on('users',(Users:any)=>{
      if(!localStorage.getItem('ActiveUserIndex'))
        localStorage.setItem('ActiveUserIndex','0')
      this.User = Users[Number(localStorage.getItem('ActiveUserIndex'))]
      this.Users = Users
      this.UsersLength = Users.length
      for(let index = 0;index<this.Users.length;index++)this.Users[index].index = index
      this.Users.splice(Number(localStorage.getItem('ActiveUserIndex')),1)
      var ActiveUserIndex = Number(localStorage.getItem('ActiveUserIndex'))
      console.info('ActiveUser',`Index ${localStorage.getItem('ActiveUserIndex')}`,this.User,'\n',
      'Users',this.Users
      )
      this.loginMenu = false
    })
  }
  sendRequest(url: any, body: any, callback: any){
    fetch(this.backendURl+'/'+url, {method: "POST",mode: "cors",credentials: "include",redirect: "follow",referrerPolicy: "no-referrer",headers: {"Content-Type": "application/json",},body: JSON.stringify(body||{}),}).then(response=>response.json()).then(response=>callback(response)).catch(error=>console.error(error))
  }
  login(){
    const loginEmail = document.querySelector('#loginEmail') as HTMLInputElement;
    const loginPassword = document.querySelector('#loginPassword') as HTMLInputElement;
    const loginRemember = document.querySelector('#loginRemember') as HTMLInputElement;
    this.sendRequest('login', {
      input:{
        Email: loginEmail?.value,
        Username: loginEmail?.value,
        Password: loginPassword?.value,
      },
      Remember: loginRemember.checked
    }, (response: any) => {
      if(response.success){
        if(this.UsersLength)
          localStorage.setItem('ActiveUserIndex',response.success.index)
        window.location.reload()
      }
      if(response.error){
        if(response.error.user)
          this.Login.emailMessage = 'cant find user'
        if(response.error.password){
          this.Login.passwordMessage = 'incorect password'
          loginPassword.value = ''
        }
        if(response.error.input){
          this.Login.emailMessage = 'invalid input'
          this.Login.passwordMessage = 'invalid input'
        }
        if(response.error.users){
          this.Login.emailMessage = 'already loged in'
          loginEmail.value = ''
          loginPassword.value = ''
        }
        if(response.error.locked)
          this.Login.passwordMessage = 'invalid password limit reached'
        setTimeout(()=>{
          this.Login.emailMessage = ''
          this.Login.passwordMessage = ''
        },5000)
      }
    })
  }
  logout(){
    this.sendRequest('logout',{index:Number(localStorage.getItem('ActiveUserIndex'))},(response:any)=>{
      if(response.success){
        localStorage.setItem('ActiveUserIndex',"0")
        window.location.reload()
      }
      else console.error(response.error)
    })
  }
  logoutAll(){
    this.sendRequest('logoutAll',null,(response:any)=>{
      if(response.success){
        localStorage.setItem('ActiveUserIndex',"0")
        window.location.reload()
      }
      else console.error(response.error)
    })
  }
  signup(){
    const signupUsername = document.querySelector('#signupUsername') as HTMLInputElement;
    const signupEmail = document.querySelector('#signupEmail') as HTMLInputElement;
    const signupPassword = document.querySelector('#signupPassword') as HTMLInputElement;
    this.sendRequest('signup',{
      Email:signupUsername?.value,
      Username:signupEmail?.value,
      Password:signupPassword?.value,
    },(response:any)=>{
      setTimeout(()=>{
        this.Signup.emailMessage = ''
        this.Signup.usernameMessage = ''
        this.Signup.passwordMessage = ''
      },5000)
    })
  }
  open_login(){
    this.loginMenu = true
    setTimeout(()=>document.querySelector(".user-menu")?.classList.remove('hidden'),1)
  }
  close_login(){
    this.loginMenu = false
    setTimeout(()=>document.querySelector(".user-menu")?.classList.remove('hidden'),1)
  }
  open_signup(){
    this.signupMenu = true
    setTimeout(()=>document.querySelector(".user-menu")?.classList.remove('hidden'),1)
  }
  close_signup(){
    this.signupMenu = false
    setTimeout(()=>document.querySelector(".user-menu")?.classList.remove('hidden'),1)
  }
}
