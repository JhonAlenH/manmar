import {Component, ChangeDetectorRef , Input , OnInit, Inject , SimpleChanges } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl , FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {from, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateUtilService } from './../../_services/date-util.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-container-automobile',
  templateUrl: './container-automobile.component.html',
  styleUrls: ['./container-automobile.component.scss']
})
export class ContainerAutomobileComponent implements OnInit {
  public copy: string;
  currentUser!: any

  @Input() receiptData: any;
  Agents: boolean = false;
  activaEliminarEjecutivo: boolean = false;
  activaEliminarAgente: boolean = false;
  commissionSum: any;
  comision: any;
  mcomision_bs: any;
  MontoADistribuir: any;
  selectedAgents: any[] = [];
  comisionesDivididas: any[] = [];

  brandList: any[] = [];
  modelList: any[] = [];
  versionList: any[] = [];
  colorList: any[] = [];
  receiptList: any[] = [];
  executiveList: any[] = [];
  agentsList: any[] = []; 
  documentosList: any = []

  vehiculoDataComponent = {
    title: 'Crear Vehículo',
    mode: 'create',
    mainUrl: '/api/v1/maestros/vehiculos/get/',
    createUrl: '/api/v1/maestros/vehiculos/create',
    formId: 'create_vehiculos',
    fields: [
      {
        type: 'text',
        fieldName: 'Activo', class: 'col-md-0',
        defaultValue: 1,
        form_control: true,
        key: 'bactivo',
        bdType: 'number'
      },
      {
        type: 'auto-select',
        fieldName: 'Marca', class: 'col-md-2',
        classShow: 'col-md-4',
        url: '/api/v1/maestros/marcas',
        binding_change_fields: ['cmodelo'],
        change_fields: ['cmodelo', 'cversion', 'xmarca'],
        key: 'cmarca',
        bdType: 'text'
      },
      {
        type: 'auto-text',
        fieldName: 'Nombre Marca', class: 'col-md-2',
        key: 'xmarca',
        reverse: true,
        bdType: 'text'
      },
      {
        type: 'auto-select',
        fieldName: 'Modelo', class: 'col-md-2',
        classShow: 'col-md-4',
        url: '/api/v1/maestros/modelos',
        url_ids: ['cmarca'],
        binding_change_fields: ['cversion'],
        change_fields: ['cversion', 'xmodelo'],
        key: 'cmodelo',
        bdType: 'text'
      },
      {
        type: 'auto-text',
        fieldName: 'Nombre Modelo', class: 'col-md-2',
        key: 'xmodelo',
        reverse: true,
        bdType: 'text'
      },
      {
        type: 'auto-select',
        fieldName: 'Versión', class: 'col-md-2',
        classShow: 'col-md-4',
        url: '/api/v1/maestros/versiones',
        url_ids: ['cmarca','cmodelo'],
        change_fields: ['xversion'],
        key: 'cversion',
        bdType: 'text'
      },
      {
        type: 'auto-text',
        fieldName: 'Nombre Versión', class: 'col-md-2',
        key: 'xversion',
        reverse: true,
        bdType: 'text'
      },
      {
        type: 'text',
        fieldName: 'Transmisión', class: 'col-md-7',
        key: 'xtrans',
        bdType: 'text'
      },
      {
        type: 'text',
        fieldName: 'Motor', class: 'col-md-4',
        key: 'xmotor',
        bdType: 'text'
      },
      {
        type: 'number',
        fieldName: 'Año', class: 'col-md-1',
        key: 'qano',
        change_fields: ['cmarca', 'cmodelo', 'cversion'],
        bdType: 'number'
      }
    ]
  }

  brandControl = new FormControl('');
  modelControl = new FormControl('');
  versionControl = new FormControl('');
  colorControl = new FormControl('');

  filteredBrand!: Observable<string[]>;
  filteredModel!: Observable<string[]>;
  filteredVersion!: Observable<string[]>;
  filteredColor!: Observable<string[]>;

  public page = 1;
  public pageSize = 6;
  public pageNotas = 1;
  public pageNotasSize = 5;

  newVehiculo:boolean = false

  vehicleFormGroup = this._formBuilder.group({
    xplaca: ['',[Validators.maxLength(7)]],
    xmarca: [{ value: '', disabled: true}],
    xmodelo: [{ value: '', disabled: true}],
    xversion: [{ value: '', disabled: true}],
    fano: ['',[ Validators.maxLength(4)]],
    ccolor: [{ value: '', disabled: true }],
    igrua: [false],
    cproductor: [{ value: '', disabled: false }],
    pcomision: [{ value: '', disabled: false }],
    mcomision: [{ value: '', disabled: true }],
  });

