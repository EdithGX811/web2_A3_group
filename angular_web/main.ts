import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { SearchFunComponent } from './app/search-fun/search-fun.component';
import { DetailsComponent } from './app/details/details.component';
import { DonationComponent } from './app/donation/donation.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './app/admin/admin.component';
import { HomeComponent  as AdminHome } from './app/admin/home/home.component';
import { AddComponent } from './app/admin/add/add.component';
import { EditComponent } from './app/admin/edit/edit.component';
import { DataService } from './app/data.service';
import { HttpClientModule } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule,HttpClientModule),
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'search', component: SearchFunComponent, },
      { path: 'fundraiser', component: DetailsComponent },
      { path: 'fundraiser/:id', component: DetailsComponent },
      { path: 'donation', component: DonationComponent },
      { path: 'admin', component: AdminComponent ,data:{admin_header:true},
      children:[
        {path:'',component:AdminHome},
        {'path':'add',component:AddComponent},
        {'path':'add/:id',component:AddComponent},
        {'path':'edit',component:EditComponent},
        {'path':'edit/:id',component:EditComponent}
      ]}
    ]),
    DataService
  ],
});