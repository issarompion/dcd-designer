import { Component,Input,SimpleChanges} from '@angular/core';
import {Property,Dimension} from '../../../classes'

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.css']
})

export class GoogleMapsComponent {

    @Input() entity_id:string
    @Input() values : any[]
    @Input() apiKey: string;
    @Input() checked: boolean;
    @Input() property_dimensions:any[]

    lat: number
    lng: number
    options
    markers : {} = {markers:[],fitBounds:true}

    showData : boolean = false
    ref : boolean = true 
    sliderSize:number = 0
    index_slider : number
    date:Date

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {

      if(!(changes.values === undefined)){
        this.refresh()
        const values:any[]  = changes.values.currentValue
        if(this.checked){
          this.show_realtime(values)
        }else{
          this.show_manual(values)
        }
      }
      }
    

     handleChange(e) {
        //e.value is the new value (is index)
        this.index_slider = e.value
        this.date = new Date(this.values[this.index_slider][0])
    }

    
    refresh() {
        this.ref = !this.ref
    }

    show_realtime(values:any[]){
      this.markers['markers']= []
      if(values.length>0){
          this.showData = true
          this.index_slider = values.length-1
          this.date = new Date(values[this.index_slider][0])
          const last_lat = values[this.index_slider][1]
          const last_lng = values[this.index_slider][2]

              this.lat = last_lat
              this.lng = last_lng
              if(last_lat !== undefined && last_lng !== undefined){
              this.markers={
                markers:  [
                  {
                    lat: last_lat,
                    lng: last_lng,
                    icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                    infoWindowOptions: {
                    content: this.entity_id +' '+values[this.index_slider][0]
                    }
                }
                ],
                fitBounds: false
                }
                this.options = {zoom: 9};
      }
    }
      else{
        this.showData = false
           this.lat = 1
           this.lng = 1
           this.markers={
             markers:  [],
             fitBounds: false
             }
           this.options = {zoom: 1};
      }
    }

    show_manual(values:any[]){
      this.markers['markers']= []
      this.sliderSize = values.length-1

      if(values.length>0){
              this.showData = true
              this.index_slider = values.length-1
              this.date = new Date(values[this.index_slider][0])

              const last_lat = values[this.index_slider][1]
              const last_lng = values[this.index_slider][2]

              this.lat = last_lat
              this.lng = last_lng

              for(var i = 0; i <= values.length-1; i++){
                    this.markers['markers'].push({
                        lat: values[i][1],
                        lng: values[i][2],
                        icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png',
                        infoWindowOptions: {
                        content: this.entity_id +' '+values[i][0]
                        }
                    })
                  }

             this.markers['fitBounds'] = true
             this.options = {zoom: 9};
          }else{
           this.showData = false
           this.lat = 1
           this.lng = 1
           this.markers={
             markers:  [],
             fitBounds: false
             }
           this.options = {zoom: 1};
          }
      }
}

  