  constructor( private _formBuilder: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal,
    private dateUtilService: DateUtilService,
    private cdr: ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
    this.currentUser = this.currentUser.data.user
    this.vehicleFormGroup.get('cproductor')?.setValue(this.currentUser.productor.cproductor);
    this.getColor();
    // this.getExecutive();
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.receiptData) {
      const fhasta = new Date(changes.receiptData?.currentValue.fhasta)
      fhasta.setDate(fhasta.getDate() - 1)
      changes.receiptData.currentValue.fhasta = fhasta
      this.vehicleFormGroup.get('pcomision')?.setValue(this.receiptData.pcomision || 0);
      this.vehicleFormGroup.get('mcomision')?.setValue(this.receiptData.mcomision || 0);
      let mcomision_bs = this.receiptData.mcomision 
      if(this.receiptData.cmoneda != 1 ) {
        mcomision_bs = this.receiptData.mcomision * this.receiptData.bcv;
      }
      this.mcomision_bs = Number(mcomision_bs.toFixed(2))
      this.updateReceiptData(changes.receiptData.currentValue);
    }
  }
  formatDate(dateTo:any) {
    var date = new Date(dateTo);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('en-GB');
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

  updateReceiptData(data: any) {
    let dataCompleta = {
      fdesde: data.fdesde,
      fhasta: data.fhasta,
      mprima: data.mprimaext,
      pcomision: this.vehicleFormGroup.get('pcomision')?.value,
      cmetodologiapago: data.cmetodologiapago,
    }
    this.receiptList = [];
    this.http.post(environment.apiUrl + '/api/v1/emission/receipt', dataCompleta).subscribe((response: any) => {
      if(response.status){
        this.receiptList = response.data.receipt.map((receipt: any) => ({
          ncuota: receipt.id,
          fdesde_rec: this.formatDateToString(new Date(receipt.fdesde_rec)),
          fhasta_rec: this.formatDateToString(new Date(receipt.fhasta_rec)),
          fdesde_rec_format: this.formatDate(receipt.fdesde_rec),
          fhasta_rec_format: this.formatDate(receipt.fhasta_rec),
          ptasamon: this.receiptData.bcv,
          ctomador: this.receiptData.ctomador || this.receiptData.casegurado,
          msumaaseg: this.convertStringToNumber(this.receiptData.msuma),
          msumaasegext: this.receiptData.msumaext,
          mprima: Number((receipt.mprima * this.receiptData.bcv).toFixed(2)),
          mprimaext: Number(receipt.mprima.toFixed(2)),
          mprimaext_fomat: receipt.mprima.toFixed(2),
          pcomision: this.vehicleFormGroup.get('pcomision')?.value,
          mcomision: Number((receipt.mcomision * this.receiptData.bcv).toFixed(2)),
          mcomisionext: Number(receipt.mcomision.toFixed(2)),
          iestadorec: 'P',
          comisiones: [{
            cproductor: this.currentUser.productor.cproductor,
            cmoneda: this.receiptData.cmoneda,
            ptasamon: this.receiptData.bcv,
            pcomision: this.vehicleFormGroup.get('pcomision')?.value,
            mcomision: Number((receipt.mcomision * this.receiptData.bcv).toFixed(2)),
            mcomisionext: Number(receipt.mcomision.toFixed(2)),
            iestado: 'P',
            bactivo: 1,
            cusuario_creacion: this.currentUser.cusuario,
            fcreacion: new Date()
          }]
        }));
      }
    })
  }

  changeYears() {
    this.getBrand();
  }

  getBrand(){
    let data = {
      qano: this.vehicleFormGroup.get('fano')?.value
    };
    this.brandList = [];
    this.http.post(environment.apiUrl + '/api/v1/valrep/brand', data).subscribe((response: any) => {
      if (response.data.brand) {
        for (let i = 0; i < response.data.brand.length; i++) {
          this.brandList.push({
            id: i,
            value: response.data.brand[i].xmarca,
          });
        }
        this.brandList.sort((a, b) => a.value > b.value ? 1 : -1);

        if(!this.brandList[0]){
          window.alert(`No existe una Marca para el año ${data.qano}`)
          this.vehicleFormGroup.get('fano')?.setValue('')
        }

        this.filteredBrand = this.brandControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterBrand(value || ''))
        );

        const brandSelected = this.brandList.find(brand => brand.value === this.vehicleFormGroup.get('xmarca')?.value);
        if (!brandSelected) {
          this.brandControl.setValue('')
          this.vehicleFormGroup.get('xmarca')?.setValue('')
        }
        this.getModel();
      }
    });
  }

  private _filterBrand(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.brandList
      .map(brand => brand.value)
      .filter(brand => brand.toLowerCase().includes(filterValue));
  }

  checkClickOutside(event:any, item:any) {
    if (event.srcElement.id == 'item-create') {
      this[item] = false
    }
  }

  onBrandSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedBrand = this.brandList.find(brand => brand.value === selectedValue);
    if (selectedBrand) {
      this.vehicleFormGroup.get('xmarca')?.setValue(selectedBrand.value);
      this.getModel();
    }
  }

  getModel(){
    let data = {
      qano: this.vehicleFormGroup.get('fano')?.value,
      xmarca: this.vehicleFormGroup.get('xmarca')?.value,
    };
    this.modelList = [];
    this.http.post(environment.apiUrl + '/api/v1/valrep/model', data).subscribe((response: any) => {
      if (response.data.model) {
        for (let i = 0; i < response.data.model.length; i++) {
          this.modelList.push({
            id: i,
            value: response.data.model[i].xmodelo,
          });
        }
        this.modelList.sort((a, b) => a.value > b.value ? 1 : -1);

        this.filteredModel = this.modelControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterModel(value || ''))
        );

        this.getVersion()
      }
    });
  }

  private _filterModel(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.modelList
      .map(model => model.value)
      .filter(model => model.toLowerCase().includes(filterValue));
  }

  onModelSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedModel = this.modelList.find(model => model.value === selectedValue);
    if (selectedModel) {
      this.vehicleFormGroup.get('xmodelo')?.setValue(selectedModel.value);
      this.getVersion();
    }
  }

  getVersion(){
    let data = {
      qano: this.vehicleFormGroup.get('fano')?.value,
      xmarca: this.vehicleFormGroup.get('xmarca')?.value,
      xmodelo: this.vehicleFormGroup.get('xmodelo')?.value,
    };
    this.versionList = [];
    this.http.post(environment.apiUrl + '/api/v1/valrep/version', data).subscribe((response: any) => {
      if (response.data.version) {
        for (let i = 0; i < response.data.version.length; i++) {
          this.versionList.push({
            id: response.data.version[i].cversion,
            value: response.data.version[i].xversion,
          });
        }
        this.versionList.sort((a, b) => a.value > b.value ? 1 : -1);

        this.filteredVersion = this.versionControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterVersion(value || ''))
        );
      }
    });
  }

  private _filterVersion(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.versionList
      .map(version => version.value)
      .filter(version => version.toLowerCase().includes(filterValue));
  }

  onVersionSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedVersion = this.versionList.find(version => version.value === selectedValue);
    if (selectedVersion) {
      this.vehicleFormGroup.get('xversion')?.setValue(selectedVersion.value);
    }
  }

  clearVehiculo() {
    this.vehicleFormGroup.get('fano')?.setValue(''),
    this.vehicleFormGroup.get('xmarca')?.setValue(''),
    this.vehicleFormGroup.get('xmodelo')?.setValue(''),
    this.vehicleFormGroup.get('xversion')?.setValue('');
  }

  getColor(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/color', null).subscribe((response: any) => {
      if (response.data.color) {
        for (let i = 0; i < response.data.color.length; i++) {
          this.colorList.push({
            id: response.data.color[i].ccolor,
            value: response.data.color[i].xcolor,
          });
        }
        this.colorList.sort((a, b) => a.value > b.value ? 1 : -1);
        this.filteredColor = this.colorControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterColor(value || ''))
        );
      }
    });
  }

  private _filterColor(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.colorList
      .map(color => color.value)
      .filter(color => color.toLowerCase().includes(filterValue));
  }

  onColorSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedColor = this.colorList.find(color => color.value === selectedValue);
    if (selectedColor) {
      this.vehicleFormGroup.get('ccolor')?.setValue(selectedColor.id);
    }
  }

  valueplate(value: any){
    var ExpRegSoloLetras="^[A-Za-z0-9\s]+$";
    if(value.data.match(ExpRegSoloLetras)==null){
 

      const formulario = this.vehicleFormGroup.get('xplaca')?.value  || ''
      const newValue = formulario.replace(new RegExp(`[^A-Za-z0-9\\s]`, 'g'), '');
    
      // Actualiza el valor en el formulario
      this.vehicleFormGroup.get('xplaca')?.setValue(newValue);

    }
  }

  commissionSumValidator() {
    const pcomision = parseFloat(this.vehicleFormGroup.get('pcomision')?.value) || 0;

    if(pcomision > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
    } else{
      this.calculatePremiums();
    }
  }

  calculatePremiums(){
    const mprima = this.receiptData.mprimaext;
    const pcomision = parseFloat(this.vehicleFormGroup.get('pcomision')?.value) || 0;

    const primaCalculada = mprima * pcomision / 100;

    let mcomision_bs = primaCalculada
    this.vehicleFormGroup.get('mcomision')?.setValue(primaCalculada.toFixed(2))
    if(this.receiptData.cmoneda != 1 ) {
      mcomision_bs = primaCalculada * this.receiptData.bcv;
    }
    // Formatear con separadores de miles y decimales
    this.mcomision_bs = mcomision_bs
    
    this.updateReceiptData(this.receiptData);

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
      this.documentosList.push({xarchivo: event.target.files[0].name, xruta: environment.apiUrl + data['data']['url'], xtitulo: '', type: 'create'})      
      const newImgInput = <HTMLInputElement> document.getElementById('newFile')
      newImgInput.value = null
    });
  }
  
  removeNote(index:any){
    this.documentosList.splice(index, 1)
  }

  formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11, por lo que sumamos 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  onSubmit(){
    const fdesdeString = this.formatDateToString(new Date(this.receiptData.fdesde));
    let fhasta:any = new Date(this.receiptData.fhasta)
    fhasta.setDate(fhasta.getDate() + 1)
    const fhastaString = fhasta;

    let data = {
      xpoliza: this.receiptData.xpoliza,
      casegurado: this.receiptData.casegurado,
      ccedente: this.receiptData.ccedente,
      cproductor: this.currentUser.productor.cproductor,
      ctomador: this.receiptData.ctomador || this.receiptData.casegurado,
      cramo: this.receiptData.cramo,
      fcreacion: new Date(),
      iestado: 1,
      cusuario_creacion: this.currentUser.cusuario,
      vigencias: [
        {
          cproductor_convenio: this.currentUser.productor.cproductor,
          cmoneda: this.receiptData.cmoneda,
          xpoliza: this.receiptData.xpoliza,
          cproducto: this.receiptData.cproducto,
          fdesde: fdesdeString,
          fhasta: fhastaString,
          femision: new Date(),
          cmetodologiapago: this.receiptData.cmetodologiapago,
          iestado: 'V',
          msuma: this.convertStringToNumber(this.receiptData.msuma),
          msumaext: this.receiptData.msumaext,
          mprima: this.convertStringToNumber(this.receiptData.mprima),
          mprimaext: parseFloat(this.receiptData.mprimaext),
          cusuario: this.currentUser.cusuario,
          recibos: this.receiptList,
        }
      ],
      ptasamon: this.receiptData.bcv,
      documentos: this.documentosList
    }

    // Validación de campos obligatorios
    const camposObligatorios = {
      ccedente: 'Cédente',
      cmoneda: 'Moneda',
      cramo: 'Ramo',
      cproducto: 'Producto',
      xpoliza: 'Póliza',
      fdesde: 'Fecha Desde',
      fhasta: 'Fecha Hasta',
      cmetodologiapago: 'Metodología de Pago',
      msuma: 'Suma Asegurada',
      msumaext: 'Suma Asegurada (Ext)',
      mprima: 'Prima',
      mprimaext: 'Prima (Ext)'
    };
  
    const camposFaltantes = Object.keys(camposObligatorios).filter(campo => !this.receiptData[campo] || this.receiptData[campo] === 0);

    if (camposFaltantes.length > 0) {
      const nombresCamposFaltantes = camposFaltantes.map(campo => camposObligatorios[campo]).join(', ');
      Swal.fire({
        title: "Por favor, complete los siguientes campos:",
        text: `\n${nombresCamposFaltantes}`,
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
      return;
    }
    const pcomision = Number(this.vehicleFormGroup.get('pcomision')?.value) || 0;
    if(pcomision > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
      return
    }
    this.http.post(environment.apiUrl + `/api/v1/emission/create`, data).subscribe((response: any) => {
      if(response.status){
        Swal.fire({
          icon: "success",
          title: `${response.message}`,
          showConfirmButton: false,
          timer: 4000
        }).then((result) => {
          window.history.back();
        });
      }
    },(err) => {
      Swal.fire({
        icon: "error",
        title: "Ha ocurrido un Error",
        text: "Estimado usuario, se ha presentado un error inesperado, por favor, contacta al equipo técnico para mayor información",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      }).then((result) => {
          if (result.isConfirmed) {
            
              // location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
          }
      });
    })
  }
}
