import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { User } from '@firebase/auth';
import { icons } from './shared/icons';
import { PropicComponent } from './propic/propic.component';
import { PropicService } from './services/propic.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: User | any;
  initials: string = '';
  pics;
  icons=icons;
  constructor(
    private auth: AuthenticationService,
    public dialog: MatDialog,
    private propric:PropicService,

  ) { }

  ngOnInit(): void {
    this.propric.getPropics().subscribe((pics)=>this.pics=pics)
    this.auth.isLoggedIn;
    this.auth.activeUser.subscribe((user) => {
      if (user) {
        this.user = user
      }
      else {
        this.user = '';
        this.initials = '';
      }
      if (this.user.displayName) {
        let name = this.user.displayName.split(" ");
        if (!this.initials) {
          for (let i = 0; i < name.length; i++) {
            this.initials += name[i][0]
          }
        }
      }
    })

  }
  logout() {
    this.auth.logout()
    this.user=null;
    console.log(this.user)
  }
  openPropic(){
    this.dialog.open(PropicComponent,{panelClass: "propicDialog",width:'500px', height:"400px",data:this.pics})
  }
  openLoginForm() {
    const loginRef = this.dialog.open(LoginComponent, { panelClass: "loginDialog", width: '500px', height: '450px' });
  }
}
