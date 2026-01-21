import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceExcel } from 'src/app/_services/ServiceExcel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-item',
  templateUrl: './report-item.component.html',
  styleUrls: ['./report-item.component.scss']
})
export class ReportItemComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private serviceExcel: ServiceExcel
  ) {   }
  data:any = null
  disabled:any = true

  ngOnInit(): void {
    this.route.data.subscribe( async v => {this.data = v})
    this.checkData()
    
  }
  async checkData() {
    for (const field of this.data.fields) {
      field.value = null
      if(field.type == 'range-date'){
        field.rangeBegin = null
        field.rangeEnd = null
      }
      if(field.url) {
        const fieldResponse = await fetch(environment.apiUrl + field.url, {
          "method": "GET", "headers": { "CONTENT-TYPE": "Application/json"}
        })
        const response = await fieldResponse.json()
        if(response.status) {
          field.options = response.data
          
        }
      }
      
    }
    this.checkIfComplete()
  }
  changeValue(event:any, field:any) {
    field.value = event.currentTarget.value
    this.checkIfComplete()
  }

  changeRange(event:any,key:any,field:any){
    field[key] = event.currentTarget.value
    if(field.rangeBegin || field.rangeEnd ) {
      if(!field.rangeEnd) {
        field.value = `> '${field.rangeBegin}'`
      } else if (!field.rangeBegin) {
        field.value = `< '${field.rangeEnd}'`
      } else {
        field.value = `BETWEEN '${field.rangeBegin}' AND '${field.rangeEnd}'`
      }
    } else {
      field.value = ''
    }
    this.checkIfComplete()
  }

  async getReport(){
    const values = this.data.fields.filter((item:any) => item.value).map((item2)=> {return { 
      key: item2.key, value: item2.value
    }})
    let data = {}
    for (const value of values) {
      data[value.key] = value.value
    }
    const responseReport = await fetch(environment.apiUrl + this.data.urlExport, {
      "method": "POST", "headers": { "CONTENT-TYPE": "Application/json"}, body: JSON.stringify(data)
    })
    const response = await responseReport.json()
    if(response.status) {
      const date = new Date()
      this.serviceExcel.exportToExcel(response.data, response.label);
    }

  }

  checkIfComplete(){
    this.disabled = false
    const requiredFields = this.data.fields.filter((item:any) => item.required)
    const formIdContainer = document.forms['reporte']
    const formData = new FormData(formIdContainer)
    for (var field of requiredFields) {
      if(!field.value) {
        this.disabled = true
      }
    }
  }

}
