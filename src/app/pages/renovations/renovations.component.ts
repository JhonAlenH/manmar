import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateUtilService } from './../../_services/date-util.service';

@Component({
  selector: 'app-renovations',
  templateUrl: './renovations.component.html',
  styleUrls: ['./renovations.component.scss']
})
export class RenovationsComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['xpoliza', 'xcedente', 'xramo', 'xasegurado', 'fhasta', 'nvencido'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  currentUser!: any

  cedentsList: any[] = [];
  tradeList: any[] = [];
  months: { name: string, value: number }[] = [
    { name: 'Enero', value: 1 },
    { name: 'Febrero', value: 2 },
    { name: 'Marzo', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Mayo', value: 5 },
    { name: 'Junio', value: 6 },
    { name: 'Julio', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Septiembre', value: 9 },
    { name: 'Octubre', value: 10 },
    { name: 'Noviembre', value: 11 },
    { name: 'Diciembre', value: 12 }
  ];
  years: number[] = []; 

  cedentsControl = new FormControl('');
  tradeControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredTrade!: Observable<string[]>;

  renoFormGroup = this._formBuilder.group({
    ccedente: [''],
    cramo: [''],
    mes: [''],
    year: ['']
  });

  constructor( private _formBuilder: FormBuilder,
              private http: HttpClient,
              private dateUtilService: DateUtilService,
              private modalService: NgbModal,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router,
              ) {}

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, index) => currentYear + index);

    if(this.currentUser){
      this.getCedents();
      this.getTrades();

      this.searchRenovations();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCedents(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/cedents', null).subscribe((response: any) => {
      if (response.data.cedents) {
        for (let i = 0; i < response.data.cedents.length; i++) {
          this.cedentsList.push({
            id: response.data.cedents[i].ccedente,
            value: response.data.cedents[i].xcedente,
          });
        }
        this.cedentsList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredCedents = this.cedentsControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCedents(value || ''))
        );
      }
    });
  }

  private _filterCedents(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cedentsList
      .map(cedent => cedent.value)
      .filter(cedent => cedent.toLowerCase().includes(filterValue));
  }

  onCedentsSelection(event: any){
    const selectedCedents = this.cedentsList.find(cedents => cedents.value === event.option.value);
    this.renoFormGroup.get('ccedente')?.setValue(selectedCedents.id);
    this.searchRenovations();
  }

  getTrades(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/trade', null).subscribe((response: any) => {
      if (response.data.trade) {
        for (let i = 0; i < response.data.trade.length; i++) {
          this.tradeList.push({
            id: response.data.trade[i].cramo,
            value: response.data.trade[i].xramo,
          });
        }
        this.tradeList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredTrade = this.tradeControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTrade(value || ''))
        );
      }
    });
  }

  private _filterTrade(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tradeList
      .map(trade => trade.value)
      .filter(trade => trade.toLowerCase().includes(filterValue));
  }

  onTradeSelection(event: any) {
    const selectedTrade = this.tradeList.find(trade => trade.value === event.option.value);
    this.renoFormGroup.get('cramo')?.setValue(selectedTrade.id);
    this.searchRenovations();
  }

  searchRenovations(){
    let data = {
      ccedente: this.renoFormGroup.get('ccedente')?.value,
      cramo: this.renoFormGroup.get('cramo')?.value,
      mes: this.renoFormGroup.get('mes')?.value,
      year: this.renoFormGroup.get('year')?.value,
    }

    this.http.post(environment.apiUrl + '/api/v1/renovations/search', data).subscribe((response: any) => {
      if (response.renovations) {
        const correctedRenovations = response.renovations.map((renovations: any) => {
          renovations.fdesde = this.dateUtilService.adjustDate(renovations.fdesde);
          renovations.fhasta = this.dateUtilService.adjustDate(renovations.fhasta);
          return renovations;
        });
  
        this.dataSource.data = correctedRenovations;
      }
    })
  }

  recordatorio(){
    this.snackBar.open('Recuerda colocar el año para completar la búsqueda', '', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['yellow-snackbar']
    });
  }

  sendRecord(row: any) {
    console.log(row)
    this.router.navigate(['detail-renovation'], { state: row });

  }

}
