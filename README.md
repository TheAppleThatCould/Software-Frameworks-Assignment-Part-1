# ChatAssignment

# 3813ICT Software Frameworks - Documentation
Documentation for stage 1 Assignment 1

Student Name: Joshua Adams
Student Number: s5224647

# Documentation
## Organization of the Git Repository:
During development I committed code to the main branch every time I had created a new functionality. I had tested the code to ensure it was working before committing it.

## Description of Data Structures.
My application contains 4 different data structures for users, groups, channels, and chatHistory. All the data is contained within 4 separate Json files for the above mentioned data structures.

### Users:
The users.json data contains a Json object with a “userDetails” key which contains an array of users. The following image is an example of the users.json.
`{"userDetails":
[{"userID":"u001","userName":"super","birthDate":"11/04/1999","age":34,"email":"super@gmail.com","password":"super","role":"super","valid":false}]
}`

The following is the user data structure for a single user:
- userID: string
- userName: string
- Birthdate: string
- Age: number
- Email: string
- Password: string
- Role: string
- Valid: boolean

### Groups:
Similarly to the user data structure the groups data is made up of a Json object with a “groups” key which contains an array of groups. The following is an example of the groups data structure:
`{
"groups":[{"groupID":"g001","name":"testGroup1","userID":["u001","u002","u004","u005","u003"],"adminID":"u003","assistantID":["u003"]}]
}`

The following is the groups data structure for a single group:
- groupID: string
- Name: string
- userID: string[]
- adminID: string
- assistantID: string[]

### Channels:
Similarly to the user data structure the channel’s data is made up of a Json object with a “channels” key which contains an array of channels. The following is an example of the channel’s data structure:
`{
"channels":[{"channelID":"c002","name":"testChannel2","groupID":"g001","userID":["u001","u003"]}]
}`

The following is the channel’s data structure for a single channel:
- channelID: string
- Name: string
- groupID: string
- userID: string[]


### ChatHistory:
The chatHistory data structure is made up of an json array that contains all the chat history. The following is an example of a single chat message:
`[
{"channelID":"c001","userID":"u001","userName":"super","message":"test1"}
]`

The following is the chatHistory data structure for a single message:
- channelID: string
- userID: string
- userName: string
- Message: string



## Angular Architecture: components, services, models, routes.
### Components:
#### Login:
The login component contains functionality to login to an account.

#### Account:
The account component allows the user to view their account information

#### Admin-area:
The admin-area has extra functionality that allows the admins to easily edit the various data, such as the users, channels or groups settings. This area allows the admin to easily search and edit data.

#### Groups:
The groups component contains the view of all the groups the users is a part of. If the user is a super admin they can also view options to delete or edit the groups. 

#### Channels:
The channels component contains a list of all the channels the user is a part of. The channel component also allows the group admin and group assistant to view options related to editing and deleting the channel or groups. There are also options within this component to remove/add a user from/to a channel. 

#### Chat-area:
The chat area contains the functionality to send and view messages within a channel.

#### Services:
Socket.service - For the socket functionality

#### Models:
None.

#### Routes:
The following are the routes for the application:
“/login”. This route will redirect the user to the login component
“/account”. This route will redirect the user to the account component
“/groups”. This route will redirect the user to the groups component
“/channel:id”. This route will redirect the user to the channel component while passing in the groupID for the purpose of getting all the channels for that group.
“/chatArea:id”. This route will redirect the user to the chat-area component while passing in the channel ID for the purpose of getting the chat history for that channel.
“/adminArea”. This route will redirect the user to the login component



## Node server architecture: modules, functions, files, global variables.
The following is a list of server side stuff:
The server side does not have any global variable.

Each file inside of the api folder contains an exported module for all the functions for that file. The following are the functions that are exported along with the module:
Group.js file functions:
- getGroups() -
- createGroup() -
- deleteGroup() -
- addUserToGroup() -
- RemoveUserFromGroup() -
- updateGroupAdmin() - 
- updateGroupAssistant() -
- getGroupDetailsByUserID() - 
- getGroupsByGroupName() -
- getGroupsByGroupID() -
- Channe.js file functions:
- getChannel() -
- createChannel() -
- deleteChannel() - 
- removeUserFromChannel() -
- addUserToChannel() -
- getChannelByChannelName() -
- getChannelByUserID() -
- getChannelByGroupID() -
- getChannelHistory() -
- writeChannelHistory() -

