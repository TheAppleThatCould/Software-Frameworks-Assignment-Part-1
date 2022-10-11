import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { httpOptions, BACKEND_URL } from './server.service';

export interface GroupData {
  id: number;
  name: string;
  userID: number[];
  adminID: number;
  assistantID: number[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private httpClient: HttpClient) { }

  // A function that will get all the groups by calling the getGroups api.
  getAllGroups(){
    return this.httpClient.get<any>(BACKEND_URL + '/getGroups', httpOptions)
  }

  // A function that will get groups that the user is apart of.
  getGroupsByUserID(userID: number){
    return this.httpClient.post(BACKEND_URL + '/getGroupsByUserID', {userID}, httpOptions)
  }

  // A function that will create a new group based on the groupData
  createGroup(groups: GroupData){
    this.httpClient.post(BACKEND_URL + '/createGroup', groups, httpOptions).subscribe((data) =>{
      console.log(data)
    });
  }

  // A function that will delete a group based on the groupID param
  deleteGroup(groupID: number){
    this.httpClient.post(BACKEND_URL + '/deleteGroup', {groupID}, httpOptions).subscribe((data: any) =>{})
  }

  getGroupByGroupID(groupID: number){
    return this.httpClient.post(BACKEND_URL + "/getGroupsByGroupID", {groupID}, httpOptions);
  }

  addUserToGroup(userID: number, groupID: number){
    this.httpClient.post(BACKEND_URL + '/addUserToGroup', {userID, groupID}, httpOptions).subscribe((data: any) =>{})
  }

  removeUserFromGroup(userID: number, groupID: number){
    this.httpClient.post(BACKEND_URL + "/removeUserFromGroup", {userID, groupID}, httpOptions).subscribe((data: any) =>{})
  }

  updateGroupAdmin(userID: number, groupID: number){
    console.log(userID, groupID)
    this.httpClient.post(BACKEND_URL + "/updateGroupAdmin", {groupID, userID}, httpOptions).subscribe((data: any) =>{})
  }

  updateGroupAssistant(groupData: GroupData){
    this.httpClient.post(BACKEND_URL + '/updateGroupAssistant', groupData, httpOptions).subscribe((data: any) =>{})
  }
}
