import { Component,Inject,PLATFORM_ID, OnInit } from '@angular/core';
import { PropertyType,Task, Resource, Milestone, HttpClientService} from '@datacentricdesign/ui-angular'
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  actor_entity_id :string = 'irompion@yahoo.fr'

  display_task : boolean = false
  task_picked : Task = new Task({})

  tasks:Task[] = []

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
  this.service.get('api/user').subscribe(
    data => {
      this.actor_entity_id = data['sub'].split('dcd:persons:')[1]
    })
  
  this.service.get('api/tasks').subscribe(
    data => {
      console.log('data',data['tasks'].actor_tasks)
      data['tasks'].actor_tasks.forEach(task_params => {
        //console.log(task_params)
        this.tasks.push(new Task(task_params))
      });
    })
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
      new Task({
        name: task_name,
        description: task_description,
        types: task_types,
        from : task_range[0].getTime(),
        to : task_range[1].getTime(),
        actor_entity_id : 'irompion@yahoo.fr'
    })
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

async setChild(task : Task){
  this.task_picked = task
}

showDialog_Task(task : Task) {
    this.setChild(task).then(()=>this.display_task = true)  
}

}