User.js file function:
- getAllUsers() -
- deleteUser() -
- getUserByUserName() -
- updateUser() -
- createUser() -

The following is a list of server side file:
API folder:
This folder contains all the API functions. 

The files inside of this folder are:
- Auth.js - For user authentication 
- Channel.js - For channel apis
- Group.js - For groups apis
- User.js - For user apis
Data folder:
This folder contains all the json files for the data storage.

The files inside of this folder are:
- Channels.json - For the channel data.
- chatHistory.json - For the chat history data.
- Groups.json - For the groups data.
- Users.json - For the users data.

Server folder:
This folder contain the above mentioned API and Data folder in addition to the following files:
- Listen.js - For the code to start the server
- Server.js - For the apis routes in addition to the server set-up values.
- Socket.js - For the socket code.


## A description of how you divided the responsibilities between client and server (you are encouraged to have the server provide a REST API which returns JSON in addition to a static directory)
** The server side is responsible for receiving, editing or removing data from the json files. **

** The client side is responsible for displaying the data and providing interactivity to the user. **



## A list of routes, parameters, return values, and purpose in the server side

The following is a list of server side routes, parameters, return values and purpose:

- Route: “/login” - Parameters: userName, password - Return value: User Object - Purpose: Allow the user to login and return their account information.

- Route: “/getGroups” - Parameters: None - Return value: Array of all the groups - Purpose: Return all the groups to display in the admin area.

- Route: “/createGroup” - Parameters: Group Object - Return value: True or False- Purpose: Store new group data into the Json file. 

- Route: “/deleteGroup” - Parameters: groupID - Return value: True - Purpose: Remove a group from the groups.json file

- Route: “/addUserToGroup” - Parameters: userID, groupID - Return value: True - Purpose: The purpose was to add a user to a group by storing the userID into the group with the matching groupID. 

- Route: “/removeUserFromGroup” - Parameters: userID, groupID- Return value: True - Purpose:  The purpose was to remove a user form a group by removing the matching userID from the group with the matching groupID

- Route: “/updateGroupAdmin” - Parameters: userID, groupID - Return value: True - Purpose:  Update the group admin variable with the userID within the group with the matching groupID 

- Route: “/updateGroupAssistant” - Parameters: groupObject -  Return value: True - Purpose:  Update the group assistant array by replacing the groupObject with an updated groupObject

- Route: “/getGroupByUserID” - Parameters: userID- Return value: An array of groups - Purpose:  Get all the groups that the user is a part of. This is done by returning all the groups that contain the userID that was passed through the parameters.

- Route: “/getGroupsByGroupName” - Parameters: The name of a group - Return value: A group Object - Purpose: Allow the user to search for a group via inputting a group name.

- Route: “/getGroupsByGroupID” - Parameters: groupID- Return value: A group object - Purpose:  Add the functionality to get the group by its groupID.

- Route: “/getChannel” - Parameters: None - Return value: An array of channels- Purpose:  Add the functionality to get all the channels.

- Route: “/createChannel” - Parameters: Channel Object - Return value: True or False - Purpose:  Create a new channel.

- Route: “/deleteChannel” - Parameters: userID, groupID- Return value: True - Purpose:  The purpose is to delete a channel.

- Route: “/removeUserFromChannel” - Parameters: userID, channelID- Return value: True - Purpose:  The purpose is to remove a user from a certain channel

- Route: “/addUserToChannel” - Parameters: userID, channelID- Return value: True - Purpose:  The purpose is to add a user to a channel

- Route: “/getChannelByChannelName” - Parameters: channelName - Return value: a channel object - Purpose:  The purpose is to get a channel by its channel name.

- Route: “/getChannelsByUserID” - Parameters: userID - Return value: An array of channels - Purpose:  The purpose is to get all the channels the user is a part of. 

- Route: “/getChannelsByGroupID” - Parameters: groupID - Return value: An array of channels- Purpose:  The purpose is to get all the channels that are a part of a group. 

