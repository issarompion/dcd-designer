import { Component, Inject, Optional,PLATFORM_ID, OnInit} from '@angular/core';
import {isPlatformServer} from "@angular/common";
import { MatSlideToggleChange } from '@angular/material';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  checked:boolean = false
  mode : string = "TYPE"

  toggle(event: MatSlideToggleChange) {
    this.checked = event.checked;
    if(event.checked){
      this.mode = "DATA COLLECTION"
    }else{
      this.mode = "TYPE"
    }
}

  constructor(@Inject(PLATFORM_ID) private platformId: Object,) {}

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Home component server'); // host on the server  
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      console.log('Init Home component browser')
    }

  }