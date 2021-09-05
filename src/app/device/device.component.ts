import { Component, OnInit, Input } from '@angular/core';
import { device } from './device';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {


  @Input() gridView;
  public dev: device;
  public dataLoaded: boolean = false;
  public deviceList: device[];
  private lastDataURL: string;
  public pagination = [];



  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    //
    this.getOneDevice(0);
  }

  getOneDevice(id: number): void{
    this.gridView = false;
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
        (data: any) => { 
          this.getOneDevice(data.id); 
          this.deviceService.getPagination()
                .subscribe(
                  (hd) => {
                    this.pagination = [];
                    this.parseLinkHeader(hd.headers.get('Link'));
                    this.gridView = true;
                    this.gotoPage('last');
                  }
                );
        }
      );
  }

  populateList(url: string = ''): void{
    this.gridView = true;
    this.dataLoaded = false;
    this.lastDataURL = url;
    this.deviceService.getList(url)
      .subscribe(
        (data: device[]) => {
          console.log(data);
          this.deviceList = data;
          this.deviceService.getPagination(url)
            .subscribe(
              (hd) => {
                this.pagination = [];
                this.parseLinkHeader(hd.headers.get('Link'));
              },
              (err) => { console.log(err); },
              () => { this.dataLoaded = true; }
            )
        },
        (err) => { console.log(err); }
      );
  }

  parseLinkHeader( linkHeader ): void {
    console.log(linkHeader)
    Object.keys(this.pagination).forEach(key => {
      delete this.pagination[key];
    });
    const linkHeadersArray = linkHeader.split( ', ' ).map( header => header.split( "; " ) );
    const linkHeadersMap = linkHeadersArray.map( header => {
       const thisHeaderRel = header[1].replace( /"/g, "" ).replace( "rel=", "" );
       const thisHeaderUrl = header[0].slice( 1, -1 );
       this.pagination[thisHeaderRel] = thisHeaderUrl;
       console.log(this.pagination);
    } );
  }


  pageNotExists(prop: string): boolean{
    if(this.pagination.hasOwnProperty(prop)) { return false; }
    return true;
  }

  gotoPage(prop: string): void{
    if(!this.pageNotExists(prop) ) {
      this.populateList(this.pagination[prop]);
    }
  }

  edit(id: number){
    this.dataLoaded=false;
    this.gridView = false;
    this.getOneDevice(id);
  }

  delete(id: number): void{
    if( confirm("Confirm!")){
      this.deviceService.deleteOneDevice(id)
        .subscribe(
          (data) => { 
            if(this.pagination['last'] == this.lastDataURL) {
              this.deviceService.getPagination()
                .subscribe(
                  (hd) => {
                    this.pagination = [];
                    this.parseLinkHeader(hd.headers.get('Link'));
                    this.gotoPage('last');
                  }
                );
            }
            else { this.populateList(this.lastDataURL); }
           }
        );
    }
  }


}
