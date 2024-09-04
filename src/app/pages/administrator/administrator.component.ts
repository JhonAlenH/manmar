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
  @ViewChild('Complemento') Complemento!: TemplateRef<any>;
  @ViewChild('Abonar') Abonar!: TemplateRef<any>;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  columnsToDisplay: string[] = [ 'xpoliza', 'xnombre', 'fcobro', 'mingreso', 'mcomisionext'];
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
  newAbono: any = { fmovimiento: '', mpagado: null };

  selectAll: boolean = false;
  amount: boolean = false;
  newComplementAdded: boolean = false;

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
  
    fetch('https://ve.dolarapi.com/v1/dolares')
      .then((response) => response.json())
      .then(data => {
        data.forEach((item: any) => {
          if (item.fuente === 'oficial') {
            this.bcv = item.promedio;
          }
        });
  
        console.log('BCV actualizado:', this.bcv);
      })
      .catch(error => {
        console.error('Error al obtener la tasa del BCV:', error);
        // Continuar con el valor predeterminado de `this.bcv`
      })
      .finally(() => {
        // Ejecutar las funciones que dependen de `this.bcv`, ya sea que la API haya fallado o no
        if (this.currentUser) {
          this.getCedents();
          this.getTrades();
          this.getBank();
          this.searchDueReceipt();
          this.feeCharged();
        }
      });
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
        item.mnetobs = parseFloat((item.mneto * this.bcv).toFixed(2));
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

      this.dataSource.data = this.feeChargedList;
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
        item.mnetobs = parseFloat((item.mneto * this.bcv).toFixed(2));
      }
    });
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
    
    this.fee = filteredFee;
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
      fcobro: new Date()
    });
    this.totalMontoNeto += item.mnetobs; // Actualiza la suma total

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
    console.log(element);
    this.http.post(environment.apiUrl + `/api/v1/emission/search-complement/${element.id_poliza}`, null).subscribe((response: any) => {
      if (response.complement) {
        // Carga los complementos específicos para el registro actual
        console.log(response.complement)
        this.currentRecordComplements[element.id] = response.complement;
      } else {
        this.currentRecordComplements[element.id] = [];
      }
    });
  }


  addComplement(element: any) {
    this.administrativeForm.get('fcomplemento')?.setValue('');
    this.administrativeForm.get('mcomplemento')?.setValue('');
    this.parametros = element;
  
    // Asegúrate de inicializar los complementos para el registro actual si no existen
    if (!this.currentRecordComplements[element.id]) {
      this.currentRecordComplements[element.id] = [];
    }
  
    this.dialogRef = this.dialog.open(this.Complemento, {
      width: '90%',
      height: '45%',
      maxWidth: '800px'
    });
  }

  validateComplement() {
    this.snackBar.open('Recuerda que debes darle click al botón de guardar para que se apliquen los cambios', '', {
      duration: 4000,
    });
  
    // Asegúrate de agregar el complemento al registro correcto
    if (!this.currentRecordComplements[this.parametros.id]) {
      this.currentRecordComplements[this.parametros.id] = [];
    }
  
    this.currentRecordComplements[this.parametros.id].push({
      id_poliza: this.parametros.id_poliza,
      crecibo: this.parametros.crecibo,
      fcomplemento: this.administrativeForm.get('fcomplemento')?.value || new Date(),
      mcomplemento: this.administrativeForm.get('mcomplemento')?.value,
    });
  
    this.newComplementAdded = true;
  
    this.dialogRef.close();
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
        const correctedAbono = response.abonos.map((contract: any) => {
          // Convertimos la fecha a cadena antes de ajustar
          const dateAsString = new Date(contract.fmovimiento).toISOString();
          contract.fmovimiento = this.dateUtilService.adjustDate(dateAsString);
          return contract;
        });
        this.abonosList = correctedAbono;
        console.log(this.abonosList);
      } else {
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
  }

  guardarNuevoAbono() {
    this.dialogRef.close();
    Swal.fire({
      icon: "question",
      title: "¿Deseas realizar este Abono?",
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
          const data = {
            fmovimiento: this.newAbono.fmovimiento,
            mpagado: this.newAbono.mpagado,
            id_poliza: this.currentPolizaId,
            crecibo: this.currentRecibo,
            itipomov: 'A'
          };

          this.http.post(environment.apiUrl + `/api/v1/emission/add-abono`, data).subscribe((response: any) => {
            if (response.status) {
              Swal.close();
              Swal.fire({
                icon: "success",
                title: `Se ha registrado el abono exitosamente`,
                showConfirmButton: false,
                timer: 4000
              }).then((result) => {
                let maxAbono;
                const totalAbonos = this.abonosList.reduce((sum, abono) => sum + (abono.mpagado || 0), 0);
                if(totalAbonos === 0){
                  maxAbono = this.newAbono.mpagado
                }else{
                  maxAbono = this.newAbono.mpagado + totalAbonos; 
                }
                
                if(maxAbono > this.netoBs){
                  Swal.fire({
                    icon: 'info',
                    text: `Recuerda que el monto de abono superó el Monto Neto, por ende se regularizará el recibo`,
                    showConfirmButton: false,
                    timer: 4000
                  }).then((result) => {
                    location.reload()
                  });
                }else{
                  location.reload()
                }

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

  onSubmitComplement(){
    let data = {
      complemento: Object.values(this.currentRecordComplements).flat()
    };
    console.log(data)
    this.http.post(environment.apiUrl + `/api/v1/emission/complement`, data).subscribe((response: any) => {
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: `¡Se ha ingresado el complemento exitosamente!`,
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
        text: `No se pudo ingresar el complemento`,
      });
    });
  }

  validateCobro(){
    const banco = this.administrativeForm.get('cbanco')?.value;
    const referencia = this.administrativeForm.get('xreferencia')?.value;
    if(banco && referencia){
      this.receiptSelected.forEach(item => {
        item.cbanco = banco;
        item.xreferencia = referencia;
        item.cmoneda_cobro = 1;
        item.mingreso = item.mcomision_n;
        item.iestado = 'CO';
      });

      Swal.fire({
        icon: "question",
        title: "¿Deseas realizar este Cobro?",
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
                }).then((result) => {
                  location.reload()
                });
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
      });
    }else{

    }
    console.log(this.receiptSelected)
  }
}
