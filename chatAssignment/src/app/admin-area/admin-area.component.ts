import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { httpOptions, BACKEND_URL } from '../services/server.service';
import { UserData, UsersService } from "../services/users.service";
import { GroupData, GroupsService } from '../services/groups.service';
import { ChannelData, ChannelsService } from "../services/channels.service";

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {
  adminAccess = 4;

  userName: string = ""
  userData: UserData = {userName: "", email: "", birthDate: "", age: 0, password: "", role: "", id: 0, valid: false};
  userArray: UserData[] = [];


  groupName: string = ""
  groupData: GroupData = {id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]};
  groupArray: GroupData[] = [];

  channelData: ChannelData = {id: 0, name: "", groupID: 0, userID: [0]};
  channelArray: ChannelData[] = [];

  
  searchUserDisplay: boolean = false;
  createUserDisplay: boolean = false;
  searchGroupDisplay: boolean = false;
  displayAllUsersDisplay: boolean = false;
  displayAllGroupsDisplay: boolean = false;
  displayAllChannelDisplay: boolean = false;


  constructor(private httpClient: HttpClient, private usersService: UsersService,
     private groupsService: GroupsService, private channelsService: ChannelsService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllGroups();
    this.getAllChannel();

    let adminAccessNum = localStorage.getItem("adminAccess") || '4';
    this.adminAccess = +adminAccessNum;
  }

  searchUser(userName: string){
    this.usersService.getUserByUserName(userName).subscribe((data: any) =>{
      this.userData = data;
    })
  }

  updateUserRole(role: string){
    this.userData["role"] = role
    
    this.usersService.updateUser(this.userData);
  }

  deleteUser(userID: number){
    this.usersService.deleteUser(userID);
  }

  createUser(){
    this.usersService.createUser(this.userData);
  }

  clearDisplays(){
    this.searchUserDisplay = false;
    this.createUserDisplay = false;
    this.searchGroupDisplay = false;
    this.displayAllUsersDisplay = false;
    this.displayAllGroupsDisplay = false;
    this.displayAllChannelDisplay = false;
  }

  getAllUsers(){
    this.usersService.getAllUsers().subscribe((data: any) =>{
      this.userArray = data;
    })
  }

  getAllGroups(){
    this.groupsService.getAllGroups().subscribe((data: any) =>{
      this.groupArray = data;
    })
  }

  getAllChannel(){
    this.channelsService.getAllChannel().subscribe((data: any) =>{
      this.channelArray = data.channels;
    })
  }
}
