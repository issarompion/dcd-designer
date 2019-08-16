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
  new_task_description:string
  dateTime = new Date();
  

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

BrowserUniversalInit(){
}

GetPropertyType():string[]{
    const res : string[] = []
    for(var type in PropertyType) {
      res.push(type)
    }
    return res
}

CreateTask(task_name:string,task_types:string[],task_range:Date[],task_description:string){
    console.log(task_name,task_types,task_range,task_description)
    this.tasks.push(
      new Task(
        undefined,
        task_name,
        task_types,
        task_range[0].getTime(),
        task_range[1].getTime(),
        task_description,
        new Date().getTime(),
        'irompion@yahoo.fr'
        )
      )
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

TaskPercentage(task:Task):number{
return 50
}

OnChange(){
  //console.log(this.new_task_types)
}

display_task : boolean = false
task_picked : Task = new Task('','',undefined,undefined,undefined,undefined,undefined,undefined)

tasks:Task[] = [

new Task(
  'id1',
'task1',
['LOCATION'],
0,
new Date().getTime(),
"We wan't your location for a study",
new Date(2019,1,1).getTime(),
'actor_entity_id1'
),

new Task(
  'id3',
'task3',
['THREE_DIMENSIONS'],
new Date(2019,3,1).getTime(),
new Date().getTime(),
"We wan't your location for a study",
new Date(2019,3,1).getTime(),
'actor_entity_id1'
)

]

async setChild(task : Task){
  this.task_picked = task
}

showDialog_Task(task : Task) {
    this.setChild(task).then(()=>this.display_task = true)
    
}

}

export class Task {

  id : string
  name: string;
  types:string[];
  from : number 
  to : number 
  description:string
  registred_at:number
  actor_entity_id : string

  constructor(
    id:string,
    name:string,
    types:string[],
    from:number,
    to:number,
    description:string,
    registred_at:number,
    actor_entity_id : string
    ){
    this.id = id
    this.name = name
    this.types = types
    this.from = from
    this.to = to
    this.description = description
    this.registred_at = registred_at
    this.actor_entity_id = actor_entity_id
  }

  getDate():Date{
    return new Date(this.registred_at)
  }

}