import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { TableListService } from './table-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from './../../../environments/environment';
// import { ItemFormService } from '../item-form/item-form.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  title = ''
  url = ''
  redirectUrl = ''
  data? = {}
  ccompania : any = null
  tableId = ''
  tableExtraInfo = 'Cargando Datos...'
  tableInfo = []
  extraInfo = []

  tableData: any = []
  noCreate = false
  filtersData: any[] = []
  filterValue:any = ''
  filters: any[] = []
  infoUrl = ''
  createUrl = ''
  sub = new Subscription()
  
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    // public TableListService: TableListService,
    // private ItemFormService: ItemFormService
  ) {}

  openSnackBarLoading() {
    this._snackBar.open('Cargando datos...', '');
  }
  closeSnackBar() {
    this._snackBar.dismiss();
  }
  ngOnInit() {
    this.openSnackBarLoading()
    this.route.url.subscribe( v => {
      
      let url = this.router.url
      if(v[2]){
        this.filterValue = parseInt(v[2].path)
        url = url.slice(0, -1)
        const urlSplited = url.split('/')
        urlSplited.splice(0,1)
        urlSplited.pop()
        urlSplited.pop()
        console.log(urlSplited);
        url = '/'+ urlSplited.join('/')
        console.log(url)
        console.log(this.filterValue);
      }
      this.infoUrl = `${url}/info/`
      // this.infoUrl = `${url}/`
      this.createUrl = `${url}/create`
    });
    this.sub = this.route.data.subscribe(v => {
      this.title = v.title
      this.url = v.url
      this.noCreate = v.noCreate
      this.redirectUrl = v.redirectUrl
      this.tableInfo = v.tableInfo
      this.tableId = v.tableId
      this.ccompania = localStorage.getItem('ccompania');
      
      if(v.filtersData) {
        this.filtersData = v.filtersData
        console.log(this.filtersData);
        if(v.filterDefaultKey) {
          const filterDefaultItem = this.filtersData.find(item=> item.key == v.filterDefaultKey)
          filterDefaultItem.controlValue = this.filterValue
          console.log(filterDefaultItem);
        }
      }
      
      if (v.extraInfo) {
        this.extraInfo = v.extraInfo
      }
    });
    
    this.displayedColumns = this.tableInfo.map(item => item.key)
    this.extraInfo.forEach(item => {

      this.displayedColumns.push(item.action)
    })

    this.http.post(environment.apiUrl + this.url, {}).subscribe((data) => {
      console.log(data)
      let dataRecived:any = []
      if(data['data']){
        dataRecived = data['data']
        if(this.extraInfo.length > 0) {
          dataRecived = dataRecived.map(item => {
            if (!item.id) {
              const primary_key = this.tableInfo.find(infoItem => infoItem.primary_key == true)
              item.id = item[primary_key.key]
            }
            if(this.redirectUrl) {
              for (const iterator of this.extraInfo) {
                iterator.url = this.redirectUrl
              }
            }
            item.extraInfo = this.extraInfo         
            return item
          })
        }
        
      } else {
        this.tableExtraInfo = 'No hay datos que coincidan con el filtro'
      }
      this.dataSource.data = dataRecived
      this.closeSnackBar()
    })
      
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changeData(filters: any) {
    this.openSnackBarLoading()
    this.http.get(environment.apiUrl + this.url + '/' + this.ccompania, filters).subscribe((response: any) => {
      if (response.data.events) {
        this.dataSource.data = response.data.events;
      }
      this.closeSnackBar()
    });
  }

}
