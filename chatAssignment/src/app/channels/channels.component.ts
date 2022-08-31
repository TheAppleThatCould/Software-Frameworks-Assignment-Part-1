import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

const BACKEND_URL = "http://localhost:3000";

interface ChannelData {
  channelID: string;
  name: string;
  groupID: string;
  userID: string[];
}


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  adminAccess = 4;

  groupID: string = "";
  channelArray = [{channelID: "", name: "", groupID: "", userID: [""]}];

  createChannelDisplay: boolean = false;
  channelData: ChannelData = {channelID: "", name: "", groupID: "", userID: [""]};

  userID = "";

  adddUserToChannelDisplay: boolean = false;
  adddUserToGroupDisplay: boolean = false;
  addUserData = {channelName: "", userName: ""};

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.groupID =  this.route.snapshot.params['id'];
    this.userID = localStorage.getItem("userID") || "";

    // get the current user access permission and parse it as a string to adminAccess variable
    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;

    // If the user has super role, display all the groups
    if(this.adminAccess <= 2){
      this.getChannelsByGroupID(this.groupID);
    }else{
      this.getChannels(this.groupID, this.userID)
    }
  }

  clearDisplays(){
    this.createChannelDisplay = false;
    this.adddUserToChannelDisplay = false;
    this.adddUserToGroupDisplay = false;
  }


  getChannelsByGroupID(groupID: string){
    this.httpClient.post(BACKEND_URL + "/getChannelsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelArray = data;

    })
  }

  getChannels(groupID: string, userID: string){
    this.httpClient.post(BACKEND_URL + "/getChannelsByUserID", {groupID, userID}, httpOptions).subscribe((data: any) =>{
      this.channelArray = data;

    })
  }

  createChannel(){
    // A function that will create a channel with access permission to all users apart of the same group.
    let groupID = this.groupID;
    this.httpClient.post(BACKEND_URL + "/getGroupsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelData.groupID = this.groupID;
      this.channelData.userID = data.userID;
      this.httpClient.post(BACKEND_URL + "/createChannel", this.channelData, httpOptions).subscribe((data: any) =>{})
    })
  }

  getUserAndChannelID(){
    //A function that will get the user and channel id and calls the addUserChannel function.
    let userName = this.addUserData.userName
    let channelName = this.addUserData.channelName

    this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions).subscribe((data: any) =>{
      if(data[0] != undefined){
        let userID = data[0].userID;

        this.httpClient.post(BACKEND_URL + "/getChannelByChannelName", {channelName}, httpOptions).subscribe((data: any) =>{
          let channelID = data.channelID;

          this.addUserToChannel(userID, channelID)
        })
      }
    })


  }

  addUserToChannel(userID: string, channelID: string){
    this.httpClient.post(BACKEND_URL + "/addUserToChannel", {userID, channelID}, httpOptions).subscribe((data: any) =>{})
  }


  addUserToGroup(){
    //addUserToGroup
    let groupID = this.groupID
    let userName = this.addUserData.userName;

    this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions).subscribe((data: any) =>{
      if(data[0] != undefined){
        let userID = data[0].userID;
        this.httpClient.post(BACKEND_URL + '/addUserToGroup', {userID, groupID}, httpOptions).subscribe((data: any) =>{})
      }
    })
  }

  removeUserFromGroup(){
    let groupID = this.groupID
    let userName = this.addUserData.userName;

    this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions).subscribe((data: any) =>{
      if(data[0] != undefined){
        let userID = data[0].userID;
        this.httpClient.post(BACKEND_URL + "/removeUserFromGroup", {userID, groupID}, httpOptions).subscribe((data: any) =>{})
      }
    })
  }

  removeUserFromChannel(){
    let userName = this.addUserData.userName
    let channelName = this.addUserData.channelName

    this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions).subscribe((data: any) =>{
      if(data[0] != undefined){
        let userID = data[0].userID;

        this.httpClient.post(BACKEND_URL + "/getChannelByChannelName", {channelName}, httpOptions).subscribe((data: any) =>{
          let channelID = data.channelID;

          this.httpClient.post(BACKEND_URL + "/removeUserFromChannel", {userID, channelID}, httpOptions).subscribe((data: any) =>{})
        })
      }
    })
  }

  deleteChannel(channelID: string){
    this.httpClient.post(BACKEND_URL + "/deleteChannel", {channelID}, httpOptions).subscribe((data: any) =>{})

  }

  // getAllChannels(){
  //   this.httpClient.get(BACKEND_URL + "/getChannel", httpOptions).subscribe((data: any) =>{
  //     console.log(data)
  //     this.channelArray = data.channels;
  //   })

  // }
}
