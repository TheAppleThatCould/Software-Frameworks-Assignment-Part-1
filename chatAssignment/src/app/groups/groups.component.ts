import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsService, GroupData } from '../services/groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
// A component for the group page.
export class GroupsComponent implements OnInit {
  // Depending on this variable the html will display admin functionality
  adminAccess = 4;

  // The valid variable will check if the user is login-in.
  valid: boolean = false;
  userID: number = 0; // The user's id

  // The array that will contain all the groups the user is apart of.
  groupArray: any = [{id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]}];
  groupData: GroupData = {id: 0, name: '', userID: [0], adminID: 0, assistantID: [0]};

  // Check html should display create group form
  createGroupDisplay: boolean = false;

  // A message that can be display to the user
  message: string = '';

  constructor(private router: Router, private groupsService: GroupsService) {}

  // Receive value from local storage and run functions to get groups depending on the access level
  ngOnInit() {
    // Receive value from local storage 
    this.valid = localStorage.getItem("valid") === 'true' || false;
    this.userID = parseInt(localStorage.getItem("userID") || '');

    this.adminAccess = parseInt(localStorage.getItem("adminAccess") || '');

    // Check the user's login status, and their access level.
    // The super admin will be able to see all groups with their access level of 1.
    if(this.valid == false){
      this.router.navigateByUrl('/login');
    } else if(this.adminAccess == 1) {
      this.groupsService.getAllGroups().subscribe((data: any) =>{
        this.groupArray = data;
      });

    } else {
      this.groupsService.getGroupsByUserID(this.userID).subscribe((data: any) =>{
        this.groupArray = data;
      })
    }
  }

  // This function will redirect the user to a channel while preventing them from accessing a group they are not a part of.
  navigateToGroup(groupID: number){
    let displayMessage: boolean = true;
    // This piece of code will get all the groups that the user is apart of and
    // check it against the groupID param for the group the user clicked on.
    this.groupsService.getAllGroups().subscribe((data: any) => {
      let groupArray: GroupData[] = data;

      // Prevent access to a group a user is not apart of, aside from the super user.
      if(this.adminAccess > 1){
        groupArray.map(el => {
          if(el.id == groupID){
            this.router.navigateByUrl('/channels/' + groupID);
            displayMessage = false;
          }
        })
      } else {
        this.router.navigateByUrl('/channels/' + groupID);
        displayMessage = false;
      }

      if(displayMessage){
        this.message = "You Don't have access to this group"
      }

    });
  }

  // A function that will create a new group based on the groupData
  createGroup(){
    this.groupsService.createGroup(this.groupData);
  }

  // A function that will delete a group based on the groupID param
  deleteGroup(groupID: number){
    this.groupsService.deleteGroup(groupID);
  }
}
