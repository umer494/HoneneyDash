
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Floor
{
  id:Number;
  name:string;
  rooms:Room[];
}
interface Room{
id:Number;
  name:string;
  temperature:number;
  aqi:number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  floors:Floor[]=[];
  selectedFloor:Floor | null=null;
  SelectedRoom: Room | null=null;

  constructor(private http: HttpClient){}
  ngOnInit(): void {
      
    this.http.get<Floor>('http://localhost:5050/api/Building').subscribe((floors)=>{

   
    this.floors=this.floors
     });
  }
  onFloorClick(floor:Floor):void{
    this.selectedFloor=floor;
    this.SelectedRoom=null;

  }
  getTemperatureColor(temperature:number):string{
    if(temperature<=18) return 'green';
   if(temperature<25) return 'yellow';
   else return 'red';
  }
  getAqiColor(aqi:number):string{
    return aqi>50 ?'red':'green';

  }
  getAverageTemperture(floor:Floor):number{
    const totalTemperature=floor.rooms.reduce(
      (acc, room)=>acc+room.temperature,
      0
    );
    return totalTemperature/floor.rooms.length;
  }
  getAverageAQI(floor:Floor):number{
    const totalAQI=floor.rooms.reduce((acc,room)=>acc+room.aqi,0);
    return totalAQI/floor.rooms.length;
  }



}
