import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelData, ChannelsService } from "../services/channels.service";
import { GroupsService, GroupData } from '../services/groups.service';
import { UsersService, UserData } from '../services/users.service';
 
@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  // group variable -> 
  groupID: number = 0;
  adddUserToGroupDisplay: boolean = false;

  // channel variable -> 
  adddUserToChannelDisplay: boolean = false;
  channelArray = [{id: 0, name: "", groupID: 0, userID: [0]}]; // The channel array is the array that is getting displayed
  createChannelDisplay: boolean = false;
  channelData: ChannelData = {id: 0, name: "", groupID: 0, userID: [0]}; // The channelData will be passed through to an api to create new channel or update channels.
  channelName: string = "";

  // user variable ->
  userID: number = 0;
  userName: string = ""
  userArray: UserData[] = [];
  adminAccess = 4;

  addUserData = {channelName: "", userName: ""};
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router,
    private channelsService: ChannelsService, private groupsService: GroupsService, private usersService: UsersService) { }

  ngOnInit(): void {
    // Initialize the component variables
    this.getAllUser();
    this.groupID = parseInt(this.route.snapshot.params['id']);
    let userIDString = localStorage.getItem("userID") || '';
    this.userID = parseInt(userIDString);

    // get the current user access permission and parse it as a string to adminAccess variable
    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = + adminAccessNum;

    // Asign the user their permission for this group
    this.assignGroupPermission()
  }

  // Get the channel which the user is a part of
  getChannelByUserID(){
    this.channelsService.getChannelByUserID(this.userID, this.groupID).subscribe((data: any) =>{
      if(data.length == 0){
        this.message = "You are not apart of any channel in this group"
      } 
      this.channelArray = data
    })
  }

  // A function which will asign the user their permission for this group
  assignGroupPermission(){
    // a function that will check if the user is a groupadmin or groupassis of this group and grant corresponding permission
    let groupArray: GroupData = {id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]};
    let isGroupAssis = false;
    let isGroupAdmin = false;

    this.groupsService.getGroupByGroupID(this.groupID).subscribe((data: any) =>{
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

  // clear the html display
  clearDisplays(){
    this.createChannelDisplay = false;
    this.adddUserToChannelDisplay = false;
    this.adddUserToGroupDisplay = false;
  }

  // get group by group id
  getChannelsByGroupID(groupID: number){
    this.channelsService.getChannelsByGroupID(groupID).subscribe((data: any) =>{
      this.channelArray = data;
    })
  }

  // navigate to the chat area and check if the user have access. 
  navigateToChatArea(channelName: string){
    let userID = this.userID;
    let displayMessage = true;

    this.channelsService.getChannelByChannelName(channelName).subscribe((data: any) =>{
      let channelData: ChannelData = data;
      channelData.userID.map(channelUserID => {
        if(channelUserID == userID){
          this.router.navigateByUrl('/chatArea/' + channelData.id);
          displayMessage = false;
        }
      })
      if(displayMessage){
        this.message = "You Don't have access to this channel"
      }
    })
  }

  // create a channel
  createChannel(){
    let newChannel: ChannelData = {id: 0, name: this.channelData.name, groupID: this.groupID, userID: [this.userID]};
    this.channelsService.createChannel(newChannel);
  }

  //A function that will get the user and channel id and calls the addUserChannel function while passing in the two ids.
  getUserAndChannelID(){
    let userName = this.addUserData.userName
    let channelName = this.addUserData.channelName

    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      if(data != undefined){
        let userID = data.id;
        this.channelsService.getChannelByChannelName(channelName).subscribe((data: any) =>{
          let channelID = data.id;
          this.addUserToChannel(userID, channelID)
        })
      }
    })
  }

  // A function which will add a user to the channel
  addUserToChannel(userID: number, channelID: number){
    this.channelsService.addUserToChannel(userID, channelID);
  }

  // A function which will add the user to this group
  addUserToGroup(){
    let groupID = this.groupID
    let userName = this.addUserData.userName;

    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      if(data != undefined){
        let userID = data.id;
        this.groupsService.addUserToGroup(userID, groupID);
      }
    })
  }

  // A function which will remove the user from this group
  removeUserFromGroup(){
    let groupID = this.groupID
    let userName = this.addUserData.userName;

    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      if(data != undefined){
        let userID = data.id;
        this.groupsService.removeUserFromGroup(userID, groupID)
      }
    })
  }

  // A function which will remove the user from this channel
  removeUserFromChannel(){
    let userName = this.addUserData.userName
    let channelName = this.addUserData.channelName
    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      if(data[0] != undefined){
        let userID = data[0].userID;
        this.channelsService.getChannelByChannelName(channelName).subscribe((data: any) =>{
          let channelID = data.channelID;
          this.channelsService.removeUserFromChannel(userID, channelID);
        })
      }
    })
  }

  // A function which will delete a channel
  deleteChannel(channelID: number){
    this.channelsService.deleteChannel(channelID);
  }

  // A function which will update the group admin for this group
  updateGroupAdmin(role: string){
    let groupID = this.groupID
    let userName = this.addUserData.userName
    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      let userID = data.id;
      //Make sure the userID is define
      if(userID){
        this.groupsService.updateGroupAdmin(userID, groupID);
        this.updateUserRole(role)
      }
    })

  }

  // A function which will update the user role
  updateUserRole(role: string){
    let userName = this.addUserData.userName

    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      data.role = role;
      let userData = data;
      this.usersService.updateUser(userData);
    })
  }

  // A function which will update the group assistant.
  updateGroupAssistant(userName: string, deleteAction: boolean){
    // A function that will update the assistantID array within the current group.
    // The deleteAction param reduce code by allowing the function call to specify if the action will remove the user from the assistant role or not.
    let groupData: GroupData = {id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]};
    let groupID = this.groupID;

    //get groups and edit the groupAssistant element;
    this.groupsService.getGroupByGroupID(groupID).subscribe((data: any) =>{
      groupData = data;

      this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
        let userID = data.id;

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

        this.groupsService.updateGroupAssistant(groupData);
      })
    })
  }

  // A function which will get all the users.
  getAllUser(){
    this.usersService.getAllUsers().subscribe((data: any)=> {
      this.userArray = data;
    })
  }
}
