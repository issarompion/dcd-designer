import { Component, Inject,PLATFORM_ID,Input, OnInit} from '@angular/core';
import {Property,Dimension} from '../../classes'
import {isPlatformServer} from "@angular/common";
import { MatSlideToggleChange } from '@angular/material';
import {HttpClientService} from '../httpclient.service'

@Component({
    selector: 'app-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.css']
})

export class PropertyComponent implements OnInit {

    @Input() ChildProperty: Property;
    @Input() RangeTime: number[];

    chart_type : string;
    values : any[] = []
    rangeDates: Date[]
    apiKey:string = ''
    checked:boolean = false
    mode : string = "Manual selected values"
    refresh : any
        
     constructor(private service: HttpClientService,@Inject(PLATFORM_ID) private platformId: Object,) {}
 
     ngOnInit(): void {
         if (isPlatformServer(this.platformId)) {
          console.log('Init Property component server'); 
             } else {
              if(this.RangeTime === undefined){
                const from : number = 0
                const to : number = (new Date).getTime();
                this.BrowserUniversalInit(from,to)
              }else{
                const from : number = this.RangeTime[0]
                const to : number = this.RangeTime[1];
                this.BrowserUniversalInit(from,to)
              }
              
           }
     }
 
     
     BrowserUniversalInit(from:number,to:number){
              this.service.get('api/things/'+this.ChildProperty.entity_id+'/properties/'+this.ChildProperty.id+'?from='+from+'&to='+to).subscribe(
              data => {
              if(data['property'].values.length > 0){
              const first_date = new Date(data['property'].values[0][0])
              const last_date = new Date(data['property'].values[data['property'].values.length-1][0])
              this.rangeDates = [first_date,last_date]
              }
              this.values = data['property'].values

             switch(this.ChildProperty.type) {
                 case "LOCATION": {
                  this.service.get('mapsKey').subscribe(
                  data => {
                    this.apiKey=data['key']
                  })
                     this.chart_type = "MAPS"
                     break
                 }
 
               //3D 
               case "TWELVE_DIMENSIONS":
               case "ELEVEN_DIMENSIONS":
               case "TEN_DIMENSIONS":
               case "NINE_DIMENSIONS":
               case "EIGHT_DIMENSIONS":
               case "SEVEN_DIMENSIONS":
               case "SIX_DIMENSIONS":
               case "FIVE_DIMENSIONS":
               case "FOUR_DIMENSIONS":
               case "THREE_DIMENSIONS":
               case "GYROSCOPE":
               case "GRAVITY":
               case "MAGNETIC_FIELD":
               case "GRAVITY":
               case "ROTATION_VECTOR":
               case "ACCELEROMETER" : {
                 this.chart_type = "RADAR"
                 break
             } 
              case "HEART_RATE":
              case "TWO_DIMENSIONS" : {
                this.chart_type = "DOUBLE"
                 break
             }
                 default: {
                     this.chart_type = "LINE"
                     break
                 }
      
              }
             })
    }

    getValues(rangeDates){
      if(rangeDates.length == 2){
        if(rangeDates[0] !== null && rangeDates[1]!== null){
            const from : number = rangeDates[0].getTime(); 
            const to : number = rangeDates[1].getTime() + 24*60*60*1000 ; 
             this.service.get('api/things/'+this.ChildProperty.entity_id+'/properties/'+this.ChildProperty.id+'?from='+from+'&to='+to).subscribe(
              data => {
              this.values = data['property'].values
            })
        }
      }
    }

      toggle(event: MatSlideToggleChange) {
        this.checked = event.checked;
        if(event.checked){
          //set timeout
          const now = new Date()
          this.rangeDates[0] = new Date(now.getTime()-60000)
          this.rangeDates[1] = now
          this.mode = "Real time values"
          this.refresh = setInterval(() => {
              this.getValues(this.rangeDates)
            }, 5000);
        }else{
          //cleartimeout
          this.mode = "Manual selected values"
          clearInterval(this.refresh)
        }
    }

    ngOnDestroy() {
      clearInterval(this.refresh)
    }


}