import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http'
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

/*
  Generated class for the ListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-page',
  templateUrl: 'list-page.html'
})
export class ListPage {

  headers : Headers;
  url:string;
  friends:any[]; //dataype in typescript that can store any type of infomation in variable
  // friend is variavle 
  userId:string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http:Http, public localStorage:Storage) {
    //dont forget to initialize header
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-Id", "test1");
    this.headers.append("X-Parse-Rest-API-Key", "restAPIKey");
    this.localStorage.get('user').then((value)=>{
      this.userId = value;
      this.getFriend(null);// load function when open the page
    })
  }

  showAddDialog(){
    this.alertCtrl.create({
      title : "Add Friend",
      message : "Enter The Information Of New Friend",
      //input use to insert data , in array
      inputs : [{
        name : "name",
        placeholder : "Please Insert Name"
      },
      {
        name : "email",
        placeholder : "Please Insert Email"
      },
      {
        name : "number",
        placeholder : "Please Insert Number"
      }], 
      buttons : [{
        //one for cancel
        text: "Cancel"
      },
      {
        //one for save
        text : "Save",
        handler:data =>{
          //handle the error
          //first define URL
          this.url="https://ionicserver-syahmisadan.c9users.io/app1/classes/friendslist";
          this.http.post(this.url, { owner: this.userId, name: data.name, email: data.email, number: data.number, image:"http//:lorempixel.com/32/32"}, {headers:this.headers})
          .map(res => res.json())
          .subscribe(res => {
            // console.log(res);
            this.alertCtrl.create({
              title:"Success",
              message:"Data Saved!",
              buttons : [{
                text : 'OK',
                handler :()=>{
                  //bring controller
                  this.getFriend(null);
                  //auto refresh after save data
                }
              }]
            }).present();
          },
            err => {
              //console.log(err);
              this.alertCtrl.create({
                title : "Error",
                message : err.text(),
                buttons :[{
                  text : 'OK'
                }]
              }).present();
          })
        }
      }]
    }).present();
  }

  getFriend(refresher){
    this.url='https://ionicserver-syahmisadan.c9users.io/app1/classes/friendslist?where={"owner":"' +this.userId+ '"}';
    this.http.get(this.url,{headers:this.headers})
    .map(res => res.json())
    .subscribe(res => {
      console.log(res);
      this.friends = res.results;
        if(refresher!=null)
        refresher.complete();
      //friends will contain all data in server parse
    },
    err =>{
      this.alertCtrl.create({
        title:"Error",
        message:err.text(),
        buttons:[{
          text:'OK'
        }]
      }).present();
    })
  }

  editFriend(friend){
    this.alertCtrl.create({
      title:"Edit Friend",
      message:"Edit the information",
      inputs : [{
        name : "name",
        placeholder : "Please Insert Name",
        value : friend.name
      },
      {
        name : "email",
        placeholder : "Please Insert Email",
        value : friend.email
      },
      {
        name : "number",
        placeholder : "Please Insert Number",
        value : friend.number
      }],
      buttons : [{
        text : "Cancel"
      },
      {
        text : "Save",
        handler :data => {
          this.url="https://ionicserver-syahmisadan.c9users.io/app1/classes/friendslist/"+friend.objectId;
          this.http.put(this.url, {name:data.name, email:data.email, number:data.number}, {headers:this.headers})
          .map(res => res.json())
          .subscribe(res => {
            this.alertCtrl.create({
              title:"Data Updated",
              message:"Data Update Succeffully",
              buttons : [{
                text : "OK",
                handler :()=>{
                  this.getFriend(null);
                }
              }]
            }).present();
          },
          err =>{
            this.alertCtrl.create({
              title : "Error",
              message : err.text(),
              buttons:[{
                text : "OK"
              }]
            }).present();
          })
        }
      }]
    }).present()
  }

  deleteFriend(friend){
    this.alertCtrl.create({
      title : "Delete friend",
      message : "Are you sure?",
      buttons : [{
        text : "No"
      },
      {
        //if yes
        text : "Yes",
        handler : () => {
          this.url="https://ionicserver-syahmisadan.c9users.io/app1/classes/friendslist/"+friend.objectId;
          this.http.delete(this.url,{headers:this.headers})
          .map(res=>res.json())
          .subscribe(res=>{
            this.alertCtrl.create({
              title : "Delete Data",
              message : "Data Deleted Successfully",
              buttons : [{
                text : "Ok",
                handler :()=>{
                  this.getFriend(null);
                }
              }]
            }).present();
          },
          err=>{
            this.alertCtrl.create({
              title : "Error",
              message : err.text(),
              buttons : [{
                text : 'OK'
              }]
            }).present();
          })  
        }
      }]
    }).present();
  }

  logout(){
    this.alertCtrl.create({
      title : "Logout",
      message : "Logout from system?",
      buttons : [{
        text : "No"
      },{
        text : "Yes",
        handler : ()=> {
          this.localStorage.remove('user')
          .then(() => {
            this.navCtrl.setRoot(LoginPage);
          });
        }
      }]
    }).present();
  }

}
