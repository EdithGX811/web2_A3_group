import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from "./home/home.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone:true,
  imports:[RouterModule,
    MatToolbarModule,
    HeaderComponent,
    HomeComponent,
    CommonModule,
    HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_web';
  admin_header:boolean = true;
  constructor(private router:Router,private activatedRoute:ActivatedRoute){
    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        const currentRoute = this.activatedRoute.firstChild;
        if(currentRoute){
          currentRoute.data.subscribe(data=>{
            console.log(data['admin_header']);
            if(!data['admin_header']){
              this.admin_header = false
            }else{
              this.admin_header = true
            }            
          })
        }
      }
    })
  }
}
