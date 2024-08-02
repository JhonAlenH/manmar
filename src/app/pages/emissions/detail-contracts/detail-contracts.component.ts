import {Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl , FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {from, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail-contracts',
  templateUrl: './detail-contracts.component.html',
  styleUrls: ['./detail-contracts.component.scss']
})
export class DetailContractsComponent implements OnInit {

  currentUser!: any
  ramo!: any;
  asegurado!: any;
  tomador!: any;
  id!: any

  detailFormGroup = this._formBuilder.group({
    ccedente: [''],
    cramo: [''],
  });


  constructor( private _formBuilder: FormBuilder,
               private http: HttpClient,
               private modalService: NgbModal,
               private snackBar: MatSnackBar,
               private route: ActivatedRoute,
               private router: Router,
               ) {
                if(this.router.getCurrentNavigation().extras.state == undefined){
                  this.router.navigate(['search-contract']);
                }else{
                  this.id = this.router.getCurrentNavigation().extras.state.id;        
                }

                
               }

  ngOnInit(): void {
    const storedSession = localStorage.getItem('user');
    this.currentUser = JSON.parse(storedSession);
  
    if (this.id && this.currentUser) {
      this.http.post(environment.apiUrl + `/api/v1/emission/detail/${this.id}`, {}).subscribe((response: any) => {
        this.ramo = response.data.xramo;
        this.asegurado = response.data.xnombre;
        this.tomador = response.data.xtomador;
      })
    } 
  }

}
