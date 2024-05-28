import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// import { ItemFormService } from './item-form.service';
// import {MatSnackBar} from '@angular/material/snack-bar';
// import { AuthService } from '../../auth/auth.service';
import { formatDate } from '@angular/common';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-user-profile',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {


  mode = ''
  itemData = {}
  mainUrl = ''
  itemId:any = ''
  title = ''
  createUrl = ''
  disabledInputs = false
  editUrl = ''
  disableUrl = ''
  fields:any = ['1']
  formId = ''
  options: any = []
  ccompania: any = ''
  loading: boolean = false
  disabled: boolean = true

  sub = new Subscription()
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    // public ItemFormService: ItemFormService,
    // private _snackBar: MatSnackBar,
    // public AuthService: AuthService
  ) {}

//   openSnackBar(message: string) {
//     this._snackBar.open(message, 'Cerrar', {duration: 2000});
//   }
//   openSnackBarLoading() {
//     this._snackBar.open('Cargando datos...', '');
//   }
//   closeSnackBar() {
//     this._snackBar.dismiss();
//   }

  async ngOnInit() {
    
    // this.openSnackBarLoading()
    // this.ccompania = localStorage.getItem("ccompania");
    this.ccompania = 1;
    this.sub = this.route.data.subscribe(v => {
        this.mode = v.mode
        this.title = v.title
        this.mainUrl = v.mainUrl
        this.fields = v.fields
        this.formId = v.formId
        if(this.mode == 'create') {
          this.createUrl = v.createUrl
        } else {
          this.disabledInputs = true
        }
        if(this.mode == 'info') {
          this.editUrl = v.editUrl
          this.disableUrl = v.disableUrl
        }
      });

    if(this.mode == 'info') {
      this.route.url.subscribe( v => {
        this.itemId = v[2].path
        this.title += ' N° ' + this.itemId
        this.editUrl += this.itemId
        this.disableUrl += this.itemId
      });
    }
    for (const field of this.fields) {
      field.options = []
    }
    
    if(this.mode == 'info') {
        this.http.get(environment.apiUrl + this.mainUrl+this.itemId, {}).subscribe(async (data) => {
        this.itemData = data['data'].result
        console.log('data', this.itemData);
        await this.getFieldsData()
        // this.closeSnackBar()
      })
    } else {
      await this.getFieldsData()
    //   this.closeSnackBar()
    }
  }
  async ngAfterViewInit(){

    
    window.addEventListener('load', async (e) => {
      for (const field of await this.fields) {
        if(this.ccompania != '1') {
          if(field.key == 'ccompania') {
            const fieldItem = <HTMLInputElement>document.getElementsByName(field.key)[0]
            fieldItem.value = this.ccompania
            this.setValue(this.ccompania, field.binding_change_field)
          }
        }
      }
    })
    for (const field of await this.fields) {
      if (field.url_id){
        setTimeout(() => {
          const fieldTo = this.fields.find(item => item.key == field.url_id)
          this.setValue(fieldTo.defaultValue, field.key)

        }, 2000);
      }
    }

    
    const formIdContainer = document.forms[this.formId]
    // send item form container
    formIdContainer.addEventListener('submit', (e)=> {
      this.loading = true
      e.preventDefault()
      const formData = new FormData(formIdContainer)
      var formBody: any = []
      // encode form to send in format xrlencoded
      for (var pair of formData.entries()) {
        var encodedKey = encodeURIComponent(pair[0]);
        if(typeof pair[1] == 'string') {
          var encodedValue = encodeURIComponent(pair[1]);
        } else {
          var encodedValue = encodeURIComponent('');
        }
        var encodedBdType = this.fields.find(field => field.key == pair[0])
        if (!encodedBdType) {
          encodedBdType = this.fields.find(field => field.key_form == pair[0])

        }
        encodedBdType = encodeURIComponent(encodedBdType.bdType)
        if (this.ccompania != '1') {
          if(pair[0] == 'ccompania') {
            
          }
        }
        formBody.push(encodedKey + "=" + encodedValue + "[]bd_type=" + encodedBdType);
      }

      formBody = formBody.join("&");
      // url to create in create mode 
      if(this.mode == 'create') {
        this.http.post(environment.apiUrl + this.createUrl, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).subscribe((data) => {
          console.log(data)
        //   this.openSnackBar(data['message'])
          this.loading = false
        })
      } else if(this.mode == 'edit') {
        this.http.post(environment.apiUrl + this.editUrl, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).subscribe((data) => {
          console.log(data)
        //   this.openSnackBar(data['message'])
          this.loading = false
        })
      }
    })
  }
  // get info about the fields pased by routing file
  async getFieldsData() {
    
    for(const field of this.fields) {
      // select options added
      if(field.type == 'select' || field.type == 'simple-select' || field.type == 'multiple-select'){
        if(field.url) {
          if(!field.url_id) {
            this.http.get(environment.apiUrl + field.url, {}).subscribe(async (response) => {
              field.options = await response['data']
              if(this.mode == 'create') {
                field.options.unshift({text: 'Selecciona una opcion...', value: '', selected: true})
              } else {
                field.options.unshift({text: 'Selecciona una opcion...', value: ''})
              }
              if(this.mode == 'info') {
                if(typeof this.itemData[field.key] == 'number'){
                  const optionSelected = field.options.find(option => option.value == this.itemData[field.key])
                  console.log('esta es la seleccionada',this.itemData[field.key])
                  field.defaultValue = this.itemData[field.key]
                  optionSelected.selected = true
                }
              }
            })
          } else {
            field.addedValuesIds = this.itemData[field.key]
          }
        } else {
          field.options = field.values
          if(this.mode == 'create') {
            field.options.unshift({text: 'Selecciona una opcion...', value: '', selected: true})
          } else {
            field.options.unshift({text: 'Selecciona una opcion...', value: ''})
          }
          
        }
        if(field.type == 'multiple-select') {
          field.addedValues = []
        }
      } else {
        if(this.mode == 'info'){
          // added default value to inputs to the info mode
          if(typeof this.itemData[field.key] == 'string' || typeof this.itemData[field.key] == 'number') {
            field.defaultValue = this.itemData[field.key]
          }
        }
      } 
      if(this.mode == 'create'){
        if (field.form_control) {
          field.display = 'none'
        } else {
          field.display = 'block'
        }
        if (field.key == 'ccompania' || field.key == 'ctipoplan'){
          if(this.ccompania != '1') {
            if(this.mode == 'create'){

              field.display = 'none'
            }
          }
          field.defaultValue = this.ccompania
        } else {
          field.defaultValue = ''
        }
      }
      
    }
    console.log('reviso',this.fields)
  }
  // change item (adde or available) to multipleSelect field
  changeItemTo(event: any, field: any, value: any) {
    
    const inputHidden = document.getElementById(event.currentTarget.getAttribute('ms-button-data-id'))
    const inputValue = inputHidden.getAttribute('value').split(',')

    if (event.currentTarget.parentElement.classList.contains('m-s-added')) {
      // add value to availableValues array
      const findedIndex = field.addedValues.findIndex(option => option.value == value.value)
      field.addedValues.splice(findedIndex, 1)
      const findItem = field.options.find(option => option.value == value.key)
      findItem.values.push(value)
      // delete value selected to multipleSelect input
      const index = inputValue.findIndex(valueInput => valueInput == value.value)
      inputValue.splice(index,1)
    } else {
      field.addedValues.push(value)
      // add value to addValues array
      const findItem = field.options.find(option => option.value == value.key)
      const findedIndex = findItem.values.findIndex( service => service.value == value.value)
      findItem.values.splice(findedIndex, 1)
      // add value to multipleSelect input
      if (inputValue[0] == '') {
        inputValue.splice(0,1)
      }
      inputValue.push(value.value + '?' + value.key)
    }

    inputHidden.setAttribute('value', inputValue.join(','))
    this.checkIfComplete()
  }
  // add values to multipleselect field when the chageField is changed
  setValue(value: any, fieldBindingKey:any) {
    const searchedField = this.fields.find(field => field.key == fieldBindingKey)
    searchedField.addedValues = []
    searchedField.options = []
    this.http.get(environment.apiUrl + searchedField.url + '/' + value, {}).subscribe((data) => {
      if(!data['notFinded']) {
        searchedField.options = data['data']
      }
      if(this.mode == 'info') {
        let i = 0
        searchedField.options.forEach(option => {
          
          for (const serviceValue of searchedField.addedValuesIds) {
            const optionFinded = option.values.find( valueN => valueN.value == serviceValue.cservicio)
            const optionFindedIndex = option.values.findIndex( valueN => valueN.value == serviceValue.cservicio)
            if (optionFinded) {
              searchedField.addedValues.push(optionFinded)
              option.values.splice(optionFindedIndex, 1)
            }
          }
        });
      }
    //   this.openSnackBar(data['message'])
    })
  }
  // called in the front of mutiple selection
  setOtherValue(event:any, fieldBindingKey:any) {
    this.setValue(event.currentTarget.value, fieldBindingKey)
    this.checkIfComplete()
  }
  checkOtherValue(event:any, fieldKey: any) {
    const searchedField = this.fields.find(field => field.key == fieldKey)
    if(searchedField.form_control_value) {
      const searchedFieldToChange = this.fields.find(field => field.key == searchedField.form_control_value.key)
      if(event.currentTarget.value == searchedField.form_control_value.value) {
        searchedFieldToChange.display = 'block'
      } else {
        const itemField = <HTMLInputElement>document.getElementsByName(searchedFieldToChange.key)[0]
        itemField.value = this.ccompania
        searchedFieldToChange.display = 'none'
        this.setValue(itemField.value, searchedFieldToChange.binding_change_field)
      }
    }
    this.checkIfComplete()
  }
  searchOcurrences(event: any) {

    let searchvalue = event.currentTarget.value
    const searchItemsContainer = document.querySelector(`[search-id="${event.currentTarget.id}"]`)
    searchvalue = searchvalue.toLowerCase()

    if(searchItemsContainer.childNodes.length > 0) {
      var searchItems = Array.from(searchItemsContainer.childNodes)
      searchItems.forEach(item => {
        const getted = <HTMLElement> item
        if(getted.innerHTML){
          if(getted.children[0].children[0]){
            var spanText = getted.children[0].children[0].innerHTML.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            const button = <HTMLElement> getted.children[0]
            if(spanText.includes(searchvalue)) {
              if(button.getAttribute('aria-expanded') == 'true') {
                button.click()
              }
              console.log('conseguido aqui',spanText);
              getted.classList.remove('d-none')
              getted.classList.add('d-flex')
              getted.classList.add('flex-column')
            } else if(getted.children[1]) {
              let searched = false
              searchItems = Array.from(getted.children[1].children[0].childNodes)
              const searchedItems = searchItems.find(item => {
                const getted2 = <HTMLElement> item
                if(getted2.childNodes.length > 0) {
                  spanText = getted2.children[0].innerHTML.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                  if(spanText.includes(searchvalue)) {
                    console.log('conseguido aqui',spanText);
                    return item
                  }
                }
              })
              if(searchedItems) {
                if(button.getAttribute('aria-expanded') == 'false') {
                  button.click()
                }
                getted.classList.remove('d-none')
                getted.classList.add('d-flex')
                getted.classList.add('flex-column')
              }
              else {
                getted.classList.remove('d-flex')
                getted.classList.add('d-none')
              }
            } else {
              if(button.getAttribute('aria-expanded') == 'true') {
                button.click()
              }
              getted.classList.remove('d-flex')
              getted.classList.add('d-none')

            }
          }
        }
      })
    }
  }
  noSend(event: any) {
    event.preventDefault()
  }
  checkIfComplete(){
    const formIdContainer = document.forms[this.formId]
    const formData = new FormData(formIdContainer)
    for (var p of formData) {
      let name = p[0];
      let value = p[1];
      
      if(!value) {
        this.disabled = true
      } else {
        this.disabled = false

      }
    }
  }
}
