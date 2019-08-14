import { Component,Inject,PLATFORM_ID, OnInit } from '@angular/core';
import { PropertyType, HttpClientService } from '@datacentricdesign/ui-angular'
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  new_task_name : string
  new_task_types : string[]
  new_task_range : Date[]
  dateTime = new Date();

  stat_task_type : string = "LOCATION"
  stat_task_range : Date[]

  total_persons : number
  total_things : number
  total_properties : number

  type_total_entities : number
  type_total_properties : number
  type_total_values : number

  type_range_entities : number
  type_range_properties : number
  type_range_values : number
  

  constructor(@Inject(
    PLATFORM_ID) private platformId: Object,
    private service: HttpClientService
  ) {}

    ngOnInit(): void {
      if (isPlatformServer(this.platformId)) {
        console.log('Init Task component server'); // host on the server 
        } else {
         this.BrowserUniversalInit()
      }
    }

EntitiesPercentage():number{
if(this.type_total_entities && this.type_total_entities){
  return Math.round((this.type_range_entities/this.type_total_entities)*100)
}else{
  return 0
}
}

PropertiesPercentage():number{
  if(this.type_total_properties && this.type_range_properties){
    return Math.round((this.type_range_properties/this.type_total_properties)*100)
  }else{
    return 0
  }
}

ValuesPercentage():number{
  if(this.type_total_values && this.type_total_values){
    return Math.round((this.type_range_values/this.type_total_values)*100)
  }else{
    return 0
  }
}

GetStatsValues(PropertyType:string,from:number=undefined,to:number=undefined){
  if(from && to){
    this.service.get('api/stats/'+PropertyType+'?from=' + from + '&to=' + to).subscribe(
      data => {
        this.type_total_entities = data['stat'].total_entities
        this.type_total_properties = data['stat'].total_properties
        this.type_total_values = data['stat'].total_values
        
        this.type_range_entities = data['stat'].total_entities
        this.type_range_properties = data['stat'].range.properties
        this.type_range_values = data['stat'].range.values
      })
  }else{
    this.service.get('api/stats/'+PropertyType).subscribe(
      data => {
        this.type_total_entities = data['stat'].total_entities
        this.type_total_properties = data['stat'].total_properties
        this.type_total_values = data['stat'].total_values
        
        this.type_range_entities = data['stat'].total_entities
        this.type_range_properties = data['stat'].range.properties
        this.type_range_values = data['stat'].range.values
      })
  }
  
}

OnChange(){
if(this.stat_task_range){
  if(this.stat_task_range.length == 2){
    if(this.stat_task_range[0] && this.stat_task_range[1]){
      this.GetStatsValues(this.stat_task_type,this.stat_task_range[0].getTime(),this.stat_task_range[1].getTime())
    }
  }else{
    this.GetStatsValues(this.stat_task_type)
  }
}else{
    this.GetStatsValues(this.stat_task_type)
}

}

BrowserUniversalInit(){
      this.service.get('api/stats').subscribe(
        data => {
          this.total_persons = data['stat'].persons
          this.total_things = data['stat'].things
          this.total_properties = data['stat'].properties
        })
      
      this.GetStatsValues(this.stat_task_type)
}

GetPropertyType():string[]{
    const res : string[] = []
    for(var type in PropertyType) {
      res.push(type)
    }
    return res
}

CreateTask(task_name:string,task_types:string[],task_range:Date[]){
    console.log(task_name,task_types,task_range)
}

CheckTask():boolean{
     if(this.new_task_name && this.new_task_types && this.new_task_range){
       if(this.new_task_types.length>0 && this.new_task_range.length==2){
        return false
       }else{
         return true
       }   
     }else{
       return true
     }
}
}

export class Task {
  name: string;
  types:string[];
  from : number 
  to : number 

  constructor(name:string,types:string[],from:number,to:number){
    this.name = name
    this.types = types
    this.from = from
    this.to = to
  }
}
