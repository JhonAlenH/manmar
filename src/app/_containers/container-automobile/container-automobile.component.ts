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
  coverageList: any[] = [];
  documentosList: any = []

  brandControl = new FormControl('');
  modelControl = new FormControl('');
  versionControl = new FormControl('');
  colorControl = new FormControl('');
  executiveControl = new FormControl('');
  agentsControl = new FormControl('');
  coverageControl = new FormControl('');

  filteredBrand!: Observable<string[]>;
  filteredModel!: Observable<string[]>;
  filteredVersion!: Observable<string[]>;
  filteredColor!: Observable<string[]>;
  filteredExecutive!: Observable<string[]>;
  filteredAgents!: Observable<string[]>;
  filteredCoverage!: Observable<string[]>;

  public page = 1;
  public pageSize = 6;
  public pageNotas = 1;
  public pageNotasSize = 5;

  vehicleFormGroup = this._formBuilder.group({
    xplaca: ['',[Validators.maxLength(7)]],
    xmarca: [{ value: '', disabled: true}],
    xmodelo: [{ value: '', disabled: true}],
    xversion: [{ value: '', disabled: true}],
    fano: ['',[ Validators.maxLength(4)]],
    npasajeros: [{ value: '', disabled: true }],
    ccolor: [{ value: '', disabled: true }],
    ccobertura: [{ value: '', disabled: false }],
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
    this.getExecutive();
    this.getProducers();
    this.getCoverage();
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
  }

  changeYears() {
    this.getBrand();
  }

  getBrand(){
    let data = {
      qano: this.vehicleFormGroup.get('fano')?.value
    };
    this.http.post(environment.apiUrl + '/api/v1/valrep/brand', data).subscribe((response: any) => {
      if (response.data.brand) {
        this.brandList = [];
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
    this.http.post(environment.apiUrl + '/api/v1/valrep/model', data).subscribe((response: any) => {
      if (response.data.model) {
        this.modelList = [];
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
    this.http.post(environment.apiUrl + '/api/v1/valrep/version', data).subscribe((response: any) => {
      if (response.data.version) {
        this.versionList = [];
        for (let i = 0; i < response.data.version.length; i++) {
          this.versionList.push({
            id: i,
            value: response.data.version[i].xversion,
            id_inma: response.data.version[i].id,
            npasajero: response.data.version[i].npasajero,
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
      this.vehicleFormGroup.get('npasajeros')?.setValue(selectedVersion.npasajero);
    }
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

  getCoverage(){
    this.http.post(environment.apiUrl + `/api/v1/valrep/coverage/${this.receiptData.cramo}`, null).subscribe((response: any) => {
      if (response.data.coverage) {
        this.coverageList = [];
        this.coverageList = response.data.coverage.map((item: any) => ({
          id: item.ccobertura,
          value: item.xcobertura, 
        }))
        this.coverageList.sort((a, b) => a.value > b.value ? 1 : -1)
        this.filteredCoverage = this.coverageControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCoverage(value || ''))
        );
      }
    });
  }

  private _filterCoverage(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.coverageList
      .map(coverage => coverage.value)
      .filter(coverage => coverage.toLowerCase().includes(filterValue));
  }

  onCoverageSelection(event: any) {
    const selectedValue = event.option.value;
    const selected = this.coverageList.find(coverage => coverage.value === selectedValue);
    if (selected) {
      this.vehicleFormGroup.get('ccobertura')?.setValue(selected.id);
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
        this.MontoADistribuir = this.receiptData.mdistribucion.toFixed(2);
        this.vehicleFormGroup.get('cproductor')?.setValue(response.cproductor);
        this.vehicleFormGroup.get('xproductor')?.setValue(response.xproductor);
        if(this.currentUser.data.cejecutivo){
          this.vehicleFormGroup.get('pcomision_p')?.setValue('40');
        }else{
          this.vehicleFormGroup.get('pcomision_p')?.setValue('100');
        }
        const mprima = this.receiptData.mdistribucion;
        const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
    
        const primaCalculada_p = mprima * pcomision_p / 100;
    
        if(pcomision_p != 0){
          this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
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
            this.vehicleFormGroup.get('cejecutivo')?.setValue(selectedMe.id);
            this.vehicleFormGroup.get('xejecutivo')?.setValue(selectedMe.value);
            this.vehicleFormGroup.get('pcomision_e')?.setValue('');
            this.vehicleFormGroup.get('pcomision_p')?.setValue('');
            this.vehicleFormGroup.get('pcomision_e')?.setValue('60');
            this.vehicleFormGroup.get('pcomision_p')?.setValue('40');

            this.comisionEjecutivo = selectedMe.comision

            const mprima = this.receiptData.mdistribucion;
            const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
            const pcomision_e = parseFloat(this.vehicleFormGroup.get('pcomision_e')?.value) || 0;

            const primaCalculada_p = mprima * pcomision_p / 100;
            const primaCalculada_e = mprima * pcomision_e / 100;

            if(pcomision_p != 0){
              this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
            }

            if(pcomision_p != 0){
              this.vehicleFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
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
      this.vehicleFormGroup.get('cejecutivo')?.setValue(selectedMet.id);
      this.vehicleFormGroup.get('xejecutivo')?.setValue(selectedMet.value);
      this.vehicleFormGroup.get('pcomision_e')?.setValue('');
      this.vehicleFormGroup.get('pcomision_p')?.setValue('');
      this.vehicleFormGroup.get('pcomision_e')?.setValue('60');
      this.vehicleFormGroup.get('pcomision_p')?.setValue('40');

      this.comisionEjecutivo = selectedMet.comision

      const mprima = this.receiptData.mdistribucion;
      const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
      const pcomision_e = parseFloat(this.vehicleFormGroup.get('pcomision_e')?.value) || 0;

      const primaCalculada_p = mprima * pcomision_p / 100;
      const primaCalculada_e = mprima * pcomision_e / 100;

      if(pcomision_p != 0){
        this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
      }

      if(pcomision_p != 0){
        this.vehicleFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
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
    const ejecutive = this.vehicleFormGroup.get('cejecutivo')?.value;
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
      this.vehicleFormGroup.get('cagente')?.setValue(selectedAgents.id);
      this.vehicleFormGroup.get('xagente')?.setValue(selectedAgents.value);
      this.vehicleFormGroup.get('pcomision_p')?.setValue(this.comisionProductor);
      this.vehicleFormGroup.get('pcomision_e')?.setValue(this.comisionEjecutivo);
      this.vehicleFormGroup.get('pcomision_a')?.setValue(selectedAgents.pcomision_a);

      const mprima = this.receiptData.mdistribucion;
      const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
      const pcomision_e = parseFloat(this.vehicleFormGroup.get('pcomision_e')?.value) || 0;
      const pcomision_a = parseFloat(this.vehicleFormGroup.get('pcomision_a')?.value) || 0;

      const primaCalculada_p = mprima * pcomision_p / 100;
      const primaCalculada_e = mprima * pcomision_e / 100;
      const primaCalculada_a = mprima * pcomision_a / 100;

      if(pcomision_p != 0){
        this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
      }

      if(pcomision_p != 0){
        this.vehicleFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
      }

      if(pcomision_a != 0){
        this.vehicleFormGroup.get('mcomision_a')?.setValue(primaCalculada_a.toFixed(2))
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

  //   this.vehicleFormGroup.get('pcomision_p')?.setValue(this.comisionProductor)
  //   this.vehicleFormGroup.get('pcomision_e')?.setValue(this.comisionEjecutivo)
  //   this.commisionSumValidatorAgents();

  //   this.cdr.detectChanges();
  // }

  // onCommissionChange(comision: any, index: number) {
  //   this.comisionesDivididas[index].comision = comision;
  //   console.log(comision)
  // }

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
    }else{
      this.calculatePremiums();
    }
  }

  calculatePremiums(){
    const mprima = this.receiptData.mdistribucion;
    const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
    const pcomision_e = parseFloat(this.vehicleFormGroup.get('pcomision_e')?.value) || 0;
    const pcomision_a = parseFloat(this.vehicleFormGroup.get('pcomision_a')?.value) || 0;

    const primaCalculada_p = mprima * pcomision_p / 100;

    if(pcomision_p != 0){
      this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2))
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
      this.vehicleFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2))
      console.log(this.vehicleFormGroup.get('mcomision_e')?.value)
    }
  }

  getCalculosComisionAgentes(mprima: any, pcomision_a: any){
    const primaCalculada_a = mprima * pcomision_a / 100;
    if(pcomision_a != 0){
      this.vehicleFormGroup.get('mcomision_a')?.setValue(primaCalculada_a.toFixed(2))
    }
  }


  // commisionSumValidatorAgents(){
  //   const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
  //   const pcomision_e = parseFloat(this.vehicleFormGroup.get('pcomision_e')?.value) || 0;
  //   const sumaComisionesIndividuales = this.comisionesDivididas.reduce((total, comision) => total + comision.comision, 0);
  //   // Sumar las comisiones del productor y del ejecutivo
  //   const sumaComisionesTotales = sumaComisionesIndividuales + pcomision_p + pcomision_e;

  //   this.commissionSum = sumaComisionesTotales

  //   if(this.commissionSum > 100){
  //     Swal.fire({
  //       title: "Se excedió del 100% de Comisión",
  //       icon: "warning",
  //       confirmButtonText: "<strong>Aceptar</strong>",
  //       confirmButtonColor: "#5e72e4",
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
      this.vehicleFormGroup.get('cejecutivo')?.setValue('');
      this.vehicleFormGroup.get('xejecutivo')?.setValue('');
      this.getExecutive();
      this.vehicleFormGroup.get('pcomision_e')?.setValue('');
      this.vehicleFormGroup.get('pcomision_p')?.setValue('100');
      this.vehicleFormGroup.get('mcomision_p')?.setValue(this.receiptData.mdistribucion.toFixed(2));
      this.vehicleFormGroup.get('mcomision_e')?.setValue('');
      this.vehicleFormGroup.get('cagente')?.setValue('');
      this.vehicleFormGroup.get('xagente')?.setValue('');
      
      this.vehicleFormGroup.get('pcomision_a')?.setValue('');

      const comision = this.receiptData.mdistribucion * this.receiptData.bcv;
    
      // Formatear con separadores de miles y decimales
      this.mcomision_p_bs = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(comision);

      this.mcomision_e_bs = ''

    } else if (type === 'agente') {
      this.vehicleFormGroup.get('cagente')?.setValue('');
      this.vehicleFormGroup.get('xagente')?.setValue('');
      this.vehicleFormGroup.get('pcomision_a')?.setValue('');
      this.vehicleFormGroup.get('pcomision_e')?.setValue('60');
      this.vehicleFormGroup.get('pcomision_p')?.setValue('40');

      this.getAgents();

      const pcomision_p = parseFloat(this.vehicleFormGroup.get('pcomision_p')?.value) || 0;
      const pcomision_e = parseFloat(this.vehicleFormGroup.get('pcomision_e')?.value) || 0;

      const primaCalculada_p = this.receiptData.mdistribucion * pcomision_p / 100;
      const primaCalculada_e = this.receiptData.mdistribucion * pcomision_e / 100;

      this.vehicleFormGroup.get('mcomision_p')?.setValue(primaCalculada_p.toFixed(2));
      this.vehicleFormGroup.get('mcomision_e')?.setValue(primaCalculada_e.toFixed(2));
      this.vehicleFormGroup.get('mcomision_a')?.setValue('');

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
      xpoliza: this.receiptData.xpoliza,
      fdesde_pol: fdesdeString,
      fhasta_pol: fhastaString,
      femision: new Date(),
      ccobertura: this.vehicleFormGroup.get('ccobertura')?.value,
      igrua: this.vehicleFormGroup.get('igrua')?.value,
      cmetodologiapago: this.receiptData.cmetodologiapago,
      ptasa_cambio: this.receiptData.bcv,
      msuma: this.convertStringToNumber(this.receiptData.msuma),
      msumaext: this.receiptData.msumaext,
      mprima: this.convertStringToNumber(this.receiptData.mprima),
      mprimaext: parseFloat(this.receiptData.mprimaext),
      pcomision: this.receiptData.pcomision,
      mcomision: this.convertStringToNumber(this.mcomision_p_bs),
      mcomisionext: parseFloat(this.vehicleFormGroup.get('mcomision_p')?.value),
      cproductor: this.vehicleFormGroup.get('cproductor')?.value,
      pcomision_p: this.convertStringToNumber(this.vehicleFormGroup.get('pcomision_p')?.value),
      cejecutivo: this.vehicleFormGroup.get('cejecutivo')?.value,
      pcomision_e: this.convertStringToNumber(this.vehicleFormGroup.get('pcomision_e')?.value),
      cagente: this.vehicleFormGroup.get('cagente')?.value,
      pcomision_a: this.vehicleFormGroup.get('pcomision_a')?.value,
      cusuario: this.currentUser.data.cusuario,
      documentos: this.documentosList
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
              location.reload(); // Recarga la página si el usuario hizo clic en el botón de aceptar
          }
      });
    })
  }
}
