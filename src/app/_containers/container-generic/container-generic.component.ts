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
  selector: 'app-container-generic',
  templateUrl: './container-generic.component.html',
  styleUrls: ['./container-generic.component.scss']
})
export class ContainerGenericComponent implements OnInit {
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
  planList: any[] = []; 

  brandControl = new FormControl('');
  modelControl = new FormControl('');
  versionControl = new FormControl('');
  colorControl = new FormControl('');
  executiveControl = new FormControl('');
  agentsControl = new FormControl('');
  planControl = new FormControl('');

  filteredBrand!: Observable<string[]>;
  filteredModel!: Observable<string[]>;
  filteredVersion!: Observable<string[]>;
  filteredColor!: Observable<string[]>;
  filteredExecutive!: Observable<string[]>;
  filteredAgents!: Observable<string[]>;
  filteredPlan!: Observable<string[]>;

  public page = 1;
  public pageSize = 6;

  genericFormGroup = this._formBuilder.group({
    xcobertura: [{ value: '', disabled: false }],
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
    this.getExecutive();
    this.getProducers();
    this.genericFormGroup.valueChanges.subscribe(() => {
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
  }

  getProducers(){
    this.http.post(environment.apiUrl + '/api/v1/emission/producers', null).subscribe((response: any) => {
      if (response.status) {
        this.MontoADistribuir = this.receiptData.mdistribucion.toFixed(2);
        this.genericFormGroup.get('cproductor')?.setValue(response.cproductor);
        this.genericFormGroup.get('xproductor')?.setValue(response.xproductor);
        if(this.currentUser.data.cejecutivo){
          this.genericFormGroup.get('pcomision_p')?.setValue('40');
        }else{
          this.genericFormGroup.get('pcomision_p')?.setValue('100');
        }
        const mprima = this.receiptData.mdistribucion;
        const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
    
        const primaCalculada_p = mprima * pcomision_p / 100;
    
        if(pcomision_p != 0){
          this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
        }
        const comision = primaCalculada_p * this.receiptData.bcv;
    
        // Formatear con separadores de miles y decimales
        this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(comision);

        this.comisionProductor = response.pcomision
        this.commissionSumValidator();
      }
    });
  }

  getExecutive(){
    this.http.post(environment.apiUrl + '/api/v1/valrep/executive', null).subscribe((response: any) => {
      if (response.data.executive) {
        this.executiveList = [];
        for (let i = 0; i < response.data.executive.length; i++) {
          this.executiveList.push({
            id: response.data.executive[i].cejecutivo,
            value: response.data.executive[i].xejecutivo,
            comision: response.data.executive[i].pcomision,
          });
        }
        const selectedMe = this.executiveList.find(executive => executive.id === this.currentUser.data.cejecutivo);
        if (selectedMe) {
            this.genericFormGroup.get('cejecutivo')?.setValue(selectedMe.id);
            this.genericFormGroup.get('xejecutivo')?.setValue(selectedMe.value);
            this.genericFormGroup.get('pcomision_e')?.setValue('');
            this.genericFormGroup.get('pcomision_p')?.setValue('');
            this.genericFormGroup.get('pcomision_e')?.setValue('60');
            this.genericFormGroup.get('pcomision_p')?.setValue('40');

            this.comisionEjecutivo = selectedMe.comision

            const mprima = this.receiptData.mdistribucion;
            const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
            const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;

            const primaCalculada_p = mprima * pcomision_p / 100;
            const primaCalculada_e = mprima * pcomision_e / 100;

            if(pcomision_p != 0){
              this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
            }

            if(pcomision_p != 0){
              this.genericFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
            }
            const comision = primaCalculada_p * this.receiptData.bcv;
            const comisionE = primaCalculada_e * this.receiptData.bcv;

            // Formatear con separadores de miles y decimales
            this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(comision);

            // Formatear con separadores de miles y decimales
            this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(comisionE);

            this.Agents = true;
            this.getAgents();
            this.commissionSumValidator();
        }
        this.executiveList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredExecutive = this.executiveControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterExecutive(value || ''))
        );
      }
    });
  }

  private _filterExecutive(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.executiveList
      .map(executive => executive.value)
      .filter(executive => executive.toLowerCase().includes(filterValue));
  }

  onExecutiveSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedMet = this.executiveList.find(executive => executive.value === selectedValue);
    if (selectedMet) {
      this.genericFormGroup.get('cejecutivo')?.setValue(selectedMet.id);
      this.genericFormGroup.get('xejecutivo')?.setValue(selectedMet.value);
      this.genericFormGroup.get('pcomision_e')?.setValue('');
      this.genericFormGroup.get('pcomision_p')?.setValue('');
      this.genericFormGroup.get('pcomision_e')?.setValue('60');
      this.genericFormGroup.get('pcomision_p')?.setValue('40');

      this.comisionEjecutivo = selectedMet.comision

      const mprima = this.receiptData.mdistribucion;
      const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
      const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;

      const primaCalculada_p = mprima * pcomision_p / 100;
      const primaCalculada_e = mprima * pcomision_e / 100;

      if(pcomision_p != 0){
        this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
      }

      if(pcomision_p != 0){
        this.genericFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
      }
      const comision = primaCalculada_p * this.receiptData.bcv;
      const comisionE = primaCalculada_e * this.receiptData.bcv;

      // Formatear con separadores de miles y decimales
      this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comision);

      // Formatear con separadores de miles y decimales
      this.mcomision_e_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comisionE);

