import { Component,Inject,PLATFORM_ID, OnInit } from '@angular/core';
import { PropertyType,Task, Resource, Milestone, HttpClientService } from '@datacentricdesign/ui-angular'
import {isPlatformServer} from "@angular/common";

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  actor_entity_id :string

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
    data1 => {
      data1['tasks'].actor_tasks.forEach(task_params => {
        const params_task = task_params
        this.service.get('api/tasks/'+task_params['id']+'/resources?actor=true').subscribe(
          data2 => {
            this.tasks.push(new Task(params_task,data2['resources']))
          })
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
  if ( confirm( "Create "+task_name+", asking for "+task_types.join()+" from : "+task_range[0]+", to : "+task_range[1]+ " ?" )) {
    const task_json = {
      name: task_name,
      description: task_description,
      types: task_types,
      from : task_range[0].getTime(),
      to : task_range[1].getTime(),
      actor_entity_id : this.actor_entity_id
  }
    this.service.post('api/tasks',task_json).subscribe(
      data1 => {
        let task_params = data1['task']
        this.service.get('api/tasks/'+task_params.id+'/resources?actor=true').subscribe(
          data2 => {
            let task = new Task(task_params,data2['resources'])
            task.registered_at = Date.now()
            this.tasks.push(task)
          })
      }
    )
  }
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
// Just checking if there is more than the initial milestone by resources
const num_resources = task.resources.length
let num_responses = 0
let check_number = 0

for(var resource of task.resources){
check_number ++

if(resource.milestones.length>1){
num_responses ++
}

if(check_number == num_resources){
  return Math.ceil((num_responses/num_resources)*100)
}

}

}

getDate(n:number){
  return new Date(n)
}

async setChild(task : Task){
  this.task_picked = task
}

showDialog_Task(task : Task) {
    this.setChild(task).then(()=>this.display_task = true)  
}

}