import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { AccountComponent } from './account/account.component';
import { ChatAreaComponent } from './chat-area/chat-area.component';
import { GroupsComponent } from './groups/groups.component';
import { ChannelsComponent } from './channels/channels.component';
import { AdminAreaComponent } from './admin-area/admin-area.component';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "account", component: AccountComponent},
  {path: "chatArea/:id", component: ChatAreaComponent},
  {path: "groups", component: GroupsComponent},
  {path: "channels/:id", component: ChannelsComponent},
  {path: "adminArea", component: AdminAreaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
