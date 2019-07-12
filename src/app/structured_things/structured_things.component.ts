import { Component, Inject,PLATFORM_ID, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Thing,Property,PropertyType,server_url } from '.../../../classes'

import { Router} from '@angular/router';


import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import {isPlatformServer} from "@angular/common";
import { stringify } from '@angular/compiler/src/util';


@Component({
    selector: 'app-structured-things',
    templateUrl: './structured_things.component.html',
    styleUrls: ['./structured_things.component.css']
})
export class StructuredThingsComponent implements OnInit {

  things : Thing[] = []
  structured_things : Thing[] = []

  constructor(
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
      this.FillStructuredArrayThing(this.structured_things)
    }

    FillArrayThings(things : Thing[]) : void{
      this.http.get(server_url+'api/things')
      .toPromise().then(data => {
        data['things'].forEach(thing => {
          this.http.get(server_url+'api/things/'+thing.id)
        .toPromise().then(data => {
        things.push(new Thing(data['thing']))
        });
      });
    }).catch(err => {
      console.log('Error FillArray', err);
    })
    ;
    }

    AddProperty(str_things : Thing[],property:Property){
      if(this.contains(str_things,property.property_type)){
        str_things.forEach(str_thing => {
          if (str_thing.thing_name == property.property_type){
            str_thing.thing_properties.push(property)
          }
      })
      }else{
        const new_thing = new Thing({
          name : property.property_type,
          type : property.property_type,
          properties : [property]
        })
        //new_thing.thing_properties.push(property)
        str_things.push(new_thing)
      }
    }

    //Property.type == thing name
    contains(str_things : Thing[],thing_name_or_property_type:string):boolean{
      for (var i = 0; i <= str_things.length; i ++) {
        if(i < str_things.length){
            if(thing_name_or_property_type == str_things[i].thing_name){
                return true
            }
        }else{
            return false
        }
      }
    }

    FillStructuredArrayThing(str_things : Thing[]) : void{
      this.http.get(server_url+'api/things')
      .toPromise().then(data => {
        data['things'].forEach(thing_json => {
          this.http.get(server_url+'api/things/'+thing_json.id)
        .toPromise().then(data => {
          data['thing'].properties.forEach(prop_json=>{
            const property = new Property(prop_json)
            this.AddProperty(str_things,property)
          })
        });
      });
    }).catch(err => {
      console.log('Error FillStructuredArray', err);
    })
    }

    descriptionT(thing:Thing):string {
      if(thing.thing_description == "" || thing.thing_description === undefined){
        return 'No description available'
      }else{
        return thing.thing_description
      }
    }

    HasProperty(thing:Thing):boolean{
      return thing.thing_properties.length > 0
    }

  }