import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class Signup {

  user:User = {
    name:"",
    username:"",
    email:"",
    password:""
  };

  confirmPassword:string;
  url:string;
  headers:Headers;

  constructor(public navCtrl: NavController, public alertCtrl : AlertController, public http:Http) {
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-Id", "test1");
    this.headers.append("X-Parse-Rest-API-Key", "restAPIKey");
    // you can add as many as you want
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  goToLogin(){
    this.navCtrl.pop();
  }

  signup(){

    if(this.user.password!=this.confirmPassword){
      this.alertCtrl.create({
        title: "Error",
        message: "Password do not match. Please retry",
        buttons: ["OK"]
      }).present();
      return;
    }
    this.url = "https://ionicserver-syahmisadan.c9users.io/app1/Users"
    this.http.post(this.url, this.user, {headers : this.headers})
    // map is helper to translate json object
      .map(res => res.json())
      .subscribe(res => {
        //create json
        this.alertCtrl.create({
          //after success, message will appear
          title : "success",
          message : "Congratulation. Account has been created. Please login",
          buttons : [{
            text : 'Login', //label
            handler: ()=> {
              this.navCtrl.pop(); // go back to login 
            }
          }]
        })
        .present();
      },
        err => {
          this.alertCtrl.create({
            title : "Error",
            message : err.text(),
            buttons : [{
              text : 'OK'
            }]
          })
          .present();
      })
   }

}
