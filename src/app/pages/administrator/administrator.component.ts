import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateUtilService } from './../../_services/date-util.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import Swal from 'sweetalert2'
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';


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
  @ViewChild('Complemento') Complemento!: TemplateRef<any>;
  @ViewChild('Abonar') Abonar!: TemplateRef<any>;
  @ViewChild('DetalleProductor') DetalleProductor!: TemplateRef<any>;
  @ViewChild('DetalleEjecutivo') DetalleEjecutivo!: TemplateRef<any>;
  @ViewChild('DetalleAgente') DetalleAgente!: TemplateRef<any>;
  @ViewChild('PagarProductor') PagarProductor!: TemplateRef<any>;
  @ViewChild('PagarEjecutivo') PagarEjecutivo!: TemplateRef<any>;
  @ViewChild('ListarComisiones') ListarComisiones!: TemplateRef<any>;
  @ViewChild('CambiarComision') CambiarComision!: TemplateRef<any>;
  @ViewChild('PagarAgente') PagarAgente!: TemplateRef<any>;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  columnsToDisplay: string[] = [ 'xpoliza', 'xnombre', 'fcobro', 'mcomision', 'mcomisionext'];
  columnsName: string[] = ['Póliza', 'Asegurado', 'Fecha Cobro', 'Monto Cobrado Bs.', 'Monto Cobrado $'];
  columnsToDisplayWithExpand: string[] = [...this.columnsToDisplay, 'expand'];
  columnsNameDetail: string[] = ['Fecha de Complemento', 'Monto de Complemento'];
  expandedDetailData: any[] = [];
  currentRecordComplements: { [key: string]: any[] } = {};
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  expandedElement: any | null = null;
  comisionManmar: any;
  parametros: any;
  moneda: any;

  firstCedenteId: number | null = null; // Para rastrear el primer cedenteId seleccionado
  cedenteNombre: string = ''; // Nombre del cedente del primer ítem seleccionado

  pageReceipt = 1; // Página actual
  pageReceiptSize = 7; // Tamaño de página, cantidad de elementos por página

  pageFee = 1; // Página actual
  pageFeeSize = 7; // Tamaño de página, cantidad de elementos por página


  paginatedList: any[] = [];
  paginatedFeeList: any[] = [];


  currentUser!: any;
  bcv!: any;
  currentPolizaId: string | undefined;
  currentRecibo: string | undefined;
  netoBs: any;
  monedaDebanco: any;
  neto: any;
  polizaACambiar: any;
  mcomision_e: any;
  mcomision_eext: any;
  mcomision_a: any;
  mcomision_aext: any;

  montoTransformado: any;
  cedentsList: any[] = [];
  tradeList: any[] = [];
  bankList: any[] = [];
  receiptDueList: any[] = [];
  uniqueCedentes: any[] = [];
  uniqueCedentesFee: any[] = [];
  coinsList: any[] = [];
  receipt: any[] = [];
  fee: any[] = [];
  receiptSelected: any[] = [];
  feeChargedList: any[] = [];
  abonosList: any[] = [];
  distributionList: any[] = [];
  newAbono: any = { fmovimiento: '', mpagado: null };
  abonoObject: any = {};

  //Aqui separamos listas por productor y ejecutivos
  productores: any[] = [];
  ejecutivos: any[] = [];
  agentes: any[] = [];

  detalleProductores: any[] = [];
  detalleEjecutivos: any[] = [];
  detalleAgentes: any[] = [];

  selectAll: boolean = false;
  amount: boolean = false;
  newComplementAdded: boolean = false;
  rutaCapture!: any;
  simbolo: any;

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
    cmoneda: [''],
    fcomplemento: [''],
    mcomplemento: [''],
    cmoneda_comp: [''],
    fabono: [''],
    cmoneda_abono: [''],
    mpagado_abono: [''],
  });

  commisionsForm = this._formBuilder.group({
    fdesde: [''],
    fhasta: [''],
    fpago_p: [''],
    cbanco_p: [''],
    xreferencia_p: [''],
    mmonto_p: [{ value: '', disabled: true }],
    cmoneda_p: [''],
    fpago_e: [''],
    cbanco_e: [''],
    xreferencia_e: [''],
    mmonto_e: [{ value: '', disabled: false }],
    cmoneda_e: [''],
    fpago_a: [''],
    cbanco_a: [''],
    xreferencia_a: [''],
    mmonto_a: [{ value: '', disabled: false }],
    cmoneda_a: [''],
  });

  genericFormGroup = this._formBuilder.group({
    pcomision_e: [{ value: '', disabled: false }],
    mcomision_e: [{ value: '', disabled: true }],
    pcomision_a: [{ value: '', disabled: false }],
    mcomision_a: [{ value: '', disabled: true }],
    pcomision_p: [{ value: '', disabled: false }],
    mcomision_p: [{ value: '', disabled: true }],
  });
  mcomision_p_bs: any;
  mcomision_e_bs: any;
  mcomision_a_bs: any;

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private dateUtilService: DateUtilService,
    private cdRef: ChangeDetectorRef,
    readonly dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    fetch('https://ve.dolarapi.com/v1/dolares')
    .then((response) => response.json())
    .then(data => {
      data.forEach((item: any) => {
        if (item.fuente === 'oficial') {
          this.bcv = item.promedio;
        }
      });
    })
    .catch(error => {
      console.error('Error al obtener la tasa del BCV:', error);
      // Continuar con el valor predeterminado de `this.bcv`
    })
  }

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);

    if (!this.bcv) {
      fetch('https://apisys2000.lamundialdeseguros.com/api/v1/valrep/tasaBCV')
        .then((response) => response.json())
        .then(data => {
          data.data.forEach((item: any) => {
            if (item.cmoneda === '$') {
              this.bcv = item.ptasamon;
            }
          });
  
          // Ejecutar las funciones que dependen de this.bcv después de que se haya actualizado
          if (this.currentUser) {
            this.getCedents();
            this.getTrades();
            this.getBank();
            this.searchDueReceipt();
            this.feeCharged();
          }
        })
        .catch(error => {
          console.error('Error al obtener la tasa del BCV:', error);
          // Puedes continuar con el valor predeterminado de `this.bcv` si es necesario
          if (this.currentUser) {
            this.getCedents();
            this.getTrades();
            this.getBank();
            this.searchDueReceipt();
            this.feeCharged();
          }
        });
    } else {
      // Si this.bcv ya tiene valor, ejecutar las funciones directamente
      if (this.currentUser) {
        this.getCedents();
        this.getTrades();
        this.getBank();
        this.searchDueReceipt();
        this.feeCharged();
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formatPrima(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    event.target.value = value;
    this.administrativeForm.get('mcomplemento')?.setValue(event.target.value)
  }

  filterSeguimientosData(values: string) {
    this.paginatedList = this.receiptDueList.filter((item) => {
      const searchValue = values.toLowerCase();
      const poliza = item.xpoliza ? item.xpoliza.toString().toLowerCase() : '';
      const nombre = item.xnombre ? item.xnombre.toString().toLowerCase() : '';
      const fdesde = item.fdesde_rec ? item.fdesde_rec.toString().toLowerCase() : '';
      const fhasta = item.fhasta_rec ? item.fhasta_rec.toString().toLowerCase() : '';
  
      return poliza.includes(searchValue) || nombre.includes(searchValue) || fdesde.includes(searchValue) || fhasta.includes(searchValue)
    });
  }

  filterComplementosData(values: string) {
    this.paginatedFeeList = this.feeChargedList.filter((item) => {
      const searchValue = values.toLowerCase();
      const poliza = item.xpoliza ? item.xpoliza.toString().toLowerCase() : '';
      const nombre = item.xnombre ? item.xnombre.toString().toLowerCase() : '';
      const mingreso = item.mingreso ? item.mingreso.toString().toLowerCase() : '';
      const mcomisionext = item.mcomisionext ? item.mcomisionext.toString().toLowerCase() : '';
  
      return poliza.includes(searchValue) || nombre.includes(searchValue) || mingreso.includes(searchValue) || mcomisionext.includes(searchValue)
    });
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
  }

  coinSelectProductor(coinId: string) {
    // Actualiza el valor del control de formulario
    this.commisionsForm.get('cmoneda_p')?.setValue(coinId);
    
    // Busca la moneda seleccionada en la lista
    const selectedCoin = this.coinsList.find(coin => coin.id === coinId);
    
    // Actualiza la moneda seleccionada para mostrarla en el botón
    if (selectedCoin) {
      this.moneda = selectedCoin.value;
    }
  }

  coinSelectEjecutivo(coinId: string) {
    this.commisionsForm.get('cmoneda_e')?.setValue(coinId);

    setTimeout(() => {
      const selectedCoin = this.coinsList.find(coin => coin.id === coinId);
      // Actualiza la moneda seleccionada para mostrarla en el botón
      if (selectedCoin) {
        this.moneda = selectedCoin.value;
        if(parseInt(this.commisionsForm.get('cmoneda_e')?.value) == 1){
          this.commisionsForm.get('mmonto_e')?.setValue(this.mcomision_e);
        }else{
          this.commisionsForm.get('mmonto_e')?.setValue(this.mcomision_eext)
        }
      }
      this.commisionsForm.get('fpago_e')?.setValue(this.dateUtilService.formatDateYMD(new Date()));
    }, 100);

  }

  coinSelectAgente(coinId: string) {
    // Actualiza el valor del control de formulario
    this.commisionsForm.get('cmoneda_a')?.setValue(coinId);
    setTimeout(() => {
      // Busca la moneda seleccionada en la lista
      const selectedCoin = this.coinsList.find(coin => coin.id === coinId);
      
      // Actualiza la moneda seleccionada para mostrarla en el botón
      if (selectedCoin) {
        this.moneda = selectedCoin.value;
        if(parseInt(this.commisionsForm.get('cmoneda_a')?.value) == 1){
          this.commisionsForm.get('mmonto_a')?.setValue(this.mcomision_a);
        }else{
          this.commisionsForm.get('mmonto_a')?.setValue(this.mcomision_aext)
        }
      }
      this.commisionsForm.get('fpago_a')?.setValue(this.dateUtilService.formatDateYMD(new Date()));
    }, 100)
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
          coin: banco.cmoneda
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
    this.monedaDebanco = selectedbank.coin

    if(this.monedaDebanco == 2){
      this.totalMontoNeto = this.neto;
      this.simbolo = '$';
    }

    this.getCoins();
  }

  onBankSelectionProductor(event: any) {
    const selectedbank = this.bankList.find(bank => bank.value === event.option.value);
    this.commisionsForm.get('cbanco_p')?.setValue(selectedbank.id);
    this.getCoins();
  }

  onBankSelectionEjecutivo(event: any) {
    const selectedbank = this.bankList.find(bank => bank.value === event.option.value);
    this.commisionsForm.get('cbanco_e')?.setValue(selectedbank.id);
    this.getCoins();
    this.coinSelectEjecutivo(selectedbank.coin)
  }

  onBankSelectionAgente(event: any) {
    const selectedbank = this.bankList.find(bank => bank.value === event.option.value);
    this.commisionsForm.get('cbanco_a')?.setValue(selectedbank.id);
    this.getCoins();
    this.coinSelectAgente(selectedbank.coin)
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
        item.mnetobs = parseFloat((item.mcomisionext * this.bcv).toFixed(2));
      });
      this.uniqueCedentes = response.cedents;
    });
  }

  feeCharged() {
    this.http.post(environment.apiUrl + '/api/v1/emission/fee-charged', null).subscribe((response: any) => {
      this.feeChargedList = response.fee.map((item: any) => {
        return {
          ...item,
          fcobro: this.dateUtilService.formatDate(new Date(item.fcobro))
        };
      });

      this.uniqueCedentesFee = response.cedents;

      // this.dataSource.data = this.feeChargedList;
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
  
        // Asegurarse de que mneto no tenga valores negativos
        item.mneto = Math.abs(item.mneto);
        item.mneto = parseFloat(item.mneto.toFixed(2));
  
        // Recalcular mnetobs cada vez que se cambia el valor
        item.mnetobs = parseFloat((item.mneto * this.bcv).toFixed(2));
      }
    });
  
    // Forzar la detección de cambios para asegurarse de que Angular actualice el DOM
    this.cdRef.detectChanges();
  }

  updateMnetobs(item: any): void {
    // Verificar que this.bcv tenga un valor válido
    if (this.bcv && item.mneto) {
      // Calcular mnetobs como mneto * bcv y redondearlo a 2 decimales
      item.mnetobs = parseFloat((item.mneto * this.bcv).toFixed(2));
    } else {
      // Si no hay un valor válido de bcv o mneto, colocar mnetobs a 0
      item.mnetobs = 0;
    }
  }

  onPanelOpen(cedenteId: number, type: string = 'Todas'): void {
    // Filtrar primero por ccedente
    let filteredReceipts = this.receiptDueList.filter((item: any) => item.ccedente === cedenteId);
    
    this.parametros = cedenteId;
    
    // Luego, filtrar por tipo de fecha si es necesario
    if (type && type !== 'Todas') {
        const today = new Date();
      
        if (type === 'Vencidas') {
            // Filtrar recibos cuya fecha de finalización es menor que hoy
            filteredReceipts = filteredReceipts.filter((item: any) => new Date(item.fhasta_rec) < today);
        } else if (type === 'Vigentes') {
            // Filtrar recibos cuya fecha de finalización es mayor o igual a hoy
            filteredReceipts = filteredReceipts.filter((item: any) => new Date(item.fhasta_rec) >= today);
        } else if (type === 'Próximas') {
            // Filtrar recibos cuya fecha de inicio es mayor a hoy
            filteredReceipts = filteredReceipts.filter((item: any) => new Date(item.fdesde_rec) > today);
        }
    }
    
    // Asignar los recibos filtrados a this.receipt y actualizar la lista paginada
    this.receipt = filteredReceipts;
    this.updatePaginatedList();
  }

  onPanelOpen2(cedenteId: number): void {
    // Filtrar primero por ccedente
    let filteredFee = this.feeChargedList.filter((item: any) => item.ccedente === cedenteId);
    console.log(filteredFee)
    
    this.fee = filteredFee;
    this.dataSource.data = this.fee
    this.dataSource.paginator = null;
    this.dataSource.sort = null;
    this.updatePaginatedFeeList();
  } 

  updatePaginatedList() {
    const startIndex = (this.pageReceipt - 1) * this.pageReceiptSize;
    const endIndex = startIndex + this.pageReceiptSize;
    this.paginatedList  = this.receipt.slice(startIndex, endIndex);
  }

  updatePaginatedFeeList() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const startIndex = (this.pageFee - 1) * this.pageFeeSize;
    const endIndex = startIndex + this.pageFeeSize;
    this.paginatedFeeList  = this.fee.slice(startIndex, endIndex);
  }

  onPageChange() {
    this.updatePaginatedList();
  }

  onPageChangeFee() {
    this.updatePaginatedFeeList();
  }

  filterReceiptsByType(type: string) {
    const today = new Date();
  
    if (type === 'Vencidas') {
      // Filtrar recibos cuya fecha de finalización es menor que hoy
      this.receipt = this.receiptDueList.filter((item: any) => new Date(item.fhasta_rec) < today && item.ccedente === this.parametros);
    } else if (type === 'Vigentes') {
      // Filtrar recibos cuya fecha de finalización es mayor o igual a hoy
      this.receipt = this.receiptDueList.filter((item: any) => new Date(item.fhasta_rec) >= today && item.ccedente === this.parametros);
    } else if (type === 'Próximas') {
      // Filtrar recibos cuya fecha de inicio es mayor a hoy
      this.receipt = this.receiptDueList.filter((item: any) => new Date(item.fhasta_rec) > today && item.ccedente === this.parametros);
    } else if(type === 'Todas'){
      this.receipt = this.receiptDueList.filter((item: any) => item.ccedente === this.parametros);
    }
    
    this.updatePaginatedList(); // Actualizar la lista paginada con los resultados filtrados
  }


  toggleRow(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      this.searchComplement(element);
    }
  }

  toggleSelectAll() {
    if (this.selectAll) {
      this.firstCedenteId = null; // Reiniciar el `firstCedenteId` para una nueva selección
      this.cedenteNombre = ''; // Reiniciar el nombre del primer cedente
    }
  
    this.receiptSelected = []; // Limpiamos la lista antes de agregar nuevos elementos
    this.totalMontoNeto = 0; // Reiniciamos la suma
  
    for (const item of this.paginatedList) {
      if (this.selectAll) {
        if (this.firstCedenteId === null) {
          // Si es el primer ítem seleccionado, guarda el `cedenteId` y el nombre del cedente
          this.firstCedenteId = item.ccedente;
          this.cedenteNombre = item.xcedente; // Asume que tienes el nombre del cedente en item.xnombreCedente
          item.selected = true;
          this.addToReceiptSelected(item);
        } else if (item.ccedente !== this.firstCedenteId) {
          // Si el cedenteId no coincide, muestra un mensaje de error y rompe el bucle
          Swal.fire({
            icon: 'error',
            text: `No se puede seleccionar porque ya tiene una selección de ${this.cedenteNombre}`,
          });
          this.selectAll = false; // Deselecciona el checkbox de "Seleccionar todo"
          break; // Sale del bucle, no selecciona más ítems
        } else {
          item.selected = true;
          this.addToReceiptSelected(item);
        }
      } else {
        item.selected = false; // Deselecciona todos los elementos si `selectAll` es false
      }
    }
  
    // Si no se seleccionó ningún elemento, reinicia las variables
    if (this.receiptSelected.length === 0) {
      this.firstCedenteId = null;
      this.cedenteNombre = '';
    }
  }
  
  onItemSelect(item: any) {
    if (item.selected) {
      if (this.firstCedenteId === null) {
        // Si no hay cedentes seleccionados aún, almacena el cedenteId del primer seleccionado
        this.firstCedenteId = item.ccedente;
        this.cedenteNombre = item.xcedente; // Asume que tienes el nombre del cedente en item.xnombreCedente
        this.addToReceiptSelected(item);
      } else if (item.ccedente !== this.firstCedenteId) {
        // Si el cedenteId no coincide, muestra un mensaje de error
        Swal.fire({
          icon: 'error',
          text: `No se puede seleccionar porque ya tiene una selección de ${this.cedenteNombre}`,
        });

        item.selected = false; // Deselecciona el checkbox
      } else {
        this.addToReceiptSelected(item);
      }
    } else {
      this.removeFromReceiptSelected(item);

      // Si no quedan recibos seleccionados, reinicia el `firstCedenteId`
      if (this.receiptSelected.length === 0) {
        this.firstCedenteId = null;
        this.cedenteNombre = '';
      }
    }
  }

  addToReceiptSelected(item: any) {
    const impuestoBs = item.mimpuesto * this.bcv;
    const netoBs =  item.mnetobs;
    this.receiptSelected.push({
      id_poliza: item.id_poliza,
      nrecibo: item.nrecibo,
      mimpuesto: impuestoBs,
      mimpuestoext: item.mimpuesto,
      mcomision_n: netoBs,
      mcomision_next: item.mneto,
      mcomisionext: item.mneto,
      fcobro: new Date()
    });
    this.totalMontoNeto += item.mnetobs; // Actualiza la suma total
    this.neto = item.mneto;
    this.simbolo = 'Bs';
    this.amount = this.totalMontoNeto > 0;
  }

  removeFromReceiptSelected(item: any) {
    this.receiptSelected = this.receiptSelected.filter(selectedItem => 
      selectedItem.id_poliza !== item.id_poliza || 
      selectedItem.nrecibo !== item.nrecibo
    );
    this.totalMontoNeto -= item.mnetobs; // Actualiza la suma total

    this.amount = this.totalMontoNeto > 0;

    // Si no quedan recibos seleccionados, reinicia el `firstCedenteId`
    if (this.receiptSelected.length === 0) {
      this.firstCedenteId = null;
      this.cedenteNombre = '';
    }
  }


  searchComplement(element: any) {
    let data = {
      id_poliza: element.id_poliza,
      crecibo: element.crecibo,

    }
    this.http.post(environment.apiUrl + `/api/v1/emission/search-complement`, data).subscribe((response: any) => {
      if (response.complement) {
        const formattedComplement = response.complement.map((complement: any) => {
          return {
            ...complement,
            fmovimiento: this.dateUtilService.formatDate(new Date(complement.fmovimiento)) // Formatea la fecha
          };
        });
        this.currentRecordComplements[element.id] = formattedComplement;
      } else {
        this.currentRecordComplements[element.id] = [];
      }
    });
  }


  addComplement(element: any) {
    this.administrativeForm.get('fcomplemento')?.setValue('');
    this.administrativeForm.get('mcomplemento')?.setValue('');
    this.parametros = element;
    this.getCoins()
  
    // Asegúrate de inicializar los complementos para el registro actual si no existen
    if (!this.currentRecordComplements[element.id]) {
      this.currentRecordComplements[element.id] = [];
    }
  
    this.dialogRef = this.dialog.open(this.Complemento, {
      width: '90%',
      height: '50%',
      maxWidth: '800px'
    });
  }

  changeTasaComplemento(){
    const moneda = parseFloat(this.administrativeForm.get('cmoneda_comp')?.value) || 0

    let mcomplementoValue = parseFloat(this.administrativeForm.get('mcomplemento')?.value) || 0;

    if (moneda == 1) {
      this.simbolo = 'Dólares';
      let montoConvertido = mcomplementoValue / this.bcv;
      this.montoTransformado = montoConvertido;
    } else if (moneda == 2) { 
      this.simbolo = 'Bolívares';
      let montoConvertido = mcomplementoValue * this.bcv;
      this.montoTransformado = montoConvertido;
    }
    this.montoTransformado = this.montoTransformado.toFixed(2);
  }

  validateComplement() {
    this.snackBar.open('Recuerda que debes darle click al botón de guardar para que se apliquen los cambios', '', {
      duration: 4000,
    });
  
    // Asegúrate de agregar el complemento al registro correcto
    if (!this.currentRecordComplements[this.parametros.id]) {
      this.currentRecordComplements[this.parametros.id] = [];
    }

    this.http.post(environment.apiUrl + `/api/v1/emission/tarifas/${this.parametros.id_poliza}`, null).subscribe((response: any) => {
      if(response.status){
        const moneda = parseFloat(this.administrativeForm.get('cmoneda_comp')?.value) || 0

        if(moneda == 1){
          const ptasa_p = response.ptasa_p;
          const ptasa_e = response.ptasa_e;
          const ptasa_a = response.ptasa_a;
          const mcomplementoValue = parseFloat(this.administrativeForm.get('mcomplemento')?.value) || 0;

          //Esta comisión es en Bolívares
          const mcomision_p = mcomplementoValue * ptasa_p / 100
          const mcomision_e = mcomplementoValue * ptasa_e / 100
          const mcomision_a = mcomplementoValue * ptasa_a / 100

          //Se lleva en Dólares
          const mcomision_pext = mcomision_p / this.bcv
          const mcomision_eext = mcomision_e / this.bcv
          const mcomision_aext = mcomision_a / this.bcv
          const montoConvertido = mcomplementoValue / this.bcv;

          this.currentRecordComplements[this.parametros.id].push({
            id_poliza: this.parametros.id_poliza,
            crecibo: this.parametros.crecibo,
            itipomov: 'C',
            fmovimiento: this.administrativeForm.get('fcomplemento')?.value || new Date(),
            mpagado: mcomplementoValue,
            mpagado_ext: montoConvertido,
            mcomision_pext: mcomision_pext,
            mcomision_eext: mcomision_eext,
            mcomision_aext: mcomision_aext
          });
        }else{
          const ptasa_p = response.ptasa_p;
          const ptasa_e = response.ptasa_e;
          const ptasa_a = response.ptasa_a;
        
          // Obtener el valor de 'mcomplemento' del formulario y convertirlo a número, o usar 0 si está vacío
          const mcomplementoValue = parseFloat(this.administrativeForm.get('mcomplemento')?.value) || 0;
        
          // Calcular mcomplementoValue en bolívares y asegurarse de que tenga dos decimales
          const mcomplementoValueBs = parseFloat((mcomplementoValue * this.bcv).toFixed(2));
        
          // Calcular comisiones en bolívares
          const mcomision_p = parseFloat((mcomplementoValueBs * ptasa_p / 100).toFixed(2));
          const mcomision_e = parseFloat((mcomplementoValueBs * ptasa_e / 100).toFixed(2));
          const mcomision_a = parseFloat((mcomplementoValueBs * ptasa_a / 100).toFixed(2));
        
          // Calcular comisiones en dólares (o cualquier otra moneda) multiplicando por la tasa BCV
          const mcomision_pext = parseFloat((mcomision_p / this.bcv).toFixed(2));
          const mcomision_eext = parseFloat((mcomision_e / this.bcv).toFixed(2));
          const mcomision_aext = parseFloat((mcomision_a / this.bcv).toFixed(2));
        
          this.currentRecordComplements[this.parametros.id].push({
            id_poliza: this.parametros.id_poliza,
            crecibo: this.parametros.crecibo,
            itipomov: 'C',
            fmovimiento: this.administrativeForm.get('fcomplemento')?.value || new Date(),
            mpagado: mcomplementoValueBs,
            mpagado_ext: mcomplementoValue,
            mcomision_pext: mcomision_pext,
            mcomision_eext: mcomision_eext,
            mcomision_aext: mcomision_aext
          });
        }    

    this.newComplementAdded = true;
  
    this.dialogRef.close();
      }
    })
  

  }

  abonar(item: any){
    this.currentPolizaId = item.id_poliza
    this.currentRecibo = item.crecibo
    this.netoBs = item.mnetobs

    let data = {
      id_poliza: item.id_poliza,
      crecibo: item.crecibo
    }
    this.http.post(environment.apiUrl + `/api/v1/emission/search-fertilizers`, data).subscribe((response: any) => {
      if (response.abonos && response.abonos.length > 0) {
        this.getCoins();
        const correctedAbono = response.abonos.map((contract: any) => {
          // Convertimos la fecha a cadena antes de ajustar
          const dateAsString = new Date(contract.fmovimiento);
          contract.fmovimiento = this.dateUtilService.formatDate(dateAsString);
          return contract;
        });
        this.abonosList = correctedAbono;
        console.log(this.abonosList)
      } else {
        this.getCoins();
        this.abonosList = []; // Lista vacía si no hay abonos existentes
      }
    });

    this.dialogRef = this.dialog.open(this.Abonar, {
      width: '60%', // Ancho del diálogo
      height: '60%', // Alto del diálogo
      maxWidth: '1200px',
      maxHeight: '1200px'
    });
  }

  calcularAbonoRestante(){
     const totalAbonos = this.abonosList.reduce((sum, abono) => sum + (abono.mpagado || 0), 0);
     this.newAbono.mpagado = this.netoBs - totalAbonos;  // Calcula cuánto queda para llegar a netoBs
     this.newAbono.mpagado = this.newAbono.mpagado.toFixed(2);
  }

  validarNuevoAbono() {
    const totalAbonos = this.abonosList.reduce((sum, abono) => sum + (abono.mpagado || 0), 0);
    const maxAbono = this.netoBs + totalAbonos;

    this.http.post(environment.apiUrl + `/api/v1/emission/tarifas/${this.currentPolizaId}`, null).subscribe((response: any) => {
      const moneda = parseFloat(this.administrativeForm.get('cmoneda_abono')?.value) || 0

      if(moneda == 1){
        const ptasa_p = response.ptasa_p;
        const ptasa_e = response.ptasa_e;
        const ptasa_a = response.ptasa_a;
        const mabonoValue = parseFloat(this.administrativeForm.get('mpagado_abono')?.value) || 0;

        //Esta comisión es en Bolívares
        const mcomision_p = mabonoValue * ptasa_p / 100
        const mcomision_e = mabonoValue * ptasa_e / 100
        const mcomision_a = mabonoValue * ptasa_a / 100

        //Se lleva en Dólares
        const mcomision_pext = mcomision_p / this.bcv
        const mcomision_eext = mcomision_e / this.bcv
        const mcomision_aext = mcomision_a / this.bcv
        const montoConvertido = mabonoValue / this.bcv;

        this.abonoObject = {
          fmovimiento: this.administrativeForm.get('fabono')?.value,
          mpagado: mabonoValue,
          mpagado_ext: montoConvertido,
          id_poliza: this.currentPolizaId,
          crecibo: this.currentRecibo,
          itipomov: 'A',
          mcomision_pext: mcomision_pext, 
          mcomision_eext: mcomision_eext, 
          mcomision_aext: mcomision_aext, 
        }

        this.montoTransformado = montoConvertido.toFixed(2);
        this.simbolo = 'Dólares';

      }else{
        const ptasa_p = response.ptasa_p;
        const ptasa_e = response.ptasa_e;
        const ptasa_a = response.ptasa_a;
      
        // Obtener el valor de 'mcomplemento' del formulario y convertirlo a número, o usar 0 si está vacío
        const mabonoValue = parseFloat(this.administrativeForm.get('mpagado_abono')?.value) || 0;
      
        // Calcular mabonoValue en bolívares y asegurarse de que tenga dos decimales
        const mabonoValueBs = parseFloat((mabonoValue * this.bcv).toFixed(2));
      
        // Calcular comisiones en bolívares
        const mcomision_p = parseFloat((mabonoValueBs * ptasa_p / 100).toFixed(2));
        const mcomision_e = parseFloat((mabonoValueBs * ptasa_e / 100).toFixed(2));
        const mcomision_a = parseFloat((mabonoValueBs * ptasa_a / 100).toFixed(2));
      
        // Calcular comisiones en dólares (o cualquier otra moneda) multiplicando por la tasa BCV
        const mcomision_pext = parseFloat((mcomision_p / this.bcv).toFixed(2));
        const mcomision_eext = parseFloat((mcomision_e / this.bcv).toFixed(2));
        const mcomision_aext = parseFloat((mcomision_a / this.bcv).toFixed(2));

        this.abonoObject = {
          fmovimiento: this.administrativeForm.get('fabono')?.value,
          mpagado: mabonoValueBs,
          mpagado_ext: mabonoValue,
          id_poliza: this.currentPolizaId,
          crecibo: this.currentRecibo,
          itipomov: 'A',
          mcomision_pext: mcomision_pext, 
          mcomision_eext: mcomision_eext, 
          mcomision_aext: mcomision_aext, 
        }

        this.montoTransformado = mabonoValueBs.toFixed(2);
        this.simbolo = 'Bolívares';
      
      }   
    })

  }

  guardarNuevoAbono() {
    this.dialogRef.close();
  
    Swal.fire({
      title: "Adjunte el comprobante (opcional)",
      html: `
        <div style="text-align: center;">
          <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="loadFile(event)">
          <label for="fileInput" style="cursor: pointer;">
            <div id="filePreview" style="border: 2px dashed #ccc; padding: 20px; width: 450px; height: 200px;">
              Arrastra o haz clic para adjuntar la imagen (opcional)
            </div>
          </label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#5e72e4",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: async () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        
        let rutaCapture: string | null = null;
  
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const fileName = fileInput.files[0].name;
  
          // Convertir el archivo a base64 o enviarlo directamente en el FormData
          const formData = new FormData();
          formData.append('file', file, fileName);
          formData.append('fileName', fileName);
  
          try {
            const responseImg = await this.http.post(environment.apiUrl + '/api/upload/document/emission', formData).toPromise();
            rutaCapture = environment.apiUrl + responseImg['data']['url'];
          } catch (err) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al subir el archivo',
            });
            throw new Error('Error al subir el archivo');
          }
        }

        this.abonoObject.xruta_tipomov = rutaCapture;
        // Registrar el abono, con o sin comprobante
        try {

          const response = await this.http.post(environment.apiUrl + `/api/v1/emission/add-abono`, this.abonoObject).toPromise();
          
          if (response) {
            Swal.close();
            Swal.fire({
              icon: "success",
              title: `Se ha registrado el abono exitosamente`,
              showConfirmButton: false,
              timer: 4000
            }).then(() => {
              const totalAbonos = this.abonosList.reduce((sum, abono) => sum + (abono.mpagado || 0), 0);
              const maxAbono = totalAbonos + this.newAbono.mpagado;
  
              if (maxAbono > this.netoBs) {
                Swal.fire({
                  icon: 'info',
                  text: `Recuerda que el monto de abono superó el Monto Neto, por ende se regularizará el recibo`,
                  showConfirmButton: false,
                  timer: 4000
                }).then(() => {
                  location.reload();
                });
              } else {
                location.reload();
              }
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No se pudo realizar el abono`,
          });
        }
      },
    });
  
    // Funcionalidad para mostrar la previsualización de la imagen seleccionada
    const loadFile = (event: any) => {
      const preview = document.getElementById('filePreview');
      if (preview && event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;" />`;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    };
  
    // Manejar el evento de arrastrar y soltar
    const filePreview = document.getElementById('filePreview');
    if (filePreview) {
      filePreview.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
        filePreview.style.borderColor = '#5e72e4'; // Cambiar el color del borde al arrastrar
      });
  
      filePreview.addEventListener('drop', (e: DragEvent) => {
        e.preventDefault();
        filePreview.style.borderColor = '#ccc'; // Volver el borde al color original
  
        const files = e.dataTransfer?.files;
        if (files && files[0]) {
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          fileInput.files = files; // Asignar el archivo arrastrado al input
          loadFile({ target: { files } }); // Mostrar la previsualización
        }
      });
  
      filePreview.addEventListener('dragleave', () => {
        filePreview.style.borderColor = '#ccc';
      });
    }
  
    window['loadFile'] = loadFile;
  }
  

  onSubmitComplement() {
    Swal.fire({
      title: "Adjunte el comprobante",
      html: `
        <div style="text-align: center;">
          <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="loadFile(event)">
          <label for="fileInput" style="cursor: pointer;">
            <div id="filePreview" style="border: 2px dashed #ccc; padding: 20px; width: 450px; height: 200px;">
              Arrastra o haz clic para adjuntar la imagen
            </div>
          </label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#5e72e4",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      preConfirm: async () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        let rutaCapture = null; // Inicializamos la variable de ruta de captura como null
  
        // Si hay un archivo seleccionado, subimos la imagen
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const fileName = fileInput.files[0].name;
  
          // Crear FormData para el archivo
          const formData = new FormData();
          formData.append('file', file, fileName);
          formData.append('fileName', fileName);
  
          // Subir la imagen
          const responseImg = this.http.post(environment.apiUrl + '/api/upload/document/emission', formData);
  
          // Esperar la respuesta de la imagen antes de continuar
          await responseImg.toPromise().then((data: any) => {
            rutaCapture = environment.apiUrl + data['data']['url'];
          }).catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo subir el archivo.',
            });
          });
        }
  
        // Proseguir con el guardado del complemento
        try {
          const data = {
            complemento: Object.values(this.currentRecordComplements).flat().map((item: any) => {
              return {
                ...item, // Mantener el resto de las propiedades originales
                xruta_tipomov: rutaCapture || null // Si no hay imagen, se guarda como null
              };
            })
          };
  
          // Realizar la solicitud para guardar el complemento
          this.http.post(environment.apiUrl + `/api/v1/emission/complement`, data).subscribe((response: any) => {
            if (response.status) {
              Swal.fire({
                icon: "success",
                title: `¡Se ha ingresado el complemento exitosamente!`,
                showConfirmButton: false,
                timer: 4000
              }).then(() => {
                location.reload();
              });
            }
          }, (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `No se pudo ingresar el complemento`,
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
    });
  
    // Funcionalidad para previsualizar la imagen seleccionada
    const loadFile = (event: any) => {
      const preview = document.getElementById('filePreview');
      if (preview && event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;" />`;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    };
  
    // Manejar el evento de arrastrar y soltar
    const filePreview = document.getElementById('filePreview');
    if (filePreview) {
      // Cuando se arrastra algo sobre el área de previsualización
      filePreview.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
        filePreview.style.borderColor = '#5e72e4'; // Cambiar el color del borde al arrastrar
      });
  
      // Cuando el usuario suelta el archivo sobre el área de previsualización
      filePreview.addEventListener('drop', (e: DragEvent) => {
        e.preventDefault();
        filePreview.style.borderColor = '#ccc'; // Volver el borde al color original
  
        const files = e.dataTransfer?.files;
        if (files && files[0]) {
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          fileInput.files = files; // Asignar el archivo arrastrado al input
          loadFile({ target: { files } }); // Mostrar la previsualización
        }
      });
  
      // Restablecer el estilo cuando el usuario deja de arrastrar fuera del área
      filePreview.addEventListener('dragleave', () => {
        filePreview.style.borderColor = '#ccc';
      });
    }
  
    // Hacer que 'loadFile' sea accesible desde el código inline de la alerta
    window['loadFile'] = loadFile;
  }

  validateCobro() {
    const banco = this.administrativeForm.get('cbanco')?.value;
    const referencia = this.administrativeForm.get('xreferencia')?.value;
    if (banco && referencia) {
      this.receiptSelected.forEach(item => {
        item.cbanco = banco;
        item.xreferencia = referencia;
        item.cmoneda_cobro = this.monedaDebanco;
        item.mingreso = item.mcomision_n;
        item.iestado = 'CO';
      });
  
      Swal.fire({
        title: "Adjunte el comprobante (opcional)",
        html: `
          <div style="text-align: center;">
            <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="loadFile(event)">
            <label for="fileInput" style="cursor: pointer;">
              <div id="filePreview" style="border: 2px dashed #ccc; padding: 20px; width: 450px; height: 200px;">
                Arrastra o haz clic para adjuntar la imagen (opcional)
              </div>
            </label>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5e72e4",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: async () => {
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  
          // Si no hay archivo seleccionado, continúa sin subir archivo
          if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const fileName = fileInput.files[0].name;
  
            // Convertir el archivo a base64 o enviarlo directamente en el FormData
            const formData = new FormData();
            formData.append('file', file, fileName);
            formData.append('fileName', fileName);
  
            const responseImg = this.http.post(environment.apiUrl + '/api/upload/document/emission', formData);
  
            return responseImg.toPromise().then(data => {
              this.rutaCapture = environment.apiUrl + data['data']['url'];
  
              // Si se sube una imagen, asigna la ruta a los recibos seleccionados
              this.receiptSelected.forEach(item => {
                item.xruta_cobro = this.rutaCapture;
              });
            }).catch(err => {
              // Si algo falla con la subida del archivo, muestra un mensaje de error
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al subir el archivo',
              });
              return false;
            });
          } else {
            // Si no se selecciona ningún archivo, simplemente retorna true para continuar
            return true;
          }
        },
      }).then(result => {
        // Solo si el proceso de subir archivo o la confirmación sin archivo fue exitosa
        if (result.isConfirmed) {
          try {
            let data = {
              recibos: this.receiptSelected
            };
  
            this.http.post(environment.apiUrl + `/api/v1/emission/update-receipt`, data).subscribe((response: any) => {
              if (response.status_receipt) {
                Swal.close();
                Swal.fire({
                  icon: "success",
                  title: `Se ha registrado el cobro exitosamente`,
                  showConfirmButton: false,
                  timer: 4000
                }).then(() => {
                  location.reload();
                });
              }
            }, (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo actualizar el cobro`,
              });
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Request failed: ${error.message}`,
            });
          }
        }
      });
  
      // Funcionalidad de previsualización de la imagen seleccionada
      const loadFile = (event: any) => {
        const preview = document.getElementById('filePreview');
        if (preview && event.target.files && event.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;" />`;
          };
          reader.readAsDataURL(event.target.files[0]);
        }
      };
  
      // Manejar el evento de arrastrar y soltar
      const filePreview = document.getElementById('filePreview');
      if (filePreview) {
        filePreview.addEventListener('dragover', (e: DragEvent) => {
          e.preventDefault();
          filePreview.style.borderColor = '#5e72e4'; // Cambiar el color del borde al arrastrar
        });
  
        filePreview.addEventListener('drop', (e: DragEvent) => {
          e.preventDefault();
          filePreview.style.borderColor = '#ccc'; // Volver el borde al color original
  
          const files = e.dataTransfer?.files;
          if (files && files[0]) {
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            fileInput.files = files; // Asignar el archivo arrastrado al input
            loadFile({ target: { files } }); // Mostrar la previsualización
          }
        });
  
        filePreview.addEventListener('dragleave', () => {
          filePreview.style.borderColor = '#ccc';
        });
      }
  
      window['loadFile'] = loadFile;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos',
      });
    }
  }
  

  calcularFechaHasta() {
    // Suponiendo que tienes una variable que almacena la fecha inicial
    const fechaDesde = new Date(this.commisionsForm.get('fdesde')?.value);
  
    // Crear una nueva fecha sumando un mes
    const fechaHasta = new Date(fechaDesde);
    fechaHasta.setMonth(fechaHasta.getMonth() + 1);
  
    // Establecer la nueva fecha en el campo correspondiente
    this.commisionsForm.get('fhasta')?.setValue(fechaHasta.toISOString().split('T')[0]);  // Formato YYYY-MM-DD
  }

  searchDistributions(ccedente: string) {
    let data = {
      fdesde: this.commisionsForm.get('fdesde')?.value,
      fhasta: this.commisionsForm.get('fhasta')?.value,
      ccedente: ccedente
    };
    this.http.post(environment.apiUrl + '/api/v1/emission/search-distribution', data).subscribe((response: any) => {
      this.distributionList = response.distribucion;
      console.log(this.distributionList)
      // Agrupar por productor y sumar comisiones
      this.productores = this.distributionList.reduce((acc: any[], item: any) => {
        // Solo agregamos productores que no tienen un valor en 'fpago_p'
        let existingProductor = acc.find(p => p.cproductor === item.cproductor);
          
        if (existingProductor) {
          // Si ya existe el productor, sumamos la comisión y redondeamos a dos decimales
          const comisionActual = existingProductor.mcomision_pext || 0; // Asegura que no sea null/undefined
          existingProductor.mcomision_pext = parseFloat((comisionActual + (item.mcomision_pext || 0)).toFixed(2));

          const comisionActualBs = existingProductor.mcomision_p || 0; // Asegura que no sea null/undefined
          existingProductor.mcomision_p = parseFloat((comisionActualBs + (item.mcomision_p || 0)).toFixed(2));
        } else {
          // Si no existe, lo agregamos al array con toda su información
          acc.push({
            cproductor: item.cproductor,
            xproductor: item.xproductor,
            mcomision_p: parseFloat((item.mcomision_p || 0).toFixed(2)), // Inicializamos con el valor redondeado
            mcomision_pext: parseFloat((item.mcomision_pext || 0).toFixed(2)),
          });
        }
      
        return acc;
      }, []);
      
      // Agrupar por ejecutivo y sumar comisiones con dos decimales
      this.ejecutivos = this.distributionList.reduce((acc: any[], item: any) => {
        
        if (!item.fpago_e) {
          let existingEjecutivo = acc.find(e => e.cejecutivo === item.cejecutivo);
      
          if (existingEjecutivo) {
            const comisionActual = existingEjecutivo.mcomision_eext || 0;
            existingEjecutivo.mcomision_eext = parseFloat((comisionActual + (item.mcomision_eext || 0)).toFixed(2));
          } else {
            
            // Si no existe, lo agregamos al array solo si 'fpago_e' no tiene valor o si 'fpago_a' es null
            if (!item.fpago_e || item.fpago_a === null) {
              acc.push({
                cejecutivo: item.cejecutivo,
                xejecutivo: item.xejecutivo,
                mcomision_e: parseFloat((item.mcomision_e || 0).toFixed(2)),
                mcomision_eext: parseFloat((item.mcomision_eext || 0).toFixed(2)),
                distributeComision: true
              });
            }
          }
        }

        return acc;
      }, [])

      this.ejecutivos.forEach(element => {
        let existingEjecutivo = this.distributionList.find(e => {
          if(e.cejecutivo === element.cejecutivo && e.fpago_e) {
            return e
          }
        });
        if(existingEjecutivo) {
          element.distributeComision = false
        }
        
      });

      this.agentes = this.distributionList.reduce((acc: any[], item: any) => {

        if (!item.fpago_a && item.cagente != null) {
          let existingAgente = acc.find(a => a.cagente === item.cagente);
      
          if (existingAgente) {
            // Si el agente ya existe en el array, sumamos la comisión
            const comisionActual = existingAgente.mcomision_aext || 0; // Asegura que no sea null/undefined
            existingAgente.mcomision_aext = parseFloat((comisionActual + (item.mcomision_aext || 0)).toFixed(2));
          } else {
            // Si no existe, lo agregamos con la información y la comisión inicial
            acc.push({
              cagente: item.cagente,
              xagente: item.xagente,
              mcomision_a: parseFloat((item.mcomision_a || 0).toFixed(2)), // Iniciar con la comisión actual
              mcomision_aext: parseFloat((item.mcomision_aext || 0).toFixed(2)),
            });
          }      
        }

        return acc;
      }, []);

      

    });
  }

  // verDetallesProductor(cproductor: string) {
  //   const productor = this.distributionList.filter(item => item.cproductor === cproductor && !item.fpago_p);
  //   this.detalleProductores = productor

  //   this.dialogRef = this.dialog.open(this.DetalleProductor, {
  //     width: '90%', // Ancho del diálogo
  //     height: '90%', // Alto del diálogo
  //     maxWidth: '1200px',
  //     maxHeight: '1200px'
  //   });
  // }

  getTipoMovimiento(tipo: string): string {
    switch (tipo) {
      case 'N':
        return 'Recibo Directo';
      case 'A':
        return 'Abonado';
      case 'C':
        return 'Complemento';
      default:
        return 'Desconocido';
    }
  }
  
  // pagarProductor(cproductor: string, mcomision_p: any) {
  //   this.parametros = cproductor
  //   this.commisionsForm.get('mmonto_p')?.setValue('  ' + mcomision_p)
  //   this.dialogRef = this.dialog.open(this.PagarProductor, {
  //     width: '60%', // Ancho del diálogo
  //     height: '60%', // Alto del diálogo
  //     maxWidth: '1200px',
  //     maxHeight: '1200px'
  //   });
  // }

  // guardarPagoProductor() {
  //   // Filtra los productores que coincidan con `cproductor`
  //   const productores = this.distributionList.filter(item => item.cproductor === this.parametros);
    
  //   // Recorre cada productor filtrado y actualiza los valores
  //   productores.forEach(productor => {
  //     productor.fpago_p = this.commisionsForm.get('fpago_p')?.value;
  //     productor.cbanco_p = this.commisionsForm.get('cbanco_p')?.value;
  //     productor.xreferencia_p = this.commisionsForm.get('xreferencia_p')?.value;
  //     productor.cmoneda_p = this.commisionsForm.get('cmoneda_p')?.value;
  //   });
  
  //   // Define los controles y sus nombres amigables
  //   const formControls = [
  //     { name: 'cbanco_p', value: this.commisionsForm.get('cbanco_p')?.value },
  //     { name: 'fpago_p', value: this.commisionsForm.get('fpago_p')?.value },
  //     { name: 'xreferencia_p', value: this.commisionsForm.get('xreferencia_p')?.value },
  //     { name: 'cmoneda_p', value: this.commisionsForm.get('cmoneda_p')?.value }
  //   ];
  
  //   const friendlyNames: { [key: string]: string } = {
  //     cbanco_p: 'Banco',
  //     fpago_p: 'Fecha de Pago',
  //     xreferencia_p: 'Referencia',
  //     cmoneda_p: 'Moneda',
  //   };
  
  //   let camposFaltantes: string[] = [];
  
  //   // Recorre cada control y verifica si el valor es nulo o vacío
  //   formControls.forEach(control => {
  //     const formControl = this.commisionsForm.get(control.name);
  
  //     // Verifica si el valor es nulo, vacío, o no está definido
  //     if (!control.value || control.value === '') {
  //       formControl.setValidators([Validators.required]);
  //       formControl.markAsTouched();
  //       formControl.markAsDirty();
  
  //       // Agrega el nombre amigable del campo faltante
  //       camposFaltantes.push(friendlyNames[control.name] || control.name);
  //     } else {
  //       formControl.clearValidators();
  //     }
  //     formControl.updateValueAndValidity({ onlySelf: true });
  //   });
  
  //   // Si hay campos faltantes, mostrar alerta
  //   if (camposFaltantes.length > 0) {
  //     Swal.fire({
  //       title: "Por favor, complete campos requeridos.",
  //       html: `
  //         <p>Estimado Usuario, para realizar el pago a ${productores[0].xproductor} se requieren:</p>
  //         <ul><li>${camposFaltantes.join('</li><li>')}</li></ul>`,
  //       icon: "warning",
  //       confirmButtonText: "<strong>Aceptar</strong>",
  //       confirmButtonColor: "#5d87ff",
  //     });
  //   } else {
  //     // Si no hay campos faltantes, procesar los datos
  //     Swal.fire({
  //       title: "Adjunte el comprobante",
  //       html: `
  //         <div style="text-align: center;">
  //           <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="loadFile(event)">
  //           <label for="fileInput" style="cursor: pointer;">
  //             <div id="filePreview" style="border: 2px dashed #ccc; padding: 20px; width: 450px; height: 200px;">
  //               Arrastra o haz clic para adjuntar la imagen
  //             </div>
  //           </label>
  //         </div>
  //       `,
  //       showCancelButton: true,
  //       confirmButtonText: "Aceptar",
  //       confirmButtonColor: "#5e72e4",
  //       cancelButtonText: "Cancelar",
  //       showLoaderOnConfirm: true,
  //       allowOutsideClick: false,
  //       preConfirm: async () => {
  //         const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  //         let rutaCapture = null;
      
  //         if (fileInput.files && fileInput.files[0]) {
  //           const file = fileInput.files[0];
  //           const fileName = fileInput.files[0].name;
      
  //           // Crear FormData para el archivo
  //           const formData = new FormData();
  //           formData.append('file', file, fileName);
  //           formData.append('fileName', fileName);
      
  //           // Subir la imagen
  //           const responseImg = this.http.post(environment.apiUrl + '/api/upload/document/emission', formData);
      
  //           // Esperar la respuesta de la imagen antes de continuar
  //           await responseImg.toPromise().then((data: any) => {
  //             rutaCapture = environment.apiUrl + data['data']['url'];

  //             productores.forEach(item => {
  //               item.xruta_p = rutaCapture;
  //             });
  //           }).catch(() => {
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error',
  //               text: 'No se pudo subir el archivo.',
  //             });
  //           });
  //         }
      
  //         try {
  //           let data = {
  //             productores: productores
  //           }
  
  //           this.http.post(environment.apiUrl + `/api/v1/emission/add-paymentProductor`, data).subscribe((response: any) => {
  //             if (response.status) {
  //               Swal.close();
  //               Swal.fire({
  //                 icon: "success",
  //                 title: `Se ha registrado el Pago al Productor exitosamente`,
  //                 showConfirmButton: false,
  //                 timer: 4000
  //               }).then((result) => {
  //                 location.reload()
  //               });
  //             }
  //           },(err)=>{
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error',
  //               text: `No se pudo realizar el abono`,
  //             });
  //           });
  //         } catch (error) {
  //           // Mostrar un mensaje de error si algo falla
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: `Request failed: ${error.message}`,
  //           });
  //         }
  //       },
  //     });
  //         // Añadir funcionalidad para mostrar la previsualización de la imagen seleccionada
  //   const loadFile = (event: any) => {
  //     const preview = document.getElementById('filePreview');
  //     if (preview && event.target.files && event.target.files[0]) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;" />`;
  //       };
  //       reader.readAsDataURL(event.target.files[0]);
  //     }
  //   };
  
  //   // Manejar el evento de arrastrar y soltar
  //   const filePreview = document.getElementById('filePreview');
  //   if (filePreview) {
  //     // Cuando se arrastra algo sobre el área de previsualización
  //     filePreview.addEventListener('dragover', (e: DragEvent) => {
  //       e.preventDefault();
  //       filePreview.style.borderColor = '#5e72e4'; // Cambiar el color del borde al arrastrar
  //     });
  
  //     // Cuando el usuario suelta el archivo sobre el área de previsualización
  //     filePreview.addEventListener('drop', (e: DragEvent) => {
  //       e.preventDefault();
  //       filePreview.style.borderColor = '#ccc'; // Volver el borde al color original
  
  //       const files = e.dataTransfer?.files;
  //       if (files && files[0]) {
  //         const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  //         fileInput.files = files; // Asignar el archivo arrastrado al input
  //         loadFile({ target: { files } }); // Mostrar la previsualización
  //       }
  //     });
  
  //     // Restablecer el estilo cuando el usuario deja de arrastrar fuera del área
  //     filePreview.addEventListener('dragleave', () => {
  //       filePreview.style.borderColor = '#ccc';
  //     });
  //   }
  
  //   // Hacer que 'loadFile' sea accesible desde el código inline de la alerta
  //   window['loadFile'] = loadFile;
  //   }
  
  //   // Actualiza la validez general del formulario
  //   this.commisionsForm.updateValueAndValidity();
  // }
  
  verDetallesEjecutivo(cejecutivo: string) {
    this.detalleEjecutivos = []
    const ejecutivo = this.distributionList.filter(item => {
      if(item.cejecutivo === cejecutivo && !item.fpago_e) {
        return item
      }
    });
    this.detalleEjecutivos = ejecutivo
    this.dialogRef = this.dialog.open(this.DetalleEjecutivo, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px',
      maxHeight: '1200px'
    });
  }
  listarComisiones(cejecutivo: string) {
    this.detalleEjecutivos = []
    this.http.post(environment.apiUrl + `/api/v1/emission/searchContracts/${cejecutivo}`, {}).subscribe((data:any) => {
      console.log(data);
      const ejecutivo = data.data
      this.detalleEjecutivos = ejecutivo
      this.dialogRef = this.dialog.open(this.ListarComisiones, {
        width: '90%', // Ancho del diálogo
        height: '90%', // Alto del diálogo
        maxWidth: '1200px',
        maxHeight: '1200px'
      });
    })
  }
  selectPoliza(poliza) {
    this.polizaACambiar = poliza
    // this.genericFormGroup.get('mcomision_p')?.setValue()
    this.dialogRef = this.dialog.open(this.CambiarComision, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px',
      maxHeight: '1200px'
    });
  }
  
  pagarEjecutivo(cejecutivo: string, mcomision_e: any, mcomision_eext: any) {
    this.parametros = cejecutivo
    this.mcomision_e = mcomision_e
    this.mcomision_eext = mcomision_eext
    this.commisionsForm.get('mmonto_e')?.setValue('  ' + mcomision_e)
    this.dialogRef = this.dialog.open(this.PagarEjecutivo, {
      width: '60%', // Ancho del diálogo
      height: '60%', // Alto del diálogo
      maxWidth: '1200px',
      maxHeight: '1200px'
    });
  }

  guardarPagoEjecutivo() {
    // Filtra los productores que coincidan con `cejecutivo`
    const ejecutivos = this.distributionList.filter(item => item.cejecutivo === this.parametros);
    
    // Recorre cada productor filtrado y actualiza los valores
    ejecutivos.forEach(ejecutivo => {
      ejecutivo.fpago_e = this.commisionsForm.get('fpago_e')?.value;
      ejecutivo.cbanco_e = this.commisionsForm.get('cbanco_e')?.value;
      ejecutivo.xreferencia_e = this.commisionsForm.get('xreferencia_e')?.value;
      ejecutivo.cmoneda_e = this.commisionsForm.get('cmoneda_e')?.value;
    });
  
    // Define los controles y sus nombres amigables
    const formControls = [
      { name: 'cbanco_e', value: this.commisionsForm.get('cbanco_e')?.value },
      { name: 'fpago_e', value: this.commisionsForm.get('fpago_e')?.value },
      { name: 'xreferencia_e', value: this.commisionsForm.get('xreferencia_e')?.value },
      { name: 'cmoneda_e', value: this.commisionsForm.get('cmoneda_e')?.value }
    ];
  
    const friendlyNames: { [key: string]: string } = {
      cbanco_e: 'Banco',
      fpago_e: 'Fecha de Pago',
      xreferencia_e: 'Referencia',
      cmoneda_e: 'Moneda',
    };
  
    let camposFaltantes: string[] = [];
  
    // Recorre cada control y verifica si el valor es nulo o vacío
    formControls.forEach(control => {
      const formControl = this.commisionsForm.get(control.name);
  
      // Verifica si el valor es nulo, vacío, o no está definido
      if (!control.value || control.value === '') {
        formControl.setValidators([Validators.required]);
        formControl.markAsTouched();
        formControl.markAsDirty();
  
        // Agrega el nombre amigable del campo faltante
        camposFaltantes.push(friendlyNames[control.name] || control.name);
      } else {
        formControl.clearValidators();
      }
      formControl.updateValueAndValidity({ onlySelf: true });
    });
  
    // Si hay campos faltantes, mostrar alerta
    if (camposFaltantes.length > 0) {
      Swal.fire({
        title: "Por favor, complete campos requeridos.",
        html: `
          <p>Estimado Usuario, para realizar el pago a ${ejecutivos[0].xejecutivo} se requieren:</p>
          <ul><li>${camposFaltantes.join('</li><li>')}</li></ul>`,
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5d87ff",
      });
    } else {
      // Si no hay campos faltantes, procesar los datos
      Swal.fire({
        title: "Adjunte el comprobante",
        html: `
          <div style="text-align: center;">
            <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="loadFile(event)">
            <label for="fileInput" style="cursor: pointer;">
              <div id="filePreview" style="border: 2px dashed #ccc; padding: 20px; width: 450px; height: 200px;">
                Arrastra o haz clic para adjuntar la imagen
              </div>
            </label>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5e72e4",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: async () => {
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          let rutaCapture = null;
      
          if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const fileName = fileInput.files[0].name;
      
            // Crear FormData para el archivo
            const formData = new FormData();
            formData.append('file', file, fileName);
            formData.append('fileName', fileName);
      
            // Subir la imagen
            const responseImg = this.http.post(environment.apiUrl + '/api/upload/document/emission', formData);
      
            // Esperar la respuesta de la imagen antes de continuar
            await responseImg.toPromise().then((data: any) => {
              rutaCapture = environment.apiUrl + data['data']['url'];

              ejecutivos.forEach(item => {
                item.xruta_e = rutaCapture;
              });
            }).catch(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo subir el archivo.',
              });
            });
          }
      
          try {
            let data = {
              ejecutivos: ejecutivos
            }
            this.http.post(environment.apiUrl + `/api/v1/emission/add-paymentEjecutivo`, data).subscribe((response: any) => {
              if (response.status) {
                Swal.close();
                Swal.fire({
                  icon: "success",
                  title: `Se ha registrado el Pago al Ejecutivo exitosamente`,
                  showConfirmButton: false,
                  timer: 4000
                }).then((result) => {
                  location.reload()
                });
              }
            },(err)=>{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo realizar el abono`,
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
      });

      
    }
          // Añadir funcionalidad para mostrar la previsualización de la imagen seleccionada
          const loadFile = (event: any) => {
            const preview = document.getElementById('filePreview');
            if (preview && event.target.files && event.target.files[0]) {
              const reader = new FileReader();
              reader.onload = (e: any) => {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;" />`;
              };
              reader.readAsDataURL(event.target.files[0]);
            }
          };
        
          // Manejar el evento de arrastrar y soltar
          const filePreview = document.getElementById('filePreview');
          if (filePreview) {
            // Cuando se arrastra algo sobre el área de previsualización
            filePreview.addEventListener('dragover', (e: DragEvent) => {
              e.preventDefault();
              filePreview.style.borderColor = '#5e72e4'; // Cambiar el color del borde al arrastrar
            });
        
            // Cuando el usuario suelta el archivo sobre el área de previsualización
            filePreview.addEventListener('drop', (e: DragEvent) => {
              e.preventDefault();
              filePreview.style.borderColor = '#ccc'; // Volver el borde al color original
        
              const files = e.dataTransfer?.files;
              if (files && files[0]) {
                const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                fileInput.files = files; // Asignar el archivo arrastrado al input
                loadFile({ target: { files } }); // Mostrar la previsualización
              }
            });
        
            // Restablecer el estilo cuando el usuario deja de arrastrar fuera del área
            filePreview.addEventListener('dragleave', () => {
              filePreview.style.borderColor = '#ccc';
            });
          }
        
          // Hacer que 'loadFile' sea accesible desde el código inline de la alerta
          window['loadFile'] = loadFile;
    // Actualiza la validez general del formulario
    this.commisionsForm.updateValueAndValidity();
  }

  verDetallesAgente(cagente: string) {
    const agente = this.distributionList.filter(item => item.cagente === cagente);
    this.detalleAgentes = agente

    this.dialogRef = this.dialog.open(this.DetalleAgente, {
      width: '90%', // Ancho del diálogo
      height: '90%', // Alto del diálogo
      maxWidth: '1200px',
      maxHeight: '1200px'
    });
  }
  
  pagarAgente(cagente: string, mcomision_a: any, mcomision_aext: any) {
    this.parametros = cagente
    this.mcomision_a = mcomision_a
    this.mcomision_aext = mcomision_aext
    this.commisionsForm.get('mmonto_a')?.setValue('    ' + mcomision_a)
    this.dialogRef = this.dialog.open(this.PagarAgente, {
      width: '60%', // Ancho del diálogo
      height: '60%', // Alto del diálogo
      maxWidth: '1200px',
      maxHeight: '1200px'
    });
  }

  guardarPagoAgente() {
    // Filtra los productores que coincidan con `cagente`
    const agentes = this.distributionList.filter(item => item.cagente === this.parametros);
    
    // Recorre cada productor filtrado y actualiza los valores
    agentes.forEach(agente => {
      agente.fpago_a = this.commisionsForm.get('fpago_a')?.value;
      agente.cbanco_a = this.commisionsForm.get('cbanco_a')?.value;
      agente.xreferencia_a = this.commisionsForm.get('xreferencia_a')?.value;
      agente.cmoneda_a = this.commisionsForm.get('cmoneda_a')?.value;
    });
  
    // Define los controles y sus nombres amigables
    const formControls = [
      { name: 'cbanco_a', value: this.commisionsForm.get('cbanco_a')?.value },
      { name: 'fpago_a', value: this.commisionsForm.get('fpago_a')?.value },
      { name: 'xreferencia_a', value: this.commisionsForm.get('xreferencia_a')?.value },
      { name: 'cmoneda_a', value: this.commisionsForm.get('cmoneda_a')?.value }
    ];
  
    const friendlyNames: { [key: string]: string } = {
      cbanco_a: 'Banco',
      fpago_a: 'Fecha de Pago',
      xreferencia_a: 'Referencia',
      cmoneda_a: 'Moneda',
    };
  
    let camposFaltantes: string[] = [];
  
    // Recorre cada control y verifica si el valor es nulo o vacío
    formControls.forEach(control => {
      const formControl = this.commisionsForm.get(control.name);
  
      // Verifica si el valor es nulo, vacío, o no está definido
      if (!control.value || control.value === '') {
        formControl.setValidators([Validators.required]);
        formControl.markAsTouched();
        formControl.markAsDirty();
  
        // Agrega el nombre amigable del campo faltante
        camposFaltantes.push(friendlyNames[control.name] || control.name);
      } else {
        formControl.clearValidators();
      }
      formControl.updateValueAndValidity({ onlySelf: true });
    });
  
    // Si hay campos faltantes, mostrar alerta
    if (camposFaltantes.length > 0) {
      Swal.fire({
        title: "Por favor, complete campos requeridos.",
        html: `
          <p>Estimado Usuario, para realizar el pago a ${agentes[0].xagente} se requieren:</p>
          <ul><li>${camposFaltantes.join('</li><li>')}</li></ul>`,
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5d87ff",
      });
    } else {
      // Si no hay campos faltantes, procesar los datos
      Swal.fire({
        title: "Adjunte el comprobante",
        html: `
          <div style="text-align: center;">
            <input type="file" id="fileInput" accept="image/*" style="display:none" onchange="loadFile(event)">
            <label for="fileInput" style="cursor: pointer;">
              <div id="filePreview" style="border: 2px dashed #ccc; padding: 20px; width: 450px; height: 200px;">
                Arrastra o haz clic para adjuntar la imagen
              </div>
            </label>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#5e72e4",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: async () => {
          // // Cerramos el modal original para proceder con la lógica
          // Swal.close();
      
          // // Muestra un modal de "Espere por favor..." mientras se realiza la consulta a la API
          // Swal.fire({
          //   title: 'Espere por favor...',
          //   text: 'Procesando su solicitud',
          //   allowOutsideClick: false,
          //   didOpen: () => {
          //     Swal.showLoading();
          //   }
          // });

          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          let rutaCapture = null;
      
          if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const fileName = fileInput.files[0].name;
      
            // Crear FormData para el archivo
            const formData = new FormData();
            formData.append('file', file, fileName);
            formData.append('fileName', fileName);
      
            // Subir la imagen
            const responseImg = this.http.post(environment.apiUrl + '/api/upload/document/emission', formData);
      
            // Esperar la respuesta de la imagen antes de continuar
            await responseImg.toPromise().then((data: any) => {
              rutaCapture = environment.apiUrl + data['data']['url'];

              agentes.forEach(item => {
                item.xruta_a = rutaCapture;
              });
            }).catch(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo subir el archivo.',
              });
            });
          }
      
          try {
            let data = {
              agentes: agentes
            }
  
            this.http.post(environment.apiUrl + `/api/v1/emission/add-paymentAgente`, data).subscribe((response: any) => {
              if (response.status) {
                Swal.close();
                Swal.fire({
                  icon: "success",
                  title: `Se ha registrado el Pago al Agente exitosamente`,
                  showConfirmButton: false,
                  timer: 4000
                }).then((result) => {
                  location.reload()
                });
              }
            },(err)=>{
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo realizar el abono`,
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
      });
    }
          // Añadir funcionalidad para mostrar la previsualización de la imagen seleccionada
          const loadFile = (event: any) => {
            const preview = document.getElementById('filePreview');
            if (preview && event.target.files && event.target.files[0]) {
              const reader = new FileReader();
              reader.onload = (e: any) => {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;" />`;
              };
              reader.readAsDataURL(event.target.files[0]);
            }
          };
        
          // Manejar el evento de arrastrar y soltar
          const filePreview = document.getElementById('filePreview');
          if (filePreview) {
            // Cuando se arrastra algo sobre el área de previsualización
            filePreview.addEventListener('dragover', (e: DragEvent) => {
              e.preventDefault();
              filePreview.style.borderColor = '#5e72e4'; // Cambiar el color del borde al arrastrar
            });
        
            // Cuando el usuario suelta el archivo sobre el área de previsualización
            filePreview.addEventListener('drop', (e: DragEvent) => {
              e.preventDefault();
              filePreview.style.borderColor = '#ccc'; // Volver el borde al color original
        
              const files = e.dataTransfer?.files;
              if (files && files[0]) {
                const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                fileInput.files = files; // Asignar el archivo arrastrado al input
                loadFile({ target: { files } }); // Mostrar la previsualización
              }
            });
        
            // Restablecer el estilo cuando el usuario deja de arrastrar fuera del área
            filePreview.addEventListener('dragleave', () => {
              filePreview.style.borderColor = '#ccc';
            });
          }
        
          // Hacer que 'loadFile' sea accesible desde el código inline de la alerta
          window['loadFile'] = loadFile;
    // Actualiza la validez general del formulario
    this.commisionsForm.updateValueAndValidity();
  }
}
