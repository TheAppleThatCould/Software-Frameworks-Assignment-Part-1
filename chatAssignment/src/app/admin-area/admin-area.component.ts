import { Component, OnInit } from '@angular/core';
import { UserData, UsersService } from "../services/users.service";
import { GroupData, GroupsService } from '../services/groups.service';
import { ChannelData, ChannelsService } from "../services/channels.service";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {

  // User related variable
  adminAccess = 4;
  userName: string = ""
  userData: UserData = {userName: "", email: "", birthDate: "", age: 0, password: "", role: "", id: 0, valid: false, imageURL: ""};
  userArray: UserData[] = [];

  // group related variable
  groupName: string = ""
  groupData: GroupData = {id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]};
  groupArray: GroupData[] = [];

  // channel related variable
  channelData: ChannelData = {id: 0, name: "", groupID: 0, userID: [0]};
  channelArray: ChannelData[] = [];

  // Display related variable. The display variable will check which form to display in the html.
  searchUserDisplay: boolean = false;
  createUserDisplay: boolean = false;
  searchGroupDisplay: boolean = false;
  displayAllUsersDisplay: boolean = false;
  displayAllGroupsDisplay: boolean = false;
  displayAllChannelDisplay: boolean = false;


  constructor(private usersService: UsersService, private groupsService: GroupsService,
              private channelsService: ChannelsService){}

  ngOnInit(): void {
    // Initialize userArray, groupArray, and channelArray with the following three functions.
    this.getAllUsers();
    this.getAllGroups();
    this.getAllChannel();

    // Get the user access level
    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;
  }

  // A function to get the user based on the userName 
  searchUser(userName: string){
    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      this.userData = data;
    })
  }

  // A function to update the user's role in the database
  updateUserRole(role: string){
    this.userData["role"] = role
    this.usersService.updateUser(this.userData);
  }

  // A function to delete user in the database
  deleteUser(userID: number){
    this.usersService.deleteUser(userID);
  }

  // A function to create user in the database
  createUser(){
    this.usersService.createUser(this.userData);
  }

  // Asign all display to false. The display's variable will check which form to display on the html.
  clearDisplays(){
    this.searchUserDisplay = false;
    this.createUserDisplay = false;
    this.searchGroupDisplay = false;
    this.displayAllUsersDisplay = false;
    this.displayAllGroupsDisplay = false;
    this.displayAllChannelDisplay = false;
  }


  // Get all users and asign it to the userArray
  getAllUsers(){
    this.usersService.getAllUsers().subscribe((data: any) =>{
      this.userArray = data;
    })
  }

  // Get all groups and asign it to the groupArray
  getAllGroups(){
    this.groupsService.getAllGroups().subscribe((data: any) =>{
      this.groupArray = data;
    })
  }

  // Get all channel and asign it to the channelArray
  getAllChannel(){
    this.channelsService.getAllChannel().subscribe((data: any) =>{
      this.channelArray = data.channels;
    })
  }
}
