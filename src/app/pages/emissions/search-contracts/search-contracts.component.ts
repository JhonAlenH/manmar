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
import { DateUtilService } from './../../../_services/date-util.service';

@Component({
  selector: 'app-search-contracts',
  templateUrl: './search-contracts.component.html',
  styleUrls: ['./search-contracts.component.scss']
})
export class SearchContractsComponent implements OnInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['xpoliza', 'xcedente', 'xramo', 'xasegurado', 'fdesde_pol', 'fhasta_pol'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentUser!: any

  cedentsList: any[] = [];
  tradeList: any[] = [];

  cedentsControl = new FormControl('');
  tradeControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredTrade!: Observable<string[]>;

  searchFormGroup = this._formBuilder.group({
    ccedente: [''],
    cramo: [''],
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

    if(this.currentUser){
      this.getCedents();
      this.getTrades();

      this.searchContracts();
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
    this.searchFormGroup.get('ccedente')?.setValue(selectedCedents.id);
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
    this.searchFormGroup.get('cramo')?.setValue(selectedTrade.id);
  }

  searchContracts(){
    let data = {
      ccedente: this.searchFormGroup.get('ccedente')?.value,
      cramo: this.searchFormGroup.get('cramo')?.value,
    }

    this.http.post(environment.apiUrl + '/api/v1/emission/search', data).subscribe((response: any) => {
      if (response.data.contracts) {console.log(response.data.contracts)
        const correctedContracts = response.data.contracts.map((contract: any) => {
          contract.fdesde_pol = this.dateUtilService.adjustDate(contract.fdesde);
          contract.fhasta_pol = this.dateUtilService.adjustDate(contract.fhasta);
          return contract;
        });
        
        this.dataSource.data = correctedContracts;
      }
    })
  }

  adjustDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adjust date by adding 1 day
    return date.toISOString().split('T')[0]; // Convert back to YYYY-MM-DD format
  }

  emitir(){
    this.router.navigate(['emissions']);
  }

  sendRecord(row: any) {
    console.log(row)
    this.router.navigate(['detail-contract'], { state: row });

  }

}
