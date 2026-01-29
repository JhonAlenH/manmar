import {Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
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
  cmoneda: string = 'Bs.'

  public pageNotas = 1;
  public pageNotasSize = 5;

  public pageReceipt = 1;
  public pageReceiptSize = 5;
  paginatedList: any[] = [];
  bankList: any[] = [];
  currentUser!: any
  id:any;
  itemNull:any;
  maxDate = new Date();
  activeModal:boolean = false;
  // // // Datos de la póliza
  poliza:any = null;
  // // //
  receiptList: any[] = [];
  documentosList: any = []
  motivList: any[] = [
    'Falta de pago',
    'Error en datos',
    'Por petición del cliente',
    'Duplicidad de póliza',
    'Otro'
  ]

  nullFormGroup = this._formBuilder.group({
    xmotivo: ['', [Validators.required]],
    xdetalles: ['', [Validators.required]],
    fcreacion: ['', [Validators.required]],
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
      this.id = this.router.getCurrentNavigation().extras.state.cpoliza;        
    }
    dateAdapter.setLocale('es');

    fetch('https://ve.dolarapi.com/v1/dolares')
    .then((response) => response.json())
    .then(data => {
      data.forEach((item: any) => {
        if (item.fuente === 'oficial') {
          this.bcv = Number((item.promedio).toFixed(2));
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
    this.currentUser = this.currentUser.data.user;

    if (!this.bcv) {
      fetch('https://apisys2000.lamundialdeseguros.com/api/v1/valrep/tasaBCV')
      .then((response) => response.json())
      .then(data => {
        data.data.forEach((item: any) => {
          if (item.cmoneda === '$') {
            this.bcv = Number((item.ptasamon).toFixed(2));
          }
        });
      })
      .catch(error => {
      });
    }
  
    if (this.id && this.currentUser) {
      this.values();
    } 
  }

  async getBanks() {
    const responseRaw = await fetch(environment.apiUrl + '/api/v1/valrep/bank' ,{
      "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify({})
    })
    const response = await responseRaw.json()
    if (response.status) {
      if (response.data.bank) {
        this.bankList = response.data.bank.map((banco: any) => ({
          cbanco: banco.cbanco,
          xbanco: banco.xbanco,
          cmoneda: banco.cmoneda
        })).sort((a:any, b:any) => a.xbanco > b.xbanco ? 1 : -1);
      }
    }
  }

  values(){
    this.http.post(environment.apiUrl + `/api/v1/emission/detail/${this.id}`, {}).subscribe((response: any) => {
      this.poliza = response.data;
      this.poliza.fcreacion = this.dateUtilService.formatDate(new Date(this.poliza.fcreacion));
      for (const vigencia of this.poliza.vigencias) {
        vigencia.fdesde = this.dateUtilService.formatDate(new Date(vigencia.fdesde));
        vigencia.fhasta = this.dateUtilService.formatDate(new Date(vigencia.fhasta));
        if(vigencia.iestado == 'V'){vigencia.estado = 'Vigente'}
        if(vigencia.iestado == 'R'){vigencia.estado = 'Renovada'}
        if(vigencia.iestado == 'A'){vigencia.estado = 'Anulada'}
        let mcomision = 0, mcomisionext = 0
        
        for (const recibo of vigencia.recibos) {
          if(recibo.iestadorec == 'P'){
            if(!vigencia.receiptP) {
              vigencia.receiptP = recibo.ncuota
            }
            recibo.estado = 'Pendiente'
          }
          if(recibo.iestadorec == 'C'){recibo.estado = 'Cobrado'}
          if(recibo.iestadorec == 'A'){recibo.estado = 'Anulado'}
          mcomision += recibo.mcomision
          mcomisionext += recibo.mcomisionext
        }

        vigencia.pcomision = vigencia.recibos[0]?.pcomision || 0
        vigencia.mcomision = mcomision
        vigencia.mcomisionext = mcomisionext
      }
      
      // this.documentosList = response.documents
    })
  }

  formatNumber(value: number | string): string {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  /*
  receipt() {
    let dataCompleta = {
      id: this.id,
      fdesde: this.data_poliza.poliza.fdesde.value,
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
  */

  addFile(id:any): void {
    const newImgInput = <HTMLInputElement> document.getElementById(id)
    newImgInput.click()
  }

  addNote(event: any, vigencia:any){
    
    const form = new FormData()
    form.append( "file", event.target.files[0], event.target.files[0].name)
    form.append( "fileName", event.target.files[0].name)
    const response = this.http.post(environment.apiUrl + '/api/upload/document/emission', form)
    response.subscribe( async data => {
      vigencia.documentos.push({xarchivo: event.target.files[0].name, xruta: environment.apiUrl + data['data']['url'], xtitulo: '', type: 'create'})
    });


  }
  adjustDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adjust date by adding 1 day
    return date.toLocaleDateString('en-GB'); // Convert back to YYYY-MM-DD format
  }
  async createNote(index: any, vigencia:any){
    const documentToCreate = vigencia.documentos[index]
    const dataDocument = {
        itipo: 'P',
        bactivo: 1,
        ccodigo: vigencia.cvigencia,
        xarchivo: documentToCreate.xarchivo,
        xruta: documentToCreate.xruta,
        xtitulo: documentToCreate.xtitulo,
      }
    const responseRaw = await fetch(environment.apiUrl + '/api/create/document', {
      "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify(dataDocument)
    })
    const responseDoc = await responseRaw.json()
    if(responseDoc.data) {
      vigencia.documentos[index].cdocumento = responseDoc.data.cdocumento
      const newImgInput = <HTMLInputElement> document.getElementById('newFile')
      newImgInput.value = null
    } else {
      await this.removeNote(index, vigencia)
    }
  }
  
  async removeNote(index:any, vigencia:any){
    
    if(vigencia.documentos[index].cdocumento){
      const responseRaw = await fetch(environment.apiUrl + '/api/delete/document/' + vigencia.documentos[index].cdocumento, {
        "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify({})
      })
      const responseDoc = await responseRaw.json()
      if(responseDoc.status) {
        return
      }
    }
    vigencia.documentos.splice(index, 1)
  }
  
  formatWithSeparator(valueTo: any) {
    const value = Number(valueTo)
    // value = (value / 100).toFixed(2);
    const formattedValue = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valueTo);
    return formattedValue
  }

  async onCobrar(item: any) {
    await this.getBanks();
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

    Swal.fire({
      title: "Adjunte el comprobante",
      html: `
        <div class="d-flex justify-content-center flex-column mb-3 w-100">
          <input type="text" id="xreferencia" name="xreferencia" class="swal2-input" placeholder="Referencia de pago">
          <select id="cbanco" name="cbanco" class="swal2-select" placeholder="Banco">
            <option value="">Seleccione una opción...</option>
          ${this.bankList.map((banco: any) => `
            <option value="${banco.cbanco}">${banco.xbanco}</option>
          `).join('')}
          </select>
        </div>
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
        const banco = document.getElementById('cbanco') as HTMLInputElement;
        const referencia = document.getElementById('xreferencia') as HTMLInputElement;
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
          try {
            const data = {
              crecibo: item.crecibo,
              fcobro: new Date(),
              itipo: 'M',
              ptasamon: this.bcv,
              cmoneda: item.cmoneda,
              mmonto: item.mprima,
              mmontoext: item.mprimaext,
              cusuario: this.currentUser.cusuario,
              cbanco: banco.value,
              xreferencia: referencia.value,
              xtitulo: 'referencia_pago',
              xruta: rutaCapture || null // Si no hay imagen, se guarda como null
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
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Seleccione un archivo para continuar`,
          });
        }
    
        // Proseguir con el guardado del complemento
      }
    });
    
  }

  enableNullModal(item: any, type: any, enable: boolean) {
    this.itemNull = null
    this.nullFormGroup.reset()

    let url = ''

    if(type == 'poliza') {
      url = '/api/v1/emission/updateStatus/'
    } else {
      url = '/api/v1/emission/updateStatusContract/'
    }

    let data:any = {
      item: item,
      xitem: item,
      type: type,
      url,
      enable: enable,
      cusuario_creacion: this.currentUser.cusuario,
    }
    this.itemNull = data
    
    if(enable){
      data.fcreacion = new Date()
      data.xcambio = `Reactivación de ${type}`
      data.xdetalles = `Reactivación de ${type}`
      this.changeEstatus(data)
    } else {
      this.activeModal = true;
    }
  }

  checkClickOutside(event:any) {
    if (event.srcElement.id == 'modal-item') {
      this.activeModal = false
    }
  }

  setDataToNull() {
    const data = {
      ...this.itemNull,
      fcreacion: this.nullFormGroup.get('fcreacion')?.value,
      xcambio: this.nullFormGroup.get('xmotivo')?.value,
      xdetalles: this.nullFormGroup.get('xdetalles')?.value,
      cusuario_creacion: this.currentUser.cusuario
    }
    this.changeEstatus(data)
  }

  async changeEstatus(data:any) {
    const responseRaw = await fetch(environment.apiUrl + data.url + data.item, {
      "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify(data)
    })
    const response = await responseRaw.json()
    if (response.status) {
      this.snackBar.open(`La ${data.type} ${data.enable ? 'ha sido reactivada correctamente.' : 'ha sido anulada correctamente.'}`, 'Cerrar', {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snackbar-success']
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      this.snackBar.open(response.message, 'Cerrar', {
        duration: 4000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['snackbar-danger']
      });
    }
  }

  async changePolicy(cpoliza: any, type: any) {
    const responseRaw = await fetch(environment.apiUrl + '/api/v1/emission/updateStatus/' + cpoliza, {
      "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify({type})
    })
    const response = await responseRaw.json()
    if (response.status) {
      this.snackBar.open('La póliza ha sido anulada correctamente.', 'Cerrar', {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snackbar-success']
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      this.snackBar.open(response.message, 'Cerrar', {
        duration: 4000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['snackbar-danger']
      });
    }
  }

  async changeContract(cvigencia: any, type: any) {
    const responseRaw = await fetch(environment.apiUrl + '/api/v1/emission/updateStatusContract/' + cvigencia, {
      "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify({type})
    })
    const response = await responseRaw.json()
    if (response.status) {
      this.snackBar.open('La vigencia ha sido anulada correctamente.', 'Cerrar', {
        duration: 4000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['snackbar-success']
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      this.snackBar.open(response.message, 'Cerrar', {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['snackbar-danger']
      });
    }
  }

  formatDate = (value:any) => {
    const date = new Date(value)
    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString('en-GB')
  }
  
}
