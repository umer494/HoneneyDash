import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Floor {
  name: string;
  rooms: Room[];
}

interface Room {
  name: string;
  temperature: number;
  airQualityIndex: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  floors: Floor[] = [];
  selectedFloor: Floor | null = null;
  selectedRoom: Room | null = null;
  private dashboardUrl = 'https://localhost:7175/api/Building/floors'; // Your API URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(this.dashboardUrl).subscribe({
      next: (response) => {
        console.log('API Response Data:', response); 

        
        if (response && response.floors && Array.isArray(response.floors.$values)) {
          
          this.floors = response.floors.$values.map((floor: any) => {
            return {
              name: floor.name,
              rooms: Array.isArray(floor.rooms?.$values) ? floor.rooms.$values : [] 
            };
          });
        } else {
          console.error('Floors data is missing or malformed in the API response');
        }
      },
      error: (error) => {
        console.error('API request failed:', error);
      },
      complete: () => {
        console.log('API request completed');
      }
    });
  }

  onFloorClick(floor: Floor): void {
    this.selectedFloor = floor;
    this.selectedRoom = null;
  }

  onRoomClick(room: Room): void {
    this.selectedRoom = room;
    this.selectedFloor = null;
  }

  getTemperatureColor(temperature: number): string {
    if (temperature <= 18) return 'green';
    if (temperature <= 25) return 'yellow';
    return 'red';
  }

  getAqiColor(aqi: number): string {
    return aqi > 50 ? 'red' : 'green';
  }

  getAverageTemperature(floor: Floor): number {
    if (!floor?.rooms || floor.rooms.length === 0) return 0;
    const totalTemperature = floor.rooms.reduce(
      (acc, room) => acc + room.temperature,
      0
    );
    return totalTemperature / floor.rooms.length;
  }

  getAverageAQI(floor: Floor): number {
    if (!floor?.rooms || floor.rooms.length === 0) return 0;
    const totalAQI = floor.rooms.reduce((acc, room) => acc + room.airQualityIndex, 0);
    return totalAQI / floor.rooms.length;
  }
}
