import { Component, Inject,PLATFORM_ID, OnInit} from '@angular/core';
import {isPlatformServer} from "@angular/common";
import {HttpClientService,Property} from '@datacentricdesign/ui-angular'
import { MatSlideToggleChange } from '@angular/material';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  properties : Property[] = [] 

  checked:boolean = false
  mode : string = "TYPE"
  rangeDates: Date[]

  toggle(event: MatSlideToggleChange) {
    this.checked = event.checked;
    if(event.checked){
      this.mode = "DATA COLLECTION"
      console.log(this.properties)
    }else{
      this.mode = "TYPE"
    }
}

  constructor(@Inject(
    PLATFORM_ID) private platformId: Object,
    private service: HttpClientService
  ) {}

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Home component server'); // host on the server 
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      console.log('Init Home component browser')
      this.FillArrayProperties(this.properties,new Date(0).getTime(),new Date().getTime())
    }

    FillArrayProperties(properties:Property[],from:number,to:number) {
      this.service.get('api/things').subscribe(
        data1 => {
        data1['things'].forEach(thing_json => {
          this.service.get('api/things/'+thing_json.id).subscribe(
          data2 => {
            data2['thing'].properties.forEach(prop_json=>{
              this.service.get('api/things/'+prop_json.entityId+'/properties/'+prop_json.id+'?from='+from+'&to='+to).subscribe(
                data3 => {
                    properties.push(new Property(data3['property']))
                })
            })
        });
      });
    });
  }

  getValues(rangeDates:Date[]){
    if(rangeDates.length == 2){
      if(rangeDates[0] && rangeDates[1]){
        this.properties = []
        this.FillArrayProperties(this.properties,rangeDates[0].getTime(),rangeDates[1].getTime())
      }
    }
  }

  }