- Route: “/getChannelHistory” - Parameters: channelID- Return value: True - Purpose:  The purpose was to get all the channel history for a certain channel.

- Route: “/writeChannelHistory” - Parameters: channelHistory array- Return value: True - Purpose:  The purpose was to update the channel history. 

- Route: “/getAllUsers” - Parameters: None - Return value: an array of users- Purpose:  The purpose was to get all the users for the admin area. The array of users is meant to be displayed as a list so that the admin can easily search and edit a user.  

- Route: “/deleteUser” - Parameters: userID - Return value: True - Purpose:  The purpose was to allow an admin to delete a user. 

- Route: “/getUserByUserName” - Parameters: userName - Return value: True - Purpose:  The purpose was to get the user by their userName. There is functionality on the client side that allows an admin to search for an user. Because the admin wouldn’t know their id, they must search via the user name.

- Route: “/updateUser” - Parameters: user object- Return value: True - Purpose:  The purpose was to allow the admin to update an user by passing in an user object to replace the old user. 

- Route: “/createUser” - Parameters: user object- Return value: True - Purpose:  The purpose was to allow an admin to create a new user.



## Describe the details of the interaction between client and server by indicating how the files and global vars in server side will be changed and how the display of each angular component page will be update

**Login component:**
This component interacts with the server side by calling the “/login” route and receiving the user’s account data. The user will provide a userName or email and a password as the parameter for the “/login” api route. The account information will also be stored within the local storage. 

**Groups component:**
The groups component interact with the server side by using the following routes:

- “/getGroups” -> Display all the groups to the super admin.
- “/getGroupsByUserID” -> Get and display all the groups that the user is a part of.
- “/createGroups” -> Allow the admin to create a group.
- “/deleteGroups” -> Allow the admin to delete a group.

**Chat-area component:**
The chat-area component interact with the server side by using the following routes:

- “/getChannelHistory” -> Receive and display all the chat history for this channel.
- “/writeChannelHistory” -> Update this channel history with new history.

**Channels component:**
The channel component interact with the server side by using the following routes:

- “/getChannelsByUserID” -> Get all the channels that the user is a part of and display them.
- “/getChannelsByGroupID” -> For the admin, get all the channels that are a part of the current group.
- “/getGroupsByGroupID” -> Receive group information in order to change the group data.
- “/getChannelByChannelName” -> Give the user the ability to edit a channel by inputting the channel name. 
- “/getChannel” -> Gives the logic to create a new channel id by receiving all the channels and incrementing 1 to the last channel id.
- “/createChannel” -> Give the admin the ability to create a channel for the current group.
- “/addUserToChannel” -> Give the ability to add a user to a channel.
- “/getUserByUserName” -> Allow the admin to edit user’s groups/channel settings by giving them the ability to input the username of a user.
- “/removeUserFromGroup” -> Give the ability to remove a user from the group.
- “/removeUserFromChannel” ->Give the ability to remove a user from the channel.
- “/deleteChannel” -> Give the ability to delete a channel.
- “/updateGroupAdmin” -> Give the ability to change the group admin of the current group.
- “/updateUser” -> Give the ability to change the user by changing the user’s object and replacing it inside of the Json file.
- “/updateGroupAssistant” -> Give the ability to update the groupAssistant. 

**Admin-area component:**
The admin-area component interacts with the server side to provide the admin with easy access to receive, update or delete data within the json files. The following are the routes to the server:

- “/getUserByUserName” -> Allow the admin to search for a user.
- “/updateUser” -> Allow the admin to update the user from the admin-area.
- “/deleteUser” -> Allow the admin to delete the user.
- “/createUser” -> Allow the admin to create a user.
- “/getAllUsers” -> Receive and display all the users.
- “/getGroups” -> Receive and display all the groups.
- “/getChannel” -> Receive and display all the channels.

**Account component:** 
The account component does not interact with the server side. However it does use the local storage to display the account information.


## Documentation link
https://docs.google.com/document/d/1Mp41i3iWiJue_ziNckDN5AcOgUYMdevR961SqLdaCL8/edit?usp=sharing
