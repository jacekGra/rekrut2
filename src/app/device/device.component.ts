import { Component, OnInit } from '@angular/core';
import { device } from './device';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {



  public dev: device;
  public dataLoaded: boolean = false;



  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    //
    this.getOneDevice(3);
  }

  getOneDevice(id: number): void{
    if(id === 0) {
      this.createEmptyDevice();
      this.dataLoaded = true;
      return;
    }
    this.deviceService.getOneDevice(id)
      .subscribe(
        (data: device) => { this.dev = data; this.dataLoaded = true; },
        (err) => { console.log(err); }
      );
  }


  isNewDevice(): boolean{
    if(this.dev.hasOwnProperty('id')) { return true; }
    return false;
  }

  createEmptyDevice(): void{
    const json = '{"ipAddress": "","ipAddressv6": "","country": "","password": "","version": "0.0"}';
    this.dev = JSON.parse(json);
  }

  submitForm(f: any): void{
     console.log(this.dev);
     this.deviceService.updateOneDevice(this.dev)
      .subscribe(
        (data: any) => { this.getOneDevice(data.id); }
      );
  }





}