      this.Agents = true;
      this.activaEliminarEjecutivo = true;
      this.getAgents();
      this.commissionSumValidator();
      // if(this.comisionesDivididas.length > 0){
      //   this.commisionSumValidatorAgents(); 
      // }else{
         
      // }

    }
  }

  getAgents(){
    const ejecutive = this.genericFormGroup.get('cejecutivo')?.value;
    this.http.get(environment.apiUrl + `/api/v1/valrep/agents/${ejecutive}`).subscribe((response: any) => {
      if (response.data.agents) {
        this.agentsList = [];
        this.agentsList = response.data.agents.map((item: any) => ({
          id: item.cagente,
          value: item.xagente,
          pcomision_a: item.pcomision
        }))
        this.agentsList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredAgents = this.agentsControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterAgents(value || ''))
        );
      }
    });
  }

  private _filterAgents(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.agentsList
      .map(agents => agents.value)
      .filter(agents => agents.toLowerCase().includes(filterValue));
  }

  onAgentsSelection(event: any) {
    const selectedValue = event.option.value;
    const selectedAgents = this.agentsList.find(agents => agents.value === selectedValue);
    if (selectedAgents) {
      this.genericFormGroup.get('cagente')?.setValue(selectedAgents.id);
      this.genericFormGroup.get('xagente')?.setValue(selectedAgents.value);
      this.genericFormGroup.get('pcomision_p')?.setValue(this.comisionProductor);
      this.genericFormGroup.get('pcomision_e')?.setValue(this.comisionEjecutivo);
      this.genericFormGroup.get('pcomision_a')?.setValue(selectedAgents.pcomision_a);

      const mprima = this.receiptData.mdistribucion;
      const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
      const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;
      const pcomision_a = parseFloat(this.genericFormGroup.get('pcomision_a')?.value) || 0;

      const primaCalculada_p = mprima * pcomision_p / 100;
      const primaCalculada_e = mprima * pcomision_e / 100;
      const primaCalculada_a = mprima * pcomision_a / 100;

      if(pcomision_p != 0){
        this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
      }

      if(pcomision_p != 0){
        this.genericFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
      }

      if(pcomision_a != 0){
        this.genericFormGroup.get('mcomision_a')?.setValue(primaCalculada_a.toFixed(2))
      }

      const comision = primaCalculada_p * this.receiptData.bcv;
      const comisionE = primaCalculada_e * this.receiptData.bcv;
      const comisionA = primaCalculada_a * this.receiptData.bcv;

      // Formatear con separadores de miles y decimales
      this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comision);

      // Formatear con separadores de miles y decimales
      this.mcomision_e_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comisionE);

      // Formatear con separadores de miles y decimales
      this.mcomision_a_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comisionA);

      this.activaEliminarAgente = true;
      this.commissionSumValidator();
    }
  }

  // onSelectionChange(event: any) {
  //   this.selectedAgents = event.value;

  //   this.comisionesDivididas = this.selectedAgents.map((item: any) => ({
  //     valor: item.value,
  //     comision: item.pcomision_a / this.selectedAgents.length
  //   }));

  //   this.genericFormGroup.get('pcomision_p')?.setValue(this.comisionProductor)
  //   this.genericFormGroup.get('pcomision_e')?.setValue(this.comisionEjecutivo)
  //   this.commisionSumValidatorAgents();

  //   this.cdr.detectChanges();
  // }

  // onCommissionChange(comision: any, index: number) {
  //   this.comisionesDivididas[index].comision = comision;
  //   console.log(comision)
  // }

  commissionSumValidator() {
    const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
    const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;
    const pcomision_a = parseFloat(this.genericFormGroup.get('pcomision_a')?.value) || 0;
    const sum = pcomision_p + pcomision_e + pcomision_a;

    this.commissionSum = sum;

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#334ebd",
      });
    }
  }

  commissionSumValidator2() {
    const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
    const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;
    const pcomision_a = parseFloat(this.genericFormGroup.get('pcomision_a')?.value) || 0;
    const sum = pcomision_p + pcomision_e + pcomision_a;

    this.commissionSum = sum;

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#334ebd",
      });
    }else{
      this.calculatePremiums();
    }
  }

  calculatePremiums(){
    const mprima = this.receiptData.mdistribucion;
    const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
    const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;
    const pcomision_a = parseFloat(this.genericFormGroup.get('pcomision_a')?.value) || 0;

    const primaCalculada_p = mprima * pcomision_p / 100;

    if(pcomision_p != 0){
      this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
    }
    
    if(pcomision_e != 0){
      this.getCalculosComisionEjecutivo(mprima, pcomision_e)
    }

    if(pcomision_a != 0){
      this.getCalculosComisionAgentes(mprima, pcomision_a)
    }
  }

  getCalculosComisionEjecutivo(mprima: any, pcomision_e: any){
    const primaCalculada_e = mprima * pcomision_e / 100;
    if(pcomision_e != 0){
      this.genericFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
      console.log(this.genericFormGroup.get('mcomision_e')?.value)
    }
  }

  getCalculosComisionAgentes(mprima: any, pcomision_a: any){
    const primaCalculada_a = mprima * pcomision_a / 100;
    if(pcomision_a != 0){
      this.genericFormGroup.get('mcomision_a')?.setValue(primaCalculada_a.toFixed(2))
    }
  }


  // commisionSumValidatorAgents(){
  //   const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
  //   const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;
  //   const sumaComisionesIndividuales = this.comisionesDivididas.reduce((total, comision) => total + comision.comision, 0);
  //   // Sumar las comisiones del productor y del ejecutivo
  //   const sumaComisionesTotales = sumaComisionesIndividuales + pcomision_p + pcomision_e;

  //   this.commissionSum = sumaComisionesTotales

  //   if(this.commissionSum > 100){
  //     Swal.fire({
  //       title: "Se excedió del 100% de Comisión",
  //       icon: "warning",
  //       confirmButtonText: "<strong>Aceptar</strong>",
  //       confirmButtonColor: "#334ebd",
  //     });
  //   }
  // }

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

  removeRecord(type: string) {
    if (type === 'ejecutivo') {
      this.activaEliminarAgente = false;
      this.activaEliminarEjecutivo = false;
      this.Agents = false;
      this.genericFormGroup.get('cejecutivo')?.setValue('');
      this.genericFormGroup.get('xejecutivo')?.setValue('');
      this.getExecutive();
      this.genericFormGroup.get('pcomision_e')?.setValue('');
      this.genericFormGroup.get('pcomision_p')?.setValue('100');
      this.genericFormGroup.get('mcomision_p')?.setValue(this.receiptData.mdistribucion.toFixed(2));
      this.genericFormGroup.get('mcomision_e')?.setValue('');
      this.genericFormGroup.get('cagente')?.setValue('');
      this.genericFormGroup.get('xagente')?.setValue('');
      
      this.genericFormGroup.get('pcomision_a')?.setValue('');

      const comision = this.receiptData.mdistribucion * this.receiptData.bcv;
    
      // Formatear con separadores de miles y decimales
      this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comision);

      this.mcomision_e_bs = ''

    } else if (type === 'agente') {
      this.genericFormGroup.get('cagente')?.setValue('');
      this.genericFormGroup.get('xagente')?.setValue('');
      this.genericFormGroup.get('pcomision_a')?.setValue('');
      this.genericFormGroup.get('pcomision_e')?.setValue('60');
      this.genericFormGroup.get('pcomision_p')?.setValue('40');

      this.getAgents();

      const pcomision_p = parseFloat(this.genericFormGroup.get('pcomision_p')?.value) || 0;
      const pcomision_e = parseFloat(this.genericFormGroup.get('pcomision_e')?.value) || 0;

      const primaCalculada_p = this.receiptData.mdistribucion * pcomision_p / 100;
      const primaCalculada_e = this.receiptData.mdistribucion * pcomision_e / 100;

      this.genericFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2));
      this.genericFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2));
      this.genericFormGroup.get('mcomision_a')?.setValue('');

      const comision = primaCalculada_p * this.receiptData.bcv;
      const comisionE = primaCalculada_e * this.receiptData.bcv;

      // Formatear con separadores de miles y decimales
      this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comision);

      // Formatear con separadores de miles y decimales
      this.mcomision_e_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comisionE);

      this.mcomision_a_bs = '';
    }
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
      xnombre_asegurado: this.receiptData.xasegurado,
      xcorreo_asegurado: this.receiptData.xcorreo_asegurado,
      xtelefono_asegurado: this.receiptData.xtelefono_asegurado,
      icedula_tomador: this.receiptData.itipodoc_t,
      xcedula_tomador: this.receiptData.xdoc_identificacion_t,
      xnombre_tomador: this.receiptData.xtomador,
      xdireccion_tomador: this.receiptData.xdireccion,
      xtelefono_tomador: this.receiptData.xtelefono,
      xprofesion_tomador: this.receiptData.xprofesion,
      cestado_tomador: this.receiptData.cestado,
      cciudad_tomador: this.receiptData.cciudad,
      xrif_tomador: this.receiptData.xrif,
      xdomicilio_tomador: this.receiptData.xdomicilio,
      xzona_postal_tomador: this.receiptData.xzona_postal,
      xcorreo_tomador: this.receiptData.xcorreo,
      cmoneda: this.receiptData.cmoneda,
      cramo: this.receiptData.cramo,
      xpoliza: this.receiptData.xpoliza,
      fdesde_pol: fdesdeString,
      fhasta_pol: fhastaString,
      femision: new Date(),
      cmetodologiapago: this.receiptData.cmetodologiapago,
      ptasa_cambio: this.receiptData.bcv,
      msuma: this.convertStringToNumber(this.receiptData.msuma),
      msumaext: this.receiptData.msumaext,
      mprima: this.convertStringToNumber(this.receiptData.mprima),
      mprimaext: parseFloat(this.receiptData.mprimaext),
      pcomision: this.convertStringToNumber(this.genericFormGroup.get('pcomision_p')?.value),
      mcomision: this.convertStringToNumber(this.mcomision_p_bs),
      mcomisionext: parseFloat(this.genericFormGroup.get('mcomision_p')?.value),
      cproductor: this.genericFormGroup.get('cproductor')?.value,
      pcomision_p: this.convertStringToNumber(this.genericFormGroup.get('pcomision_p')?.value),
      cejecutivo: this.genericFormGroup.get('cejecutivo')?.value,
      pcomision_e: this.convertStringToNumber(this.genericFormGroup.get('pcomision_e')?.value),
      cagente: this.genericFormGroup.get('cagente')?.value,
      pcomision_a: this.genericFormGroup.get('pcomision_a')?.value,
      cusuario: this.currentUser.data.cusuario
    }

    console.log(data)
        // Validación de campos obligatorios
        const camposObligatorios = {
          ccedente: 'Cédente',
          cmoneda: 'Moneda',
          cramo: 'Ramo',
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
              confirmButtonColor: "#334ebd",
          });
          return;
      }

    if(this.commissionSum > 100){
      Swal.fire({
        title: "Se excedió del 100% de Comisión",
        icon: "warning",
        confirmButtonText: "<strong>Aceptar</strong>",
        confirmButtonColor: "#334ebd",
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
        confirmButtonColor: "#fdd213d1",
      }).then((result) => {
          if (result.isConfirmed) {
              location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
          }
      });
    })
  }

}
