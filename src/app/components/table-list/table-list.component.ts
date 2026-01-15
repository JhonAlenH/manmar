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
import Swal from 'sweetalert2'

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

  currentUser!: any
  userVar:any = null

  tableData: any = []
  noCreate = false
  filtersData: any[] = []
  filterValue:any = ''
  filters: any[] = []
  editUrl = ''
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
    const storedSession = localStorage.getItem('user');
    const jsonD = JSON.parse(storedSession);
    this.currentUser = jsonD.data?.user

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
        url = '/'+ urlSplited.join('/')
      }
      this.infoUrl = `${url}/info/`
      // this.infoUrl = `${url}/`
      this.createUrl = `${url}/create`
    });
    this.sub = this.route.data.subscribe(v => {
      this.title = v.title
      this.url = v.url
      this.editUrl = v.editUrl
      this.userVar = v.userVar || null
      this.noCreate = v.noCreate
      this.redirectUrl = v.redirectUrl
      this.tableInfo = v.tableInfo
      this.tableId = v.tableId
      this.ccompania = localStorage.getItem('ccompania');
      
      if(v.filtersData) {
        this.filtersData = v.filtersData
        if(v.filterDefaultKey) {
          const filterDefaultItem = this.filtersData.find(item=> item.key == v.filterDefaultKey)
          filterDefaultItem.controlValue = this.filterValue
        }
      }
    });
    
    this.displayedColumns = this.tableInfo.map(item => item.key)
    this.displayedColumns.push('info')
    this.userVar = this.userVar && this.currentUser[this.userVar] ? '/' + this.currentUser[this.userVar] : ''
    
    this.http.post(environment.apiUrl + this.url + this.userVar, {}).subscribe((data) => {
      let dataRecived:any = []
      if(data['data']){
        dataRecived = data['data']
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
          return item
        })
        
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
  async editItem(item:any) {
    let title = '¿Desea deshabilitar el item?'
    if(!item.bactivo){
      title = '¿Desea habilitar el item?'
    }
    Swal.fire({
      title,
      icon: "warning",
      confirmButtonText: "<strong>Aceptar</strong>",
      confirmButtonColor: "#5e72e4",
    }).then(async (result) => {
      if(result.isConfirmed) {
        item.bactivo = !item.bactivo
        const data = {bactivo: item.bactivo}
        const responseRaw = await fetch(environment.apiUrl + this.editUrl + item.id, {
          "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify(data)
        })
        const response = await responseRaw.json()
        if(response.status) {
          window.location.reload()
        }
      }
    });
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
