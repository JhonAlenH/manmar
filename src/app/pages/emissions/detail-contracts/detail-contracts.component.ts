import {Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateUtilService } from '../../../_services/date-util.service'
import Swal from 'sweetalert2'

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-detail-contracts',
  templateUrl: './detail-contracts.component.html',
  styleUrls: ['./detail-contracts.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DetailContractsComponent implements OnInit {
  bcv!: any;

  public pageNotas = 1;
  public pageNotasSize = 5;

  public pageReceipt = 1;
  public pageReceiptSize = 5;
  paginatedList: any[] = [];
  currentUser!: any
  ramo!: any;
  asegurado!: any;
  tomador!: any;
  id!: any;
  fdesde!: any;
  msuma_aseg!: any;
  msuma_aseg_bs!: any;
  mprima_bs!: any;
  edit: boolean = true;
  primaAlterada: boolean = false;
  metodologia!: any;
  cmetodologia!: any;
  rutaCapture!: any;

  cedentsList: any[] = [];
  coinsList: any[] = [];
  methodOfPaymentList: any[] = [];
  receiptList: any[] = [];
  documentosList: any = []

  cedentsControl = new FormControl('');
  coinsControl = new FormControl('');
  methodOfPaymentControl = new FormControl('');

  filteredCedents!: Observable<string[]>;
  filteredCoins!: Observable<string[]>;
  filteredMethodOfPayment!: Observable<string[]>;

  detailFormGroup = this._formBuilder.group({
    ccedente: [{ value: '', disabled: true }],
    xcedente: [{ value: '', disabled: true }],
    cmoneda: [{ value: '', disabled: true }],
    xmoneda: [{ value: '', disabled: true }],
    fdesde: [{ value: '', disabled: true }],
    fhasta: [{ value: '', disabled: true }],
    xpoliza: [{ value: '', disabled: true }],
    msuma_aseg: [{ value: '', disabled: true }],
    mprima: [{ value: '', disabled: true }],
  });


  constructor( private _formBuilder: FormBuilder,
               private http: HttpClient,
               private dateUtilService: DateUtilService,
               private modalService: NgbModal,
               private snackBar: MatSnackBar,
               private route: ActivatedRoute,
               private router: Router,
               private dateAdapter: DateAdapter<Date>,
               ) {
                if(this.router.getCurrentNavigation().extras.state == undefined){
                  this.router.navigate(['search-contract']);
                }else{
                  this.id = this.router.getCurrentNavigation().extras.state.id;       
                  this.fdesde = this.router.getCurrentNavigation().extras.state.fdesde_pol;  
                }
                dateAdapter.setLocale('es');

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
      })
      .catch(error => {
      });
    }
  
    if (this.id && this.currentUser) {
      this.values();
      this.getCedents();
      this.getCoins();
      this.receiptPoliza()
    } 
  }

  values(){
    this.http.post(environment.apiUrl + `/api/v1/emission/detail/${this.id}`, {}).subscribe((response: any) => {
      this.ramo = response.data.xramo;
      this.asegurado = response.data.xnombre;
      this.tomador = response.data.xtomador;
      this.msuma_aseg_bs = parseFloat(response.data.msuma);
      this.mprima_bs = response.data.mprima;
      this.metodologia = response.data.xmetodologiapago
      this.cmetodologia = response.data.cmetodologia
      this.documentosList = response.documents

      this.detailFormGroup.get('fdesde')?.setValue(this.dateUtilService.adjustDate(response.data.fdesde_pol))
      this.detailFormGroup.get('ccedente')?.setValue(response.data.ccedente)
      this.detailFormGroup.get('xcedente')?.setValue(response.data.xcedente)
      this.detailFormGroup.get('cmoneda')?.setValue(response.data.cmoneda)
      this.detailFormGroup.get('xmoneda')?.setValue(response.data.xmoneda)
      this.detailFormGroup.get('xpoliza')?.setValue(response.data.xpoliza)
      this.detailFormGroup.get('msuma_aseg')?.setValue(this.formatNumber(response.data.msumaext));
      this.detailFormGroup.get('mprima')?.setValue(this.formatNumber(response.data.mprimaext));

      this.calcularFechaHasta();
    })
  }

  formatNumber(value: number | string): string {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  getCedents(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/cedents', null).subscribe((response: any) => {
      if (response.data.cedents) {
        this.cedentsList = response.data.cedents.map((item: any) => ({
          id: item.ccedente,
          value: item.xcedente,
        }))

        const selectedCedents = this.cedentsList.find(cedents => cedents.id === this.detailFormGroup.get('ccedente')?.value);
        if (selectedCedents) {
            this.detailFormGroup.get('ccedente')?.setValue(selectedCedents.id);
            this.detailFormGroup.get('xcedente')?.setValue(selectedCedents.value);
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

  onCedentSelection(event: any) {
    const selectedValue = event.option.value;
    const selected = this.cedentsList.find(cedents => cedents.value === selectedValue);
    if (selected) {
      this.detailFormGroup.get('ccedente')?.setValue(selected.id);
      this.detailFormGroup.get('xcedente')?.setValue(selected.value);
    }
  }

  getCoins(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/coins', null).subscribe((response: any) => {
      if (response.data.coins) {
        this.coinsList = response.data.coins.map((item: any) => ({
          id: item.cmoneda,
          value: item.xmoneda,
        }))
        const selectedCoin = this.coinsList.find(coin => coin.id === this.detailFormGroup.get('cmoneda')?.value);
        if (selectedCoin) {
            this.detailFormGroup.get('cmoneda')?.setValue(selectedCoin.id);
            this.detailFormGroup.get('xmoneda')?.setValue(selectedCoin.value);
        }
        this.coinsList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredCoins = this.coinsControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCoins(value || ''))
        );
      }
    });
  }

  private _filterCoins(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.coinsList
      .map(coins => coins.value)
      .filter(coins => coins.toLowerCase().includes(filterValue));
  }

  onCoinSelection(event: any) {
    const selectedValue = event.option.value;
    const selected = this.coinsList.find(coins => coins.value === selectedValue);
    if (selected) {
      this.detailFormGroup.get('cmoneda')?.setValue(selected.id);
      this.detailFormGroup.get('xmoneda')?.setValue(selected.value);
    }
  }

  receipt() {
    let dataCompleta = {
      id: this.id,
      fdesde: this.detailFormGroup.get('fdesde')?.value,
      mprima: this.detailFormGroup.get('mprima')?.value,
    }
    this.http.post(environment.apiUrl + '/api/v1/emission/receipt-update', dataCompleta).subscribe((response: any) => {
      if(response.status){
        this.receiptList = [];
        this.receiptList = response.data.receipt.map((item: any) => ({
          fdesde_rec: this.dateUtilService.formatDate(new Date(item.fdesde)),
          fhasta_rec: this.dateUtilService.formatDate(new Date(item.fhasta)),
          mprima: item.mprima.toFixed(2),
        }));
      }
    })
  }

  receiptPoliza() {
    this.http.post(environment.apiUrl + `/api/v1/emission/search-receipt/${this.id}`, null).subscribe((response: any) => {
      if(response.status){
        this.receiptList = [];
        this.receiptList = response.receipt.map((item: any) => ({
          nrecibo: item.nrecibo,
          fdesde_rec: this.dateUtilService.formatDateDate(new Date(item.fdesde_rec)),
          fhasta_rec: this.dateUtilService.formatDateDate(new Date(item.fhasta_rec)),
          fcobrorec: item.fcobrorec ? this.dateUtilService.formatDate(new Date(item.fcobrorec)) : '',  // Si no hay valor, dejar en blanco
          fcobrorectext: item.fcobrorec,
          iestadorec: item.iestadorec,
          iestadorec_t: item.iestadorec === 'P' ? 'Pendiente' : item.iestadorec === 'C' ? 'Cobrado' : '',
          color: item.iestadorec === 'P' ? 'red' : item.iestadorec === 'C' ? 'green' : 'black',
          mprima: item.mprimaext.toFixed(2),
          xruta_rec: item.xruta_rec,
        }));

        this.updatePaginatedList();
      }
    })
  }

  updatePaginatedList() {
    const startIndex = (this.pageReceipt - 1) * this.pageReceiptSize;
    const endIndex = startIndex + this.pageReceiptSize;
    this.paginatedList  = this.receiptList.slice(startIndex, endIndex);
  }

  onPageChange() {
    this.updatePaginatedList();
  }

  calcularFechaHasta() {
    const fechaDesde = new Date(this.detailFormGroup.get('fdesde')?.value);
    const fechaHasta = new Date(fechaDesde.getFullYear() + 1, fechaDesde.getMonth(), fechaDesde.getDate() + 1);
    const fechaHastaISO = fechaHasta.toISOString().split('T')[0]; // Obtener la fecha en formato 'YYYY-MM-DD'
    this.detailFormGroup.get('fhasta')?.setValue(fechaHastaISO);
    this.fdesde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate());
  }

  editContract(){
    this.edit = false
    this.detailFormGroup.get('fdesde')?.enable();
    this.detailFormGroup.get('fhasta')?.enable();
    this.detailFormGroup.get('ccedente')?.enable();
    this.detailFormGroup.get('xcedente')?.enable();
    this.detailFormGroup.get('cmoneda')?.enable();
    this.detailFormGroup.get('xmoneda')?.enable();
    this.detailFormGroup.get('xpoliza')?.enable();
    this.detailFormGroup.get('msuma_aseg')?.enable();
    this.detailFormGroup.get('mprima')?.enable();
  }

  cancelEdit(){
    this.values()
    this.edit = true;
    this.detailFormGroup.get('fdesde')?.disable();
    this.detailFormGroup.get('fhasta')?.disable();
    this.detailFormGroup.get('ccedente')?.disable();
    this.detailFormGroup.get('xcedente')?.disable();
    this.detailFormGroup.get('cmoneda')?.disable();
    this.detailFormGroup.get('xmoneda')?.disable();
    this.detailFormGroup.get('xpoliza')?.disable();
    this.detailFormGroup.get('msuma_aseg')?.disable();
    this.detailFormGroup.get('mprima')?.disable();
  }

  formatWithSeparator(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    event.target.value = value;

    const numericValue = Number(value.replace(/\./g, ''));
    this.msuma_aseg = numericValue;
  }

  formatPrima(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    event.target.value = value;
    this.detailFormGroup.get('mprima')?.setValue(event.target.value)
  }

  SumBs(){
    const msuma_aseg_bs = this.msuma_aseg * this.bcv;

    const formattedMsumaAsegBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(msuma_aseg_bs);

    this.msuma_aseg_bs = formattedMsumaAsegBs;
    this.msuma_aseg_bs = this.convertStringToNumber(this.msuma_aseg_bs)
  }

  PrimaBs(){
    const mprima = parseFloat(this.detailFormGroup.get('mprima')?.value);
    
    const mprima_bs = mprima * this.bcv;

    const formattedPriBs = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(mprima_bs);

    this.mprima_bs = formattedPriBs;
    this.mprima_bs = this.convertStringToNumber(this.mprima_bs)
    this.primaAlterada = true;
    this.receipt()
  }

  convertStringToNumber(str: any): number {
    if (str == null) {
      return 0;
    }
    
    // Asegurarse de que el valor sea una cadena
    const stringValue = String(str);
    
    // Elimina los separadores de miles
    let numberWithoutThousandsSeparator = stringValue.replace(/\./g, '');
    
    // Reemplaza la coma decimal con un punto decimal
    let numberWithDotDecimal = numberWithoutThousandsSeparator.replace(/,/g, '.');
    
    // Convierte el string resultante a número
    let result = parseFloat(numberWithDotDecimal);
    
    // Si parseFloat devuelve NaN, devuelve 0 como valor predeterminado
    return isNaN(result) ? 0 : result;
  }

  addFile(id:any): void {
    const newImgInput = <HTMLInputElement> document.getElementById(id)
    newImgInput.click()
  }

  addNote(event: any){
    
    const form = new FormData()
    form.append( "file", event.target.files[0], event.target.files[0].name)
    form.append( "fileName", event.target.files[0].name)
    const response = this.http.post(environment.apiUrl + '/api/upload/document/emission', form)
    response.subscribe( data => {
      this.documentosList.push({xnombrenota: event.target.files[0].name, xruta: environment.apiUrl + data['data']['url'], xtitulo: '', type: 'create'})      
      const newImgInput = <HTMLInputElement> document.getElementById('newFile')
      newImgInput.value = null

      console.log(this.documentosList);
    });
  }
  
  removeNote(index:any){
    this.documentosList.splice(index, 1)
  }

  onSubmit(){
    let data = {
      id: this.id,
      fdesde_pol: this.detailFormGroup.get('fdesde')?.value,
      fhasta_pol: this.detailFormGroup.get('fhasta')?.value,
      ccedente: this.detailFormGroup.get('ccedente')?.value,
      cmoneda: this.detailFormGroup.get('cmoneda')?.value,
      xpoliza: this.detailFormGroup.get('xpoliza')?.value,
      msumaext: this.convertStringToNumber(this.detailFormGroup.get('msuma_aseg')?.value),
      msuma: this.msuma_aseg_bs,
      mprimaext: parseFloat(this.detailFormGroup.get('mprima')?.value),
      mprima: this.mprima_bs,
      ptasa_cambio: this.bcv
    }
    this.http.post(environment.apiUrl + `/api/v1/emission/update`, data).subscribe((response: any) => {
      if(response.status){
        Swal.fire({
          icon: "success",
          title: `${response.message}`,
          showConfirmButton: false,
          timer: 4000
        }).then((result) => {
          location.reload()
        });
      }
    },(err) => {
      Swal.fire({
        icon: "error",
        title: "Ha ocurrido un Error",
        text: "Estimado usuario, se ha presentado un error inesperado, por favor, contacta al equipo técnico para mayor información",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#fdd213d1",
      }).then((result) => {
          if (result.isConfirmed) {
              location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
          }
      });
    })
  }

  onCobrar(item: any) {
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
            id_poliza: this.id,
            nrecibo: item.nrecibo,
            fcobrorec: new Date(),
            iestadorec: 'C',
            xruta_rec: rutaCapture || null // Si no hay imagen, se guarda como null
          };
    
          const response = this.http.post(environment.apiUrl + `/api/v1/emission/update-receipt-premium`, data);
    
          // Esperar la respuesta del complemento
          response.subscribe(res => {
            if (res['status_receipt']) {
              Swal.fire({
                icon: "success",
                title: `${res['message']}`,
                showConfirmButton: false,
                timer: 4000
              }).then(() => {
                location.reload();
              });
            } else {
              throw new Error('No se pudo completar la operación');
            }
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
  }
  
}
