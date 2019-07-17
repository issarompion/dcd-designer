import { Component, Inject,PLATFORM_ID, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Thing,Property,PropertyType,server_url } from '../../classes'

import { Router} from '@angular/router';

import { DatePipe } from '@angular/common'


import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import {isPlatformServer} from "@angular/common";

@Component({
    selector: 'app-data-collection',
    templateUrl: './data_collection.component.html',
    styleUrls: ['./data_collection.component.css']
})
export class DataCollectionComponent implements OnInit {

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
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog
  ) {
    }

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Structured component server :'); // host on the server  
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      this.FillArrayThings(this.things) 
    }

    FillArrayThings(things : Thing[]) : void{
      this.http.get(server_url+'api/things')
      .toPromise().then(data1 => {
        data1['things'].forEach((thing,index) => {
          this.http.get(server_url+'api/things/'+thing.id)
        .toPromise().then(data2 => {
        things.push(new Thing(data2['thing']))

        if(index == data1['things'].length-1){
          this.FillDataCollectionArrayThing(3600000)
        }

        });
      });
    }).catch(err => {
      console.log('Error FillArray', err);
    })
    ;
    }

    FillDataCollectionArrayThing(time_s:number){
     const to : number = (new Date).getTime();
     const from : number = 0

     console.log('thisthing',this.things)
      var index_things = 0
    this.things.forEach((thing)=>{
        index_things ++
        var index_property = 0
       thing.thing_properties.forEach((property)=>{
         index_property ++
        this.http.get(server_url+'api/things/'+property.property_entitiy_id+'/properties/'+property.property_id+'?from='+from+'&to='+to)
        .toPromise().then(data => {
            this.AddRangeDate(data['property'].values,time_s)
            .then(()=>{
              console.log(index_property)
              if(index_things == this.things.length  && index_property == thing.thing_properties.length){
                //console.log('rangedat',this.rangesDates)
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
          thing.thing_properties.forEach((property)=>{
           this.http.get(server_url+'api/things/'+property.property_entitiy_id+'/properties/'+property.property_id+'?from='+from+'&to='+to)
           .toPromise().then(data => {
            if(data['property'].values.length > 0){
              /*const new_property = new Property(data['property'])
              new_property.property_entitiy_id =thing.thing_id*/
              property.property_values = data['property'].values
              this.updatething(new_thing.thing_name,property)
              }
           })
          })
        })
      });
    }

    updatething(thing_name:string,property:Property){
      this.data_collection_things.forEach(thing=>{
        if(thing.thing_name == thing_name){
          thing.update_properties([property])
        }
      })
    }

    contains(property_id:string,thing_properties:Property[]):boolean{
      for (var i = 0; i <= thing_properties.length; i ++) {
          if(i < thing_properties.length){
              if(property_id == thing_properties[i].property_id){
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
          //console.log('ts',ts)
          if(this.rangesDates.length > 0){
            var indexToChange = -1
            for (var i = 0; i <= this.rangesDates.length; i ++) {
              if(i < this.rangesDates.length){
                  const range = this.rangesDates[i]
                  if(ts > range[0] && ts < range[1]){
                    //on fait rien et break le for each
                    //console.log('ts > range[0] && ts < range[1]')
                    break;
                  }else{
                    if(ts<range[0]){
                      if(ts > range[0]-time_s){
                        // remplacer le premier date du range par celle la et break
                        //console.log('ts > range[0]-time_ms')
                        this.rangesDates[i][0] = ts
                        break;
                      }else{
                        // creer une nouvelle range avec cette date en premier et une heure après pour le 2e
                        // sauvegarder l'index
                        //console.log('< range [0]','indexToChange ='+i)
                        indexToChange = i
                      }
                    }
                    if(ts>range[1]){
                      if( ts < range[1]+time_s){
                        // remplacer la dernier data du range par celle la et break
                        //console.log('ts < range[1]+time_ms')
                        this.rangesDates[i][1] = ts
                        break;
                      }else{
                        // creer une nouvelle range avec cette date en premier et une heure après
                        //sauvegarder l'index
                        //console.log('> range [1]','indexToChange ='+i)
                        indexToChange = i
                      }
                    }
                  } 
              }else{
                  if(indexToChange!=-1){
                    //console.log('push', [ts,ts+time_ms])
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
      console.log("changePrecision",this.time_ms,event.value)
      this.FillDataCollectionArrayThing(this.time_ms)
    }


    descriptionT(thing:Thing):string {
      if(thing.thing_description == "" || thing.thing_description === undefined){
        return 'No description available'
      }else{
        return thing.thing_description
      }
    }
    descriptionP(property:Property):string {
      if(property.property_description == "" || property.property_description === undefined ){
        return 'No description available'
      }else{
        return property.property_description 
      }
    }

    HasProperty(thing:Thing):boolean{
      return thing.thing_properties.length > 0
    }

    async setChild(thing:Thing,property : Property){
      this.RangeTime = this.getRangeTime(thing)
      this.property_picked = property
    }

    showDialog_property(thing:Thing,property : Property) {
        this.setChild(thing,property).then(()=>this.display_property = true)
    }

    delete_property(property:Property){
      if ( confirm( "Delete "+property.property_name+" ?" ) ) {
        this.http.delete(server_url+'api/things/'+property.property_entitiy_id+'/properties/'+property.property_id)
       .toPromise().then(data => {
         window.location.reload(); //TODO make a reload req ?
       })
     }
    }

    nav_thing(thing:Thing){
      //console.log(thing.thing_description.split("-")[0])
      //console.log(thing.thing_description.split("-")[1])
      //const range = [parseInt(thing.thing_description)]
      const range = this.getRangeTime(thing)
      console.log(range)
      this.router.navigate(['/page/thing'], {
        state:{
          data:thing.json(),
          range:range
        }
      });
    }

    getRangeTime(thing:Thing):number[]{
      return [parseInt(thing.thing_description.split("-")[0],10),parseInt(thing.thing_description.split("-")[1],10)]
    }
    
  }