import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { Http, Headers } from '@angular/http';
import { Signup } from '../signup/signup';
import 'rxjs/add/operator/map';
import { ListPage } from '../list-page/list-page';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'login.html'
})
export class LoginPage {

// first
  user : User = {
    // function same ad value in html -> value=""
    username : "x",
    password : "111"
  }

//second
  url:string;
  headers:Headers;

  constructor(public navCtrl: NavController, public alertCtrl : AlertController, public http : Http, public localStorage : Storage) {
  //third
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-Id", "test1");
    this.headers.append("X-Parse-Rest-API-Key", "restAPIKey");
    //can put more to make more accurate
  }

  goToSignUp(){
    this.navCtrl.push(Signup);
  }

  login(){
    if(!(this.user.username&&this.user.password)){
      this.alertCtrl
      .create({
        title : "Error",
        message : "Check email and password. Please retry",
        buttons : [
          'OK'
        ]
      })
    }
      this.url = "https://ionicserver-syahmisadan.c9users.io/app1/login?username="+this.user.username+"&password="+this.user.password;
      this.http.get(this.url, {headers: this.headers})
        .subscribe(res => {
          console.log(res);
          // save to local storage
          this.localStorage.set('user',res.json().objectId).then(()=>{
            this.navCtrl.setRoot (ListPage);
          })
          //then use to excute the code
          
          //navigate to main page
          // this.navCtrl.push(); not recommend because once it 
          // more prefer to use setRoot because once it login, it cant turning back unless it logout

        },
        err => {
          console.log(err);
        }
      )
  }

}
