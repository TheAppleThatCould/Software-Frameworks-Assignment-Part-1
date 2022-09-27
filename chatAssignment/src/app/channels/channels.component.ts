import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

interface GroupData {
  id: number;
  name: string;
  userID: string[];
  adminID: string;
  assistantID: string[];
}


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  adminAccess = 4;

  groupID: number = 0;
  // The channel array is the array that is getting displayed
  channelArray = [{channelID: "", name: "", groupID: "", userID: [""]}];

  createChannelDisplay: boolean = false;
  //The channelData be passed through an api to create new channel or update channels. When creating an channel the name is assign by the user.
  channelData: ChannelData = {channelID: "", name: "", groupID: "", userID: [""]};

  userID = "";

  adddUserToChannelDisplay: boolean = false;
  adddUserToGroupDisplay: boolean = false;
  addUserData = {channelName: "", userName: ""};

  message: string = '';

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.groupID =  this.route.snapshot.params['id'];
    this.userID = localStorage.getItem("userID") || "";


    // get the current user access permission and parse it as a string to adminAccess variable
    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;

    this.assignGroupPermission()
  }

  getChannelByUserID(){
    let userID = this.userID;
    let groupID = this.groupID;

    this.httpClient.post(BACKEND_URL + "/getChannelsByUserID", {userID, groupID}, httpOptions).subscribe((data: any) =>{
      if(data.length == 0){
        this.message = "You are not apart of any channel in this group"
      } 

      this.channelArray = data
    })

  }

  assignGroupPermission(){
    // a function that will check if the user is a groupadmin or groupassis of this group and grant corresponding permission
    let groupArray: GroupData = {id: 0, name: '', userID: [""], adminID: "", assistantID: [""]};
    let groupID = this.groupID;
    let isGroupAssis = false;
    let isGroupAdmin = false;

    this.httpClient.post(BACKEND_URL + "/getGroupsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      groupArray = data;

      groupArray.assistantID.map(assistantID =>{
        if(assistantID == this.userID){
          isGroupAssis = true;
        }
      })

      if(groupArray.adminID == this.userID){
        isGroupAdmin = true;
      }
      
      if(this.adminAccess > 1){
        if(isGroupAdmin){
          this.adminAccess = 2
        } else if(isGroupAssis){
          this.adminAccess = 3
        } else {
          this.adminAccess = 4
        }
      }

      // If the user has super role, or is the groupAdmin or groupAssistatnt then display all the channel
      // Get all the channel the user is apart of or get all the channel.
      if(this.adminAccess <= 3){
        this.getChannelsByGroupID(this.groupID);
      } else {
        this.getChannelByUserID();
      }

    })
  }

  clearDisplays(){
    this.createChannelDisplay = false;
    this.adddUserToChannelDisplay = false;
    this.adddUserToGroupDisplay = false;
  }

  getChannelsByGroupID(groupID: number){
    this.httpClient.post(BACKEND_URL + "/getChannelsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelArray = data;
    })
  }

  navigateToChatArea(channelName: string){
    let userID = this.userID;
    let displayMessage = true;

    this.httpClient.post(BACKEND_URL + "/getChannelByChannelName", {channelName}, httpOptions).subscribe((data: any) =>{
      let channelData: ChannelData = data;
      
      channelData.userID.map(channelUserID => {
        if(channelUserID == userID){
          this.router.navigateByUrl('/chatArea/' + channelData.channelID);
          displayMessage = false;
        }
      })
      if(displayMessage){
        this.message = "You Don't have access to this channel"
      }
    })
  }

  createChannel(){
    // A function that will create a channel that grants access permission to all users apart of the same group.
    let groupID = this.groupID;
    this.httpClient.post(BACKEND_URL + "/getGroupsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      this.channelData.groupID = this.groupID + "";
      this.channelData.userID = data.userID;

      this.httpClient.get(BACKEND_URL + "/getChannel", httpOptions).subscribe((data: any) =>{
        let channelArray = data.channels
        let newChannelID = parseInt(channelArray[channelArray.length-1].channelID.substr(1)) + 1
        this.channelData.channelID = "c"+newChannelID

        this.httpClient.post(BACKEND_URL + "/createChannel", this.channelData, httpOptions).subscribe((data: any) =>{})

      })

      
    })
  }

  getUserAndChannelID(){
    //A function that will get the user and channel id and calls the addUserChannel function while passing in the two ids.
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
      console.log(data)
      console.log(groupID)

      if(data != undefined){
        let userID = data.id;
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

  updateGroupAdmin(role: string){
    let groupID = this.groupID
    let userName = this.addUserData.userName
    this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions).subscribe((data: any) =>{
      let userID = data[0].userID;
      this.httpClient.post(BACKEND_URL + "/updateGroupAdmin", {groupID, userID}, httpOptions).subscribe((data: any) =>{})
      
      this.updateUserRole(role)
    })

  }

  updateUserRole(role: string){
    let userName = this.addUserData.userName

    this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions).subscribe((data: any) =>{
      data[0].role = role;
      let userData = data;
      this.httpClient.post(BACKEND_URL + '/updateUser', userData, httpOptions).subscribe((data: any) =>{})
    })
  }

  updateGroupAssistant(userName: string, deleteAction: boolean){
    // A function that will update the assistantID array within the current group.
    // The deleteAction param reduce code by allowing the function call to specify if the action will remove the user from the assistant role or not.
    let groupData: GroupData = {id: 0, name: '', userID: [""], adminID: "", assistantID: [""]};
    let groupID = this.groupID;

    //get groups and edit the groupAssistant element;
    this.httpClient.post(BACKEND_URL + "/getGroupsByGroupID", {groupID}, httpOptions).subscribe((data: any) =>{
      groupData = data;

      this.httpClient.post(BACKEND_URL + "/getUserByUserName", {userName}, httpOptions).subscribe((data: any) =>{
        let userID = data[0].userID;

        if(deleteAction){
          //Remove the userID from assistantID Array if the array contain that user
          groupData.assistantID.map((assistantID, index) =>{
            if(assistantID == userID){
              groupData.assistantID.splice(index,1)
            }
          })
        }else {
          //Add the userID to the asssistant array
          let isAssistant: boolean = false;
          groupData.assistantID.map((assistantID, index) =>{
            if(assistantID == userID){
              isAssistant = true
            }
          })
          if(!isAssistant){
            groupData.assistantID.push(userID)
          }
        }

        this.httpClient.post(BACKEND_URL + '/updateGroupAssistant', groupData, httpOptions).subscribe((data: any) =>{})
      })
    })
  }
}
