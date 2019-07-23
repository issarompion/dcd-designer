import { Component, Inject,PLATFORM_ID} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Thing,Property} from '../../classes'
import { Router} from '@angular/router';
import {HttpClientService} from '../httpclient.service'
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'app-type-collection',
  templateUrl: './type_collection.component.html',
  styleUrls: ['./type_collection.component.css']
})
export class TypeCollectionComponent {

  things : Thing[] = []
  structured_things : Thing[] = []
  //Dialog property
  display_property: boolean = false;
  property_picked:Property = new Property({})

  constructor(
    private router: Router,
    private service: HttpClientService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialog: MatDialog
  ) {
    }

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Type Collection component server'); // host on the server  
        } else {
         this.BrowserUniversalInit()
      }
    }

    BrowserUniversalInit(){
      this.FillStructuredArrayThing(this.structured_things)
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
          description : property.property_type,
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
      this.service.get('api/things').subscribe(
        data => {
        data['things'].forEach(thing_json => {
          this.service.get('api/things/'+thing_json.id).subscribe(
          data => {
          if(data['thing'].properties.length == 0){
            alert("No property available")
            this.router.navigate(['/page/things'])
          }else{
            data['thing'].properties.forEach(prop_json=>{
              const property = new Property(prop_json)
              this.AddProperty(str_things,property)
            })
          }
        });
      });
    });
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

    async setChild(property : Property){
      this.property_picked = property
    }

    showDialog_property(property : Property) {
        this.setChild(property).then(()=>this.display_property = true)
        
    }

    delete_property(property:Property){
      if ( confirm( "Delete "+property.property_name+" ?" ) ) {
        this.service.delete('api/things/'+property.property_entitiy_id+'/properties/'+property.property_id).subscribe(
        data => {
         window.location.reload(); //TODO make a reload req ?
       })
     }
    }

    nav_thing(thing:Thing){
      this.router.navigate(['/page/thing'], {
        state:{data:thing.json()}});
    }

  }