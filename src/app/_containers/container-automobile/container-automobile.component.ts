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
  comisionProductor: any;
  comisionEjecutivo: any;
  mcomision_p_bs: any;
  mcomision_e_bs: any;
  mcomision_a_bs: any;
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
  executiveControl = new FormControl('');
  agentsControl = new FormControl('');

  filteredBrand!: Observable<string[]>;
  filteredModel!: Observable<string[]>;
  filteredVersion!: Observable<string[]>;
  filteredColor!: Observable<string[]>;
  filteredExecutive!: Observable<string[]>;
  filteredAgents!: Observable<string[]>;

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
    cejecutivo: [{ value: '', disabled: false }],
    xejecutivo: [{ value: '', disabled: false }],
    pcomision_e: [{ value: '', disabled: false }],
    mcomision_e: [{ value: '', disabled: true }],
    cagente: [{ value: '', disabled: false }],
    xagente: [{ value: '', disabled: false }],
    pcomision_a: [{ value: '', disabled: false }],
    mcomision_a: [{ value: '', disabled: true }],
    cproductor: [{ value: '', disabled: false }],
    xproductor: [{ value: '', disabled: true }],
    pcomision_p: [{ value: '', disabled: false }],
    mcomision_p: [{ value: '', disabled: true }],
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
    this.getColor();
    // this.getExecutive();
    this.getProducers();
    this.vehicleFormGroup.valueChanges.subscribe(() => {
      this.commissionSumValidator();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.receiptData) {
      this.updateReceiptData(changes.receiptData.currentValue);
    }
  }

  updateReceiptData(data: any) {
    let dataCompleta = {
      fdesde: data.fdesde,
      fhasta: data.fhasta,
      mprima: data.mprimaext,
      cmetodologiapago: data.cmetodologiapago,
    }
    this.http.post(environment.apiUrl + '/api/v1/emission/receipt', dataCompleta).subscribe((response: any) => {
      if(response.status){
        this.receiptList = [];
        this.receiptList = response.data.receipt.map((state: any) => ({
          fdesde_rec: this.dateUtilService.formatDate(new Date(state.fdesde_rec)),
          fhasta_rec: this.dateUtilService.formatDate(new Date(state.fhasta_rec)),
          mprima: state.mprima.toFixed(2),
        }));
      }
    })
    if(data.pcomision) {
      this.vehicleFormGroup.get('pcomision_p')?.setValue(data.pcomision);
    }
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
      console.log(event.srcElement.id)
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
            id: i,
            value: response.data.version[i].xversion,
            id_inma: response.data.version[i].id,
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

  getProducers(){
    this.http.post(environment.apiUrl + '/api/v1/emission/producers', null).subscribe((response: any) => {
      if (response.status) {
        
        this.vehicleFormGroup.get('cproductor')?.setValue(response.cproductor);
        this.vehicleFormGroup.get('xproductor')?.setValue(response.xproductor);

        const mprima = this.receiptData.mprimaext;

        const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
    
        const primaCalculada_p = mprima * pcomision_p / 100;
    
        if(pcomision_p != 0){ 
          this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
        }

        let mcomision_bs = primaCalculada_p 
        if(this.receiptData.cmoneda != 1 ) {
          mcomision_bs = primaCalculada_p * this.receiptData.bcv;
        }
    
        // Formatear con separadores de miles y decimales
        this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(mcomision_bs);

        this.MontoADistribuir = primaCalculada_p.toFixed(2);
        this.comisionProductor = response.pcomision
        this.commissionSumValidator();
      }
    });
  }

  commissionSumValidator() {
    const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
    const pcomision_e = parseFloat(this.vehicleFormGroup.get('pcomision_e')?.value) || 0;
    const pcomision_a = parseFloat(this.vehicleFormGroup.get('pcomision_a')?.value) || 0;
    const sum = pcomision_p + pcomision_e + pcomision_a;

    this.commissionSum = sum;

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
    }
  }

  commissionSumValidator2() {
    const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;

    this.commissionSum = pcomision_p;

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#5e72e4",
      });
    }else{
      this.calculatePremiums();
    }
  }

  calculatePremiums(){
    const mprima = this.receiptData.mprimaext;
    const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;

    const primaCalculada_p = mprima * pcomision_p / 100;

    let mcomision_bs = primaCalculada_p 
      this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
      if(this.receiptData.cmoneda != 1 ) {
        mcomision_bs = primaCalculada_p * this.receiptData.bcv;
      }
      // Formatear con separadores de miles y decimales
      this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(mcomision_bs);

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

    const formatDateToString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11, por lo que sumamos 1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const fdesdeString = formatDateToString(new Date(this.receiptData.fdesde));
    const fhastaString = this.receiptData.fhasta;

    let data = {
      ccedente: this.receiptData.ccedente,
      icedula_asegurado: this.receiptData.itipodoc,
      xcedula_asegurado: this.receiptData.xcedula.trim(),
      xnombre_asegurado: this.receiptData.xasegurado.toUpperCase() || null,
      xcorreo_asegurado: this.receiptData.xcorreo_asegurado.toUpperCase() || null,
      xtelefono_asegurado: this.receiptData.xtelefono_asegurado,
      icedula_tomador: this.receiptData.itipodoc_t,
      xcedula_tomador: this.receiptData.xdoc_identificacion_t,
      xnombre_tomador: this.receiptData.xtomador.toUpperCase() || null,
      xdireccion_tomador: this.receiptData.xdireccion.toUpperCase() || null,
      xtelefono_tomador: this.receiptData.xtelefono,
      xprofesion_tomador: this.receiptData.xprofesion.toUpperCase() || null,
      cestado_tomador: this.receiptData.cestado,
      cciudad_tomador: this.receiptData.cciudad,
      xrif_tomador: this.receiptData.xrif,
      xdomicilio_tomador: this.receiptData.xdomicilio.toUpperCase() || null,
      xzona_postal_tomador: this.receiptData.xzona_postal,
      xcorreo_tomador: this.receiptData.xcorreo.toUpperCase() || null,
      cmoneda: this.receiptData.cmoneda,
      cramo: this.receiptData.cramo,
      cproducto: this.receiptData.cproducto,
      xpoliza: this.receiptData.xpoliza,
      fdesde_pol: fdesdeString,
      fhasta_pol: fhastaString,
      femision: new Date(),
      igrua: this.vehicleFormGroup.get('igrua')?.value,
      cmetodologiapago: this.receiptData.cmetodologiapago,
      ptasa_cambio: this.receiptData.bcv,
      msuma: this.convertStringToNumber(this.receiptData.msuma),
      msumaext: this.receiptData.msumaext,
      mprima: this.convertStringToNumber(this.receiptData.mprima),
      mprimaext: parseFloat(this.receiptData.mprimaext),
      pcomision: this.vehicleFormGroup.get('pcomision_p')?.value,
      mcomision: this.convertStringToNumber(this.mcomision_p_bs),
      mcomisionext: parseFloat(this.vehicleFormGroup.get('mcomision_p')?.value),
      cproductor: this.vehicleFormGroup.get('cproductor')?.value,
      pcomision_p: 100,
      cejecutivo: null,
      pcomision_e: 0,
      cagente: null,
      pcomision_a: 0,
      cusuario: this.currentUser.data.cusuario,
      documentos: this.documentosList
    }

    console.log(data)
        // Validación de campos obligatorios
        const camposObligatorios = {
          ccedente: 'Cédente',
          cmoneda: 'Moneda',
          cramo: 'Ramo',
          cproducto: 'Producto',
          xpoliza: 'Póliza',
          fdesde_pol: 'Fecha Desde',
          fhasta_pol: 'Fecha Hasta',
          cmetodologiapago: 'Metodología de Pago',
          msuma: 'Suma Asegurada',
          msumaext: 'Suma Asegurada (Ext)',
          mprima: 'Prima',
          mprimaext: 'Prima (Ext)'
      };
  
      const camposFaltantes = Object.keys(camposObligatorios).filter(campo => !data[campo] || data[campo] === 0);
  
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

    if(this.commissionSum > 100){
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
          location.reload()
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
