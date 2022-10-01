import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelData, ChannelsService } from "../services/channels.service";
import { GroupsService, GroupData } from '../services/groups.service';
import { UsersService } from '../services/users.service';
 
@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  adminAccess = 4;

  groupID: number = 0;
  // The channel array is the array that is getting displayed
  channelArray = [{id: 0, name: "", groupID: 0, userID: [0]}];

  createChannelDisplay: boolean = false;
  //The channelData be passed through an api to create new channel or update channels.
  // When creating an channel the name is assign by the user.
  channelData: ChannelData = {id: 0, name: "", groupID: 0, userID: [0]};

  userID: number = 0;

  adddUserToChannelDisplay: boolean = false;
  adddUserToGroupDisplay: boolean = false;
  addUserData = {channelName: "", userName: ""};

  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router,
    private channelsService: ChannelsService, private groupsService: GroupsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.groupID = parseInt(this.route.snapshot.params['id']);
    let userIDString = localStorage.getItem("userID") || '';
    this.userID = parseInt(userIDString);

    // get the current user access permission and parse it as a string to adminAccess variable
    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = + adminAccessNum;

    this.assignGroupPermission()
  }

  getChannelByUserID(){
    this.channelsService.getChannelByUserID(this.userID, this.groupID).subscribe((data: any) =>{
      if(data.length == 0){
        this.message = "You are not apart of any channel in this group"
      } 
      this.channelArray = data
    })
  }

  assignGroupPermission(){
    // a function that will check if the user is a groupadmin or groupassis of this group and grant corresponding permission
    let groupArray: GroupData = {id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]};
    let groupID = this.groupID;
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

  clearDisplays(){
    this.createChannelDisplay = false;
    this.adddUserToChannelDisplay = false;
    this.adddUserToGroupDisplay = false;
  }

  getChannelsByGroupID(groupID: number){
    this.channelsService.getChannelsByGroupID(groupID).subscribe((data: any) =>{
      console.log(data)
      this.channelArray = data;
    })
  }

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

  createChannel(){
    let newChannel: ChannelData = {id: 0, name: this.channelData.name, groupID: this.groupID, userID: [this.userID]};
    this.channelsService.createChannel(newChannel);
  }

  getUserAndChannelID(){
    //A function that will get the user and channel id and calls the addUserChannel function while passing in the two ids.
    let userName = this.addUserData.userName
    let channelName = this.addUserData.channelName

    // Get 
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

  addUserToChannel(userID: number, channelID: number){
    this.channelsService.addUserToChannel(userID, channelID);
  }

  addUserToGroup(){
    //addUserToGroup
    let groupID = this.groupID
    let userName = this.addUserData.userName;

    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      if(data != undefined){
        let userID = data.id;
        this.groupsService.addUserToGroup(userID, groupID);
      }
    })
  }

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

  deleteChannel(channelID: number){
    this.channelsService.deleteChannel(channelID);
  }

  updateGroupAdmin(role: string){
    let groupID = this.groupID
    let userName = this.addUserData.userName
    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      let userID = data[0].userID;
      this.groupsService.updateGroupAdmin(groupID, userID);
      this.updateUserRole(role)
    })

  }

  updateUserRole(role: string){
    let userName = this.addUserData.userName

    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      data.role = role;
      let userData = data;
      this.usersService.updateUser(userData);
    })
  }

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
}
