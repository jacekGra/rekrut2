import { Component, ViewChild } from '@angular/core';
import { DeviceComponent } from './device/device.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rekrut2';
  public gridView: boolean = false;
  @ViewChild(DeviceComponent) child: DeviceComponent;


  openList(): void{
    this.gridView = true;
    this.child.populateList();
  }

  newDevice(): void{
    this.gridView = false;
    this.child.getOneDevice(0);
  }
}
