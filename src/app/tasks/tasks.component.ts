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

CreateTask(task_name:string,task_types:string[],task_range:Date[]){
    console.log(task_name,task_types,task_range)
    this.tasks.push(new Task(undefined,task_name,task_types,task_range[0].getTime(),task_range[1].getTime()))
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
task_picked : Task = new Task('','',undefined,undefined,undefined)

tasks:Task[] = [
  new Task('id1','task1',undefined,undefined,undefined),
  new Task('id2','task2',undefined,undefined,undefined),
  new Task('id3','task3',undefined,undefined,undefined),
]

}

export class Task {
  id : string
  name: string;
  types:string[];
  from : number 
  to : number 

  constructor(id:string,name:string,types:string[],from:number,to:number){
    this.id = id
    this.name = name
    this.types = types
    this.from = from
    this.to = to
  }
}
