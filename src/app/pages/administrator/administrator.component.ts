import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateUtilService } from './../../_services/date-util.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2'
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdministratorComponent implements OnInit {

  @ViewChild('bottomSheetReceipt') bottomSheetReceipt: TemplateRef<any>;

  @ViewChild('Distribution') Distribution!: TemplateRef<any>;
  @ViewChild('Receipt') Receipt!: TemplateRef<any>;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  columnsToDisplay: string[] = [ 'xpoliza', 'xramo', 'xasegurado', 'fdesde_pol', 'fhasta_pol'];
  columnsName: string[] = ['Póliza', 'Ramo', 'Asegurado', 'Fecha Desde', 'Fecha Hasta'];
  columnsToDisplayWithExpand: string[] = [...this.columnsToDisplay, 'expand'];
  columnsNameDetail: string[] = ['N° Recibo', 'Fecha Desde', 'Fecha Hasta', 'Monto Comisión'];
  expandedDetailData: any[] = [];

  expandedElement: any | null = null;
  comisionManmar: any;
  parametros: any;
  moneda: any;

  pageReceipt = 1; // Página actual
  pageReceiptSize = 7; // Tamaño de página, cantidad de elementos por página
  paginatedList: any[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentUser!: any;
  cedentsList: any[] = [];
  tradeList: any[] = [];
  bankList: any[] = [];
  receiptDueList: any[] = [];
  uniqueCedentes: any[] = [];
  coinsList: any[] = [];
  receipt: any[] = [];
  receiptSelected: any[] = [];

  selectAll: boolean = false;
  amount: boolean = false;

  cedentsControl = new FormControl('');
  tradeControl = new FormControl('');
  bankControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredTrade!: Observable<string[]>;
  filteredBank!: Observable<string[]>;

  dialogRef: MatDialogRef<any>;

  totalMontoNeto: number = 0;  // Variable para almacenar la suma de mneta

  camposNecesarios: { [key: string]: string } = { // Mapa de nombres de campo
    cbanco: 'Banco',
    mmonto: 'Monto de Ingreso',
  };

  administrativeForm = this._formBuilder.group({
    ccedente: [''],
    cramo: [''],
    cbanco: ['', Validators.required],
    xreferencia: ['', [Validators.maxLength(6)]],
    mmonto: ['', Validators.required],
    cmoneda: ['']
  });

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private dateUtilService: DateUtilService,
    private bottomSheet: MatBottomSheet,
    readonly dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);

    if (this.currentUser) {
      this.getCedents();
      this.getTrades();
      this.getBank();
      this.searchContracts();
      this.searchDueReceipt();
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

  formatPrima(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    event.target.value = value;
    this.administrativeForm.get('mmonto')?.setValue(event.target.value)
  }

  onNextStepReceipt() {
    if (this.administrativeForm.valid) {
      this.onSubmit();
    } else {
      let camposFaltantes = '';
      camposFaltantes += '<br>- '; // Iniciar con un salto de línea y guión
      Object.keys(this.administrativeForm.controls).forEach(key => {
          const control = this.administrativeForm.get(key);
          if (control && control.invalid) { // Agregar verificación de nulidad
              camposFaltantes += this.camposNecesarios[key] + '<br>-'; // Usar el mapa de nombres de campo y agregar un salto de línea
          }
      });
      camposFaltantes = camposFaltantes.slice(0, -4); // Eliminar el espacio extra al final
      
      Swal.fire({
          title: "Por favor, complete los siguientes campos para registrar el cobro: <br>",
          html: `${camposFaltantes}`, // Usar html en lugar de text
          icon: "warning",
          confirmButtonText: "<strong>Aceptar</strong>",
          confirmButtonColor: "#5e72e4",
      });
    }
  }

  getCedents() {
    this.http.post(environment.apiUrl + '/api/v1/valrep/cedents', null).subscribe((response: any) => {
      if (response.data.cedents) {
        this.cedentsList = response.data.cedents.map((cedente: any) => ({
          id: cedente.ccedente,
          value: cedente.xcedente,
        })).sort((a, b) => a.value > b.value ? 1 : -1);
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

  onCedentsSelection(event: any) {
    const selectedCedent = this.cedentsList.find(cedent => cedent.value === event.option.value);
    this.administrativeForm.get('ccedente')?.setValue(selectedCedent.id);
  }

  getCoins(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/coins', null).subscribe((response: any) => {
      if (response.data.coins) {
        this.coinsList = response.data.coins.map((item: any) => ({
          id: item.cmoneda,
          value: item.xmoneda,
        }))
      }
    });
  }

  coinSelect(coinId: string) {
    // Actualiza el valor del control de formulario
    this.administrativeForm.get('cmoneda')?.setValue(coinId);
    
    // Busca la moneda seleccionada en la lista
    const selectedCoin = this.coinsList.find(coin => coin.id === coinId);
    
    // Actualiza la moneda seleccionada para mostrarla en el botón
    if (selectedCoin) {
      this.moneda = selectedCoin.value;
    }
    
    console.log('Moneda seleccionada:', this.moneda);
  }


  getTrades() {
    this.http.post(environment.apiUrl + '/api/v1/valrep/trade', null).subscribe((response: any) => {
      if (response.data.trade) {
        this.tradeList = response.data.trade.map((trade: any) => ({
          id: trade.cramo,
          value: trade.xramo,
        })).sort((a, b) => a.value > b.value ? 1 : -1);
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
    this.administrativeForm.get('cramo')?.setValue(selectedTrade.id);
  }

  getBank() {
    this.http.post(environment.apiUrl + '/api/v1/valrep/bank-manmar', null).subscribe((response: any) => {
      if (response.data.bank) {
        this.bankList = response.data.bank.map((banco: any) => ({
          id: banco.cbanco,
          value: banco.xbanco,
        })).sort((a, b) => a.value > b.value ? 1 : -1);
        this.filteredBank = this.bankControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filteredBank(value || ''))
        );
      }
    });
  }

  private _filteredBank(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.bankList
      .map(bank => bank.value)
      .filter(bank => bank.toLowerCase().includes(filterValue));
  }

  onBankSelection(event: any) {
    const selectedbank = this.bankList.find(bank => bank.value === event.option.value);
    this.administrativeForm.get('cbanco')?.setValue(selectedbank.id);
    this.getCoins();
  }

  searchContracts() {
    const data = {
      ccedente: this.administrativeForm.get('ccedente')?.value,
      cramo: this.administrativeForm.get('cramo')?.value,
    };

    this.http.post(environment.apiUrl + '/api/v1/emission/search', data).subscribe((response: any) => {
      if (response.data.contracts) {
        const correctedContracts = response.data.contracts.map((contract: any) => {
          contract.fdesde_pol = this.dateUtilService.adjustDate(contract.fdesde);
          contract.fhasta_pol = this.dateUtilService.adjustDate(contract.fhasta);
          return contract;
        });
        this.dataSource.data = correctedContracts;
      }
    });
  }

  searchDueReceipt() {
    this.http.post(environment.apiUrl + '/api/v1/emission/receipt-due', null).subscribe((response: any) => {
      this.receiptDueList = response.receipt;

      this.receiptDueList.forEach(item => {
        // Determinar el tipo de monto basado en el valor de ivalor
        item.montoTipo = item.ivalor === 'N' ? 'neto' : 'bruto';
        
        // Asignar impuestos y cálculos basados en el tipo de monto
        item.mimpuesto = item.montoTipo === 'neto' ? 0 : 5;
        item.mneto = item.montoTipo === 'neto' 
                      ? item.mcomisionext 
                      : item.mcomisionext * 0.05 - item.mcomisionext;
  
        // Asegurarse de que el monto neto sea positivo y redondearlo a dos decimales
        item.mneto = item.mneto < 0 ? -item.mneto : item.mneto;
        item.mneto = parseFloat(item.mneto.toFixed(2));
      });

      this.uniqueCedentes = response.cedents
    });
  }

  getDefaultToggleValue(cedente: any): string {
    // Filtrar los registros de receiptDueList por el cedente específico
    const registrosCedente = this.receiptDueList.filter(item => item.xcedente === cedente.xcedente);
    
    // Si todos los registros tienen el mismo valor de ivalor, devolver ese valor.
    // De lo contrario, devolver el valor predeterminado que prefieras.
    if (registrosCedente.every(item => item.ivalor === 'N')) {
      return 'neto';
    } else if (registrosCedente.every(item => item.ivalor === 'B')) {
      return 'bruto';
    } else {
      // Si hay una mezcla de valores, selecciona uno por defecto.
      return 'bruto'; // O 'neto', dependiendo de lo que prefieras
    }
  }

  onToggleChange(selectedValue: string, cedente: any) {
    // Actualiza el valor de ivalor para todos los registros de este cedente
    this.receiptDueList.forEach(item => {
      if (item.xcedente === cedente.xcedente) {
        item.ivalor = selectedValue === 'neto' ? 'N' : 'B';
        item.montoTipo = selectedValue;
        item.mimpuesto = selectedValue === 'neto' ? 0 : 5;
        item.mneto = selectedValue === 'neto'
          ? item.mcomisionext
          : item.mcomisionext * 0.05 - item.mcomisionext;
  
        item.mneto = Math.abs(item.mneto);
        item.mneto = parseFloat(item.mneto.toFixed(2));
      }
    });
  }

  onPanelOpen(cedenteId: number): void {
    this.receipt = [];
    this.receipt = this.receiptDueList.filter((item: any) => item.ccedente === cedenteId)
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = (this.pageReceipt - 1) * this.pageReceiptSize;
    const endIndex = startIndex + this.pageReceiptSize;
    this.paginatedList  = this.receipt.slice(startIndex, endIndex);
  }

  onPageChange() {
    this.updatePaginatedList();
  }


  toggleRow(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      this.searchReceipt(element);
    }
  }

  toggleSelectAll() {
    this.receiptSelected = []; // Limpiamos la lista antes de agregar nuevos elementos
    this.totalMontoNeto = 0; // Reiniciamos la suma
    this.paginatedList.forEach(item => {
      item.selected = this.selectAll;
      if (this.selectAll) {
        this.addToReceiptSelected(item);
      }
    });
  }
  
  onItemSelect(item: any) {
    if (item.selected) {
      this.addToReceiptSelected(item);
    } else {
      this.removeFromReceiptSelected(item);
    }
  }
  
  addToReceiptSelected(item: any) {
    this.receiptSelected.push({
      id_poliza: item.xpoliza,
      nrecibo: item.nrecibo,
      mneta: item.mneto
    });
    this.totalMontoNeto += item.mneto; // Actualiza la suma total

    if(this.totalMontoNeto > 0){
      this.amount = true;
    }else{
      this.amount = false;
    }
    
  }
  
  removeFromReceiptSelected(item: any) {
    this.receiptSelected = this.receiptSelected.filter(selectedItem => 
      selectedItem.id_poliza !== item.xpoliza || 
      selectedItem.nrecibo !== item.nrecibo
    );
    this.totalMontoNeto -= item.mneto; // Actualiza la suma total
    
    if(this.totalMontoNeto > 0){
      this.amount = true;
    }else{
      this.amount = false;
    }
  }


  searchReceipt(element: any) {
    this.http.post(environment.apiUrl + `/api/v1/emission/search-receipt/${element.id}`, null).subscribe((response: any) => {
      if (response.receipt) {
        this.expandedDetailData = response.receipt;
      }
    });
  }

  onCobrar(detail: any) {
    this.moneda = 'Moneda'
    this.parametros = detail;
    this.comisionManmar = detail.mcomisionext;
    this.dialogRef = this.dialog.open(this.Receipt, {
      width: '90%', // Ancho del diálogo
      height: '50%', // Alto del diálogo
      maxWidth: '800px'
    });
  }

  activateModal(): void {
    this.bottomSheet.dismiss()
    this.dialogRef = this.dialog.open(this.Distribution, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px'
    });
  }

  onSubmit(){
    Swal.fire({
      icon: "question",
      title: "¿Deseas realizar la Distribución?",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#5e72e4",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: async () => {
        // Cerramos el modal original para proceder con la lógica
        Swal.close();
    
        // Muestra un modal de "Espere por favor..." mientras se realiza la consulta a la API
        Swal.fire({
          title: 'Espere por favor...',
          text: 'Procesando su solicitud',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
    
        try {
          let data = {
            id_poliza: this.parametros.id_poliza,
            nrecibo: this.parametros.nrecibo,
            fcobro: new Date(),
            cbanco: this.administrativeForm.get('cbanco')?.value,
            xreferencia: this.administrativeForm.get('xreferencia')?.value,
            cmoneda_cobro: this.administrativeForm.get('cmoneda')?.value,
            mingreso: this.administrativeForm.get('mmonto')?.value,
          };

          this.http.post(environment.apiUrl + `/api/v1/emission/update-receipt`, data).subscribe((response: any) => {
            if (response.status_receipt) {
              Swal.close();
              this.activateModal();
            }
          },(err)=>{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `No se pudo actualizar el cobro`,
            });
          });
        } catch (error) {
          // Mostrar un mensaje de error si algo falla
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Request failed: ${error.message}`,
          });
        }
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        // Si se presionó "Cancelar", realizar la consulta a la API
        let data = {
          id_poliza: this.parametros.id_poliza,
          nrecibo: this.parametros.nrecibo,
          fcobro: new Date(),
          cbanco: this.administrativeForm.get('cbanco')?.value,
          xreferencia: this.administrativeForm.get('xreferencia')?.value,
          cmoneda_cobro: this.administrativeForm.get('cmoneda')?.value,
          mingreso: this.administrativeForm.get('mmonto')?.value,
        };
        this.http.post(environment.apiUrl + `/api/v1/emission/update-receipt`, data).subscribe((response: any) => {
          if (response.status_receipt) {
            Swal.fire({
              icon: "success",
              title: `Se ha registrado el cobro exitosamente`,
              showConfirmButton: false,
              timer: 4000
            }).then((result) => {
              location.reload()
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al registrar el cobro',
            });
          }
        });
      }
    });
    


  }
}
