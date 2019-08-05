import { Component,Input, SimpleChanges} from '@angular/core';
import {Property,Dimension} from '../../../classes'

@Component({
    selector: 'app-double-dimension-chart',
    templateUrl: './double-dimension-chart.component.html',
    styleUrls: ['./double-dimension-chart.component.css']
})

export class DoubleDimensionChartComponent {

    //@Input() dimensions: Dimension[];
    @Input() values : any[]
    @Input() property_dimensions:any[]
    dimensions: Dimension[] = []
    sliderSize:number = 0
    showData : boolean = false
    index_slider : number
    date:Date

    view:any[]

     colorScheme = {
       name: 'coolthree',
       selectable: true,
       group: 'Ordinal',
       domain: [
         '#01579b', '#7aa3e5', '#a8385d', '#00bfa5'
       ]
     };
     gradient = false;
     showXAxis = true;
     showYAxis = true;
     showLegend = false;
     showXAxisLabel = true;
     showYAxisLabel = true;
     xAxisLabel = 'Date';
     yAxisLabel = '';
     yAxisLabel2 = '';
     autoScale = true;
     timeLine = true;
     animations = false;
     tooltipDisabled = false;
   
     // data for charts
     multi : any = [{name: '',series: [{name: '',value: 0}]}];

     onResize(event) {
      this.view = [event.target.innerWidth / 1.35, 400];
  }

     constructor() {}

     ngOnChanges(changes: SimpleChanges) {

      if(!(changes.values === undefined)){
        const values = changes.values.currentValue 
        if(values.length>0){
              this.multi =  []
              this.showData = true
              this.sliderSize = values.length-1
              this.index_slider = values.length-1
              this.date = new Date(values[this.index_slider][0])
              this.dimensions =  []

              for(var i = 0; i <= this.property_dimensions.length; i++){
                if(i == this.property_dimensions.length ){
                  for(let value of this.dimensions){
                    if(this.multi.length == 0){
                      if(value.unit != undefined && value.unit != ''){
                        this.yAxisLabel = value.dimension +' ('+value.unit+' )'
                      }else{
                        this.yAxisLabel = value.dimension +' (no unit)'
                      }
                      this.multi.push({
                        name : value.dimension,
                        series:value.data
                        })
    
                    }else{
                      if(value.unit != undefined && value.unit != ''){
                        this.yAxisLabel2 = value.dimension +' ('+value.unit+' )'
                      }else{
                        this.yAxisLabel2 = value.dimension +' (no unit)'
                      }
                      this.multi.push({
                        name : value.dimension,
                        secondAxis:true,
                        series:value.data
                        })
                    }
                  }
                }else{
                const dim_name =  this.property_dimensions[i].name
                const dim_unit = this.property_dimensions[i].unit
                const index = i
                this.dimensions.push(new Dimension(
                  '',
                  '',
                  dim_name,
                  dim_unit,
                  Dimension.getData(index,values)
                  ))

                }
              }
            }else{
              this.multi = [{name: '',series: [{name: '',value: 0}]}]
            }
          }
       }
  
       handleChange(e) {
        //e.value is the new value (is index)
        this.index_slider = e.value
        this.date = new Date(this.values[this.index_slider][0])
    }

}