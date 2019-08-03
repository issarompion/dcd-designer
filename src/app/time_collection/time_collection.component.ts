import { Component, Inject,PLATFORM_ID} from '@angular/core';
import { Thing,Property} from '../../classes'
import { Router} from '@angular/router';
import {HttpClientService} from '../httpclient.service'
import {isPlatformServer} from "@angular/common";
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-time-collection',
  templateUrl: './time_collection.component.html',
  styleUrls: ['./time_collection.component.css']
})
export class TimeCollectionComponent {

    things : Thing[] = []
    data_collection_things : Thing[] = []
    rangesDates : number[][] = []
    time_ms : number = 3600000 // 1 hous in ms
    RangeTime:number[]
  
    precisions: {}[] = [
      {value: 60000, viewValue: '1 minutes'},
      {value: 600000, viewValue: '10 minutes'},
      {value: 1800000, viewValue: '1/2 hour'},
      {value: 3600000, viewValue: '1 hour'},
      {value: 14400000, viewValue: '4 hours'},
      {value: 43200000, viewValue: '12 hours'},
      {value: 86400000, viewValue: '24 hours'},
    ];
  
    //Dialog property
    display_property: boolean = false;
    property_picked:Property = new Property({})
  
    constructor(
      public datepipe: DatePipe,
      private router: Router,
      private service: HttpClientService,
      @Inject(PLATFORM_ID) private platformId: Object
    ) {
      }
  
      ngOnInit(): void {
        if (isPlatformServer(this.platformId)) {
          console.log('Init TimeCollection component server :')
          } else {
           this.BrowserUniversalInit()
        }
      }
  
      BrowserUniversalInit(){
        this.FillArrayThings(this.things) 
      }
  
      FillArrayThings(things : Thing[]) : void{
        this.service.get('api/things').subscribe(
          data1 => {
          data1['things'].forEach((thing,index) => {
            this.service.get('api/things/'+thing.id).subscribe(
              data2 => {
              things.push(new Thing(data2['thing']))
  
              if(index == data1['things'].length-1){
                this.FillDataCollectionArrayThing(3600000)
              }
          });
        });
      });
      }
  
      FillDataCollectionArrayThing(time_s:number){
        this.rangesDates = []
        this.data_collection_things =[]
       const to : number = (new Date).getTime();
       const from : number = 0
  
        var index_things = 0
      this.things.forEach((thing)=>{
          index_things ++
          var index_property = 0
         thing.properties.forEach((property)=>{
           index_property ++
          this.service.get('api/things/'+property.entitiy_id+'/properties/'+property.id+'?from='+from+'&to='+to).subscribe(
            data => {
              this.AddRangeDate(data['property'].values,time_s)
              .then(()=>{
                if(index_things == this.things.length  && index_property == thing.properties.length){
                  this.AddThing(this.rangesDates)
                }
              })
          })
         })
       })
      }
  
      AddThing(rangesDates){
        this.data_collection_things = []
        rangesDates.forEach(range => {
          const from = range[0]
          const to = range[1]
          const from_date = new Date(from)
          const to_date = new Date(to)
          let from_date_pipe =this.datepipe.transform(from_date, 'yyyy-MM-dd HH:mm:ss');
          let to_date_pipe = this.datepipe.transform(to_date, 'yyyy-MM-dd HH:mm:ss');
          const new_thing = new Thing({
            name : 'from ' + from_date_pipe + ' to ' + to_date_pipe,
            description : from + '-' + to
          })
          this.data_collection_things.push(new_thing)
  
          this.things.forEach((thing)=>{
            thing.properties.forEach((property)=>{
             this.service.get('api/things/'+property.entitiy_id+'/properties/'+property.id+'?from='+from+'&to='+to).subscribe(
              data => {
              if(data['property'].values.length > 0){
                property.values = data['property'].values
                this.updatething(new_thing.name,property)
                }
             })
            })
          })
        });
      }
  
      updatething(thing_name:string,property:Property){
        this.data_collection_things.forEach(thing=>{
          if(thing.name == thing_name){
            thing.update_properties([property])
          }
        })
      }
  
      contains(property_id:string,thing_properties:Property[]):boolean{
        for (var i = 0; i <= thing_properties.length; i ++) {
            if(i < thing_properties.length){
                if(property_id == thing_properties[i].id){
                    return true
                }
            }else{
                return false
            }
          }
    }
  
      async AddRangeDate(values:any[],time_s:number):Promise<any>{
        if(values.length>0){
          values.forEach(value=>{
            const ts = value[0]
            if(this.rangesDates.length > 0){
              var indexToChange = -1
              for (var i = 0; i <= this.rangesDates.length; i ++) {
                if(i < this.rangesDates.length){
                    const range = this.rangesDates[i]
                    if(ts > range[0] && ts < range[1]){
                      //on fait rien et break le for each
                      break;
                    }else{
                      if(ts<range[0]){
                        if(ts > range[0]-time_s){
                          // remplacer le premier date du range par celle la et break
                          this.rangesDates[i][0] = ts
                          break;
                        }else{
                          // creer une nouvelle range avec cette date en premier et une heure après pour le 2e
                          // sauvegarder l'index
                          indexToChange = i
                        }
                      }
                      if(ts>range[1]){
                        if( ts < range[1]+time_s){
                          // remplacer la dernier data du range par celle la et break
                          this.rangesDates[i][1] = ts
                          break;
                        }else{
                          // creer une nouvelle range avec cette date en premier et une heure après
                          //sauvegarder l'index
                          indexToChange = i
                        }
                      }
                    } 
                }else{
                    if(indexToChange!=-1){
                      this.rangesDates.push([ts,ts+time_s])
                      break;
                    }
                }
              }
            }else{
              this.rangesDates.push([ts,ts+time_s])
              return
            }
          })
        }else{
          return
        }
      }
  
      changePrecision(event){
        this.FillDataCollectionArrayThing(this.time_ms)
      }
  
  
      descriptionT(thing:Thing):string {
        if(thing.description == "" || thing.description === undefined){
          return 'No description available'
        }else{
          return thing.description
        }
      }
      descriptionP(property:Property):string {
        if(property.description == "" || property.description === undefined ){
          return 'No description available'
        }else{
          return property.description 
        }
      }
  
      HasProperty(thing:Thing):boolean{
        return thing.properties.length > 0
      }
  
      async setChild(thing:Thing,property : Property){
        this.RangeTime = this.getRangeTime(thing)
        this.property_picked = property
      }
  
      showDialog_property(thing:Thing,property : Property) {
          this.setChild(thing,property).then(()=>this.display_property = true)
      }
  
      delete_property(property:Property){
        if ( confirm( "Delete "+property.name+" ?" ) ) {
          this.service.delete('api/things/'+property.entitiy_id+'/properties/'+property.id).subscribe(
          data => {
           window.location.reload(); //TODO make a reload req ?
         })
       }
      }
  
      nav_thing(thing:Thing){
        const range = this.getRangeTime(thing)
        this.router.navigate(['/page/thing'], {
          state:{
            data:thing.json(),
            range:range
          }
        });
      }
  
      getRangeTime(thing:Thing):number[]{
        return [parseInt(thing.description.split("-")[0],10),parseInt(thing.description.split("-")[1],10)]
      }
      
    }