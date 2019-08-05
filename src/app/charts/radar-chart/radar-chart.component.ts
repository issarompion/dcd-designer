import { Component,Input, SimpleChanges} from '@angular/core';
import {Property,Dimension} from '../../../classes'
import { ChartDataSets, ChartType, RadialChartOptions} from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
    selector: 'app-radar-chart',
    templateUrl: './radar-chart.component.html',
    styleUrls: ['./radar-chart.component.css']
})

export class RadarChartComponent {

    @Input() values: any[];
    @Input() property_type: string;
    @Input() property_dimensions: any[];

         radarChartOptions: RadialChartOptions = {responsive: true}
         colors = [{backgroundColor: 'rgba(103, 58, 183, .1)',borderColor: 'rgb(103, 58, 183)',pointBackgroundColor: 'rgb(103, 58, 183)',pointBorderColor: '#fff',pointHoverBackgroundColor: '#fff',pointHoverBorderColor: 'rgba(103, 58, 183, .8)'},];
         radarChartType: ChartType = 'radar';
         radarChartLabels: Label[] = []
         radarChartData: ChartDataSets[];

         showData : boolean = false
         index_slider : number = 0
         sliderSize:number = 0
         date:Date

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {

      if(!(changes.values === undefined)){
        const values:any[] = changes.values.currentValue
        this.sliderSize = values.length -1
 
        if(values.length>0){
               this.showData = true
               this.index_slider = values.length-1
               this.date = new Date(this.values[this.index_slider][0])
               this.radarChartLabels = []
               var last_data:number[] = []
               var maxValue : number = 0

               for( var i = 0; i<=this.property_dimensions.length;i++){
                if(i == this.property_dimensions.length){
                  this.radarChartOptions = {responsive: true,scale: {ticks: {beginAtZero: true,min: 0,max: maxValue+1,stepSize: 1},}}
                  this.radarChartData = [{data:last_data,label:this.property_type}]
                }else{
                const value =  values[this.index_slider][i+1]
                last_data.push(value)
                this.radarChartLabels.push(this.property_dimensions['name'])
                if (maxValue < value){maxValue = value}
                }
               }

            }else{
              this.showData = false
              this.radarChartData = [{data:[],label:this.property_type}]
            }
      }

    }

    handleChange(e) {
        //e.value is the new value (is index)
        this.index_slider = e.value
        this.date = new Date(this.values[this.index_slider][0])
        var last_data:number[] =  []
        var maxValue : number = 0

               for( var i = 0; i<=this.property_dimensions.length;i++){
                if(i == this.property_dimensions.length){
                  this.radarChartOptions.scale.ticks.max = maxValue+1
                  this.radarChartData[0].data = last_data
                }else{
                  const value =  this.values[this.index_slider][i+1]
                  last_data.push(value)
                  if (maxValue < value){maxValue = value}
                  }
          }
    }
}