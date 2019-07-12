import { Component, Inject, Optional,PLATFORM_ID, OnInit} from '@angular/core';
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
  displayedColumns: string[] = ['name', 'type', 'settings'];
  //Dialog property
  display_property: boolean = false;
  thing_picked:Thing = new Thing ({thing_id:'test'})
  property_picked:Property = new Property({})

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('serverUrl') protected serverUrl: string,
    @Optional() @Inject('token') protected token: string,
    public dialog: MatDialog
  ) {
    }

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Home component server :', this.token,this.serverUrl); // host on the server  
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


  export interface DialogData {
    name: string;
    type:string;
    description:string;
    thing:Thing;
    jwt:string;
  }
  
  @Component({
    selector: 'dialog-add-thing',
    template: `
    <h1 mat-dialog-title>Add Thing</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <input matInput [(ngModel)]="data.name" placeholder="Name">
    </mat-form-field>
    <mat-form-field>
      <input matInput [(ngModel)]="data.type" placeholder="Type">
    </mat-form-field>
    <mat-form-field>
      <input matInput [(ngModel)]="data.description" placeholder="Description">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button *ngIf = "data.name != '' && data.name != undefined " mat-button [mat-dialog-close]="data" cdkFocusInitial>Create</button>
  </div>
  `
  })
  export class DialogAddThing {
  
    constructor(
      public dialogRef: MatDialogRef<DialogAddThing>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  @Component({
    selector: 'dialog-add-property',
    template: `
    <h1 mat-dialog-title>Add Property to {{data.thing.thing_name}}</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <input matInput [(ngModel)]="data.name" placeholder="Name">
    </mat-form-field>
    <mat-form-field>
    <mat-label>Type</mat-label>
    <mat-select [(ngModel)]="data.type">
      <mat-option *ngFor="let type of GetPropertyType()" [value]="type">
        {{type}}
      </mat-option>
    </mat-select>
  </mat-form-field>
    <mat-form-field>
      <input matInput [(ngModel)]="data.description" placeholder="Description">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button *ngIf = "data.name != '' && data.name != undefined && data.type != '' && data.type != undefined " mat-button [mat-dialog-close]="data" cdkFocusInitial>Create</button>
  </div>
  `
  })
  export class DialogAddProperty {
  
    constructor(
      public dialogRef: MatDialogRef<DialogAddThing>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    GetPropertyType():string[]{
      const res : string[] = []
      for(var type in PropertyType) {
        res.push(type)
      }
      return res
    }
  
  }
  
  
  @Component({
    selector: 'dialog-add-jwt',
    template: `
    <h1 mat-dialog-title>JWT {{data.thing.thing_name}}</h1>
    <div mat-dialog-content>
    <mat-form-field>
      <input matInput type="text"[value]="data.jwt"  #inputTarget readonly>
    </mat-form-field>
    </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button [ngxClipboard]="inputTarget" [mat-dialog-close]="data" cdkFocusInitial>Copy</button>
  </div>
    `
  })
  export class DialogJWT {
  
    constructor(
      public dialogRef: MatDialogRef<DialogAddThing>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }