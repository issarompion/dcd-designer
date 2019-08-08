import { Component, Inject,PLATFORM_ID, OnInit} from '@angular/core';
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'my-things',
  templateUrl: './my-things.component.html',
  styleUrls: ['./my-things.component.css']
})
export class MyThingsComponent implements OnInit {

  constructor(@Inject(
    PLATFORM_ID) private platformId: Object
  ) {}

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init My Things component server'); // host on the server 
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      console.log('Init My Things component browser')
    }
  }