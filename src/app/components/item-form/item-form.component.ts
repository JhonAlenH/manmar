import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// import { ItemFormService } from './item-form.service';
// import {MatSnackBar} from '@angular/material/snack-bar';
// import { AuthService } from '../../auth/auth.service';
import { formatDate } from '@angular/common';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {

  @Input() dataComponent:any
  @Output() created = new EventEmitter<any>();

  mode = ''
  internMode:any = null
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
  multipleValuesFields: any = null
  searchFieldIndex:any  = 0

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
    if(this.dataComponent){
      const v = this.dataComponent
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
    } else {
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
    }

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
    })
    for (const field of await this.fields) {
      if (field.url_id){
        setTimeout(() => {
          const fieldTo = this.fields.find(item => item.key == field.url_id)
          this.setValue(field.key, fieldTo.defaultValue)

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
        //   this.openSnackBar(data['message'])
          this.loading = false
          if(this.dataComponent) {
            this.created.emit();
          }
        })
      } else if(this.mode == 'edit') {
        this.http.post(environment.apiUrl + this.editUrl, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).subscribe((data) => {
        //   this.openSnackBar(data['message'])
          this.loading = false
          
        })
      }
    })
  }
  // get info about the fields pased by routing file

  async getFieldsData() {
    this.multipleValuesFields = this.fields.filter(field => field.type == 'multiple-select')
    for(const field of this.fields) {
      // select options added
      if(field.type.includes('select')){
        if(field.url) {
          if(!field.url_id && !field.url_ids) {
            this.http.get(environment.apiUrl + field.url).subscribe(async (data:any) => {
              field.options = await data.data
              if(this.mode == 'create') {
                if(field.defaultValue != '') {
                  const selected = field.options.find(option => option.value == field.defaultValue)
                  selected.selected = true
                } else {
                  // field.options.unshift({text: 'Selecciona una opcion...', value: '', selected: true})
                }
              } else {
                // field.options.unshift({text: 'Selecciona una opcion...', value: ''})
              }
              if(this.mode == 'info') {
                if(typeof this.itemData[field.key] == 'number'){
                  const optionSelected = field.options.find(option => option.value == this.itemData[field.key])
                  if (optionSelected) {
                    field.defaultValue = this.itemData[field.key]
                    optionSelected.selected = true
                  }
                }
              }
            })
          } else {
            field.defaultValue = ''
            if(field.type == 'multiple-select'){
              field.defaultValue = this.itemData[field.key_form]
              field.addedValuesIds = this.itemData[field.added_data_key]
            } else {
              field.defaultValue = this.itemData[field.key]
            }
            if(field.type == 'auto-select') {
              field.options.unshift({text: 'Selecciona una opcion...', value: ''})
            }
          }
        } else {
          field.options = field.values
          if(this.mode == 'create') {
            if(field.defaultValue != '') {
              const selected = field.options.find(option => option.value == field.defaultValue)
              if (selected){
                selected.selected = true
              }
              // field.options.unshift({text: 'Selecciona una opcion...', value: ''})
            } else {
              // field.options.unshift({text: 'Selecciona una opcion...', value: '', selected: true})
            }
          } else {
            // field.options.unshift({text: 'Selecciona una opcion...', value: ''})
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
        if (!field.defaultValue){
          field.defaultValue = ''
        }
      }
      
    }
  }
  // change item (adde or available) to multipleSelect field
  changeItemTo(event: any, field: any, value: any) {
    const inputHidden = <HTMLInputElement> document.getElementById(event.currentTarget.getAttribute('ms-button-data-id'))
    
    const inputValue =  inputHidden.value.split(',')
    if (event.currentTarget.parentElement.classList.contains('m-s-added') || event.currentTarget.classList.contains('m-s-added')) {
      // add value to availableValues array
      const findedIndex = field.addedValues.findIndex(option => option.value == value.value)
      field.addedValues.splice(findedIndex, 1)
      let findItem:any = {}
      if(value.key){
        findItem = field.options.find(option => option.value == value.key)
        findItem.values.push(value)
      } else {
        field.options.push(value)
      }
      // delete value selected to multipleSelect input
      const index = inputValue.findIndex(valueInput => valueInput == value.value)
      inputValue.splice(index,1)
    } else {
      if(field.other_values) {
        value.other_values = [...field.other_values]
      }
      field.addedValues.push(value)
      // add value to addValues array
      let findItem:any = {}
      if(value.key) {
        findItem = field.options.find(option => option.value == value.key)
      }
      
      
      if(findItem.values) {
        const findedIndex = findItem.values.findIndex( service => service.value == value.value)
        findItem.values.splice(findedIndex, 1)
      }else {
        const findedIndex = field.options.findIndex( option => option.value == value.value)
        field.options.splice(findedIndex, 1)
      }
      // add value to multipleSelect input
      if (inputValue[0] == '') {
        inputValue.splice(0,1)
      }
      let inputValeText = ''

      if(value.key) {
        inputValeText = value.value + '?' + value.key
      } else {
        inputValeText = value.value
      }
      if(field.other_values) {
        for (const subValue of field.other_values) {
          inputValeText = inputValeText + '?' + subValue.value
        }
      }
      inputValue.push(inputValeText)
    }

    inputHidden.setAttribute('value', inputValue.join(','))
    this.checkIfComplete()
  }
  // add values to multipleselect field when the chageField is changed
  setValue(fieldBindingKey:any, value?: any) {
    const searchedField = this.fields.find(field => field.key == fieldBindingKey)
    if(searchedField.type == 'multiple-select'){
      searchedField.addedValues = []
      if(searchedField.key_form) {
        searchedField.defaultValue = this.itemData[searchedField.key_form]
      } else {
        searchedField.defaultValue = this.itemData[searchedField.key]

      }
    }
    if(searchedField.url){
      searchedField.options = []
      let extraParam = ''
      if(value) {
        extraParam = '/' + value
      } else {
        if(searchedField.url_ids) {
          for (const id of searchedField.url_ids) {
            const fieldToGet = this.fields.find(item => item.key == id)
            if(fieldToGet) {
              extraParam += '/' + fieldToGet.defaultValue
            }
          }
        } else {
          extraParam = '/' + searchedField.url_id
        }
      }
      this.http.get(environment.apiUrl + searchedField.url + extraParam).subscribe((data:any) => {
        if(!data.notFinded) {
          if (data.data.length > 0) {
            searchedField.options = data.data
            if(searchedField.type == 'select') {
              if(searchedField.defaultValue) {
                const selectedOption = searchedField.options.find(opt => opt.value == searchedField.defaultValue)
                if (selectedOption) {
                  selectedOption.selected = true
                }
              }
              // searchedField.options.unshift({text: 'Selecciona una opcion...', value: ''})
            }
            if(this.mode == 'create'){
              if(searchedField.other_values) {
                for (const field2 of searchedField.other_values) {
                  if(field2.url) {
                    field2.options = [] 
                    if(!field2.url_id) {
                      this.http.get(environment.apiUrl + field2.url, {}).subscribe((response3:any) => {
                      // this.ItemFormService.getItemInfoPost(field2.url, {}).subscribe((response3) => {
                        field2.options = response3.data
                        if(field2.value != '') {
                          const selected = field2.options.find(option => option.value == field2.value)
                          selected.selected = true
                          // field2.options.unshift({text: 'Selecciona una opcion...', value: ''})
                        } else {
                          // field2.options.unshift({text: 'Selecciona una opcion...', value: '', selected: true})
                        }
                      })
                    }
                  }
                }
              }
            }
            if(this.mode == 'info') {
              if(searchedField.options) {
                if(searchedField.type == 'multiple-select'){
                  for(let [index ,option] of searchedField.options.entries()){
                    for(let subValue of searchedField.addedValuesIds) {
                      
                      let optionFinded:any = null
                      let optionFindedIndex:any = null
                      if(searchedField.key_form) {
                        optionFinded = option.values.find( valueN => valueN.value == subValue[searchedField.key_form])
                        optionFindedIndex = option.values.findIndex( valueN => valueN.value == subValue[searchedField.key_form])
                      }
                      if(!searchedField.key_form) {
                        if(option.value == subValue[searchedField.key]) {
                          optionFinded = option
                          optionFindedIndex = index
                        }
                      }
                      if (optionFinded) {
                        if(searchedField.other_values) {                        
                          let otherValues:any = null
                          if(searchedField.key_form){
                            otherValues = this.itemData[searchedField.added_data_key].find( j => j[searchedField.key_form] == optionFinded.value)
                          } else {
                            otherValues = this.itemData[searchedField.added_data_key].find( j => j[searchedField.key] == optionFinded.value)
  
                          }
                          let y = 0
                          
                          let valuesTo:any = []
                          let newObject:any = {}
                          this.searchFieldIndex++
                          for (const other of searchedField.other_values) {
                            let findOther:any = ""
  
                            findOther = otherValues.other_values.find(valueO => valueO.key == other.key)
                            newObject = {...other, value: findOther.value}
                            valuesTo.push(newObject)
                            
                            findOther= ""
                            newObject= ""
                            y++
                          }
                              
                          optionFinded.other_values = [...valuesTo]
                        }
                        searchedField.addedValues.push(optionFinded)
                        if(option.values) {
                          option.values.splice(optionFindedIndex, 1)
                        } else {
                          searchedField.options.splice(optionFindedIndex,1)
                        }
                      }
                    }
                  }
                  for (const addedValue of searchedField.addedValues) {
                    if (addedValue.other_values) {
                      for (const other of addedValue.other_values) {
                        let otherValuesOptions:any = null
                        if(other.url){
                          this.http.get(environment.apiUrl + other.url + '/' + value, {}).subscribe((response4:any) => {
                          // this.ItemFormService.getItemInfoPost(other.url, {}).subscribe(async (response4) => {
                            otherValuesOptions = response4.data
                            // otherValuesOptions.unshift({text: 'Seleccione una Opcion...', value: ''})
                            const optionSelectedIndex = otherValuesOptions.findIndex( ittem => ittem.value == other.value)
                            otherValuesOptions[optionSelectedIndex].selected = 'true'
                            other.options = otherValuesOptions
                            
                          })
                        }
                      }
  
                    }
                  }
                }                  
              }
            }
          }
        }
        // this.openSnackBar(data.message)
        console.log(data.message)
      })
    }
    this.checkIfComplete()
  }
  // called in the front of mutiple selection
  setOtherValue(event:any, fieldBindingKeys:any) {
    for (const fieldBindingKey of fieldBindingKeys) {
      
      const field = this.fields.find(fieldT => fieldT.key == fieldBindingKey)
      if(field.change_fields) {
        for (const fieldChange of field.change_fields) {
          const gettedField = this.fields.find(fieldA => fieldA.key == fieldChange)
          if(gettedField.reverse) {
            if(field.defaultValue) {
              gettedField.display = 'none'
              gettedField.defaultValue = field.defaultValue
            } else {
              gettedField.display = 'block'
              gettedField.defaultValue = ''
            }
          } else {
            if(this.mode != 'info') {
              gettedField.defaultValue = ''
            }
            gettedField.options = []
          }
          // gettedField.options.unshift({text: 'Selecciona una opcion...', value: ''})
        }
      }
      this.setValue(fieldBindingKey)
    }
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
        this.setValue(searchedFieldToChange.binding_change_fields, itemField.value)
      }
    }
    this.checkIfComplete()
  }
  // Auto Selects
  setText(event:any, fieldKey:any, fieldBindingKeys?:any) {
    // Asignar valor al campo
    const findedItem = this.fields.find(field => field.key == fieldKey)
    findedItem.defaultValue = event.currentTarget.value
    // Actualizar otros campos cuyo valor dependen de este
    if(event.currentTarget.value && fieldBindingKeys) {
      this.setOtherValue(event, fieldBindingKeys)
    }
    // Actualizar campos que se ven afectados por un cambio de este campo
    if(findedItem.change_fields) {
      for (const field of findedItem.change_fields) {
        const gettedField = this.fields.find(fieldA => fieldA.key == field)
        if(gettedField.reverse) {
          if(event.currentTarget.value) {
            gettedField.display = 'none'
            const itemValues = findedItem.options.find((option:any) => option.value == event.currentTarget.value)
            gettedField.defaultValue = itemValues.text
          } else {
            gettedField.display = 'block'
            gettedField.defaultValue = ''
            
          }
        } else {
          gettedField.defaultValue = ''
          gettedField.options = []
          gettedField.options.push({text: 'Selecciona una opcion...', value: ''})
          if(gettedField.change_fields) {
            const eventT:any = {currentTarget: {value: ''}}
            this.setText(eventT, gettedField.key, gettedField.binding_change_fields)
          }
        }
      }
    }
    // this.checkIfComplete()
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
  setParentValue(field:any, valueId:any, indexItem:any, indexValue:any) {
    
    let valueInput: any = {}
    valueInput = <HTMLInputElement> document.getElementById(valueId)
    const inputHidden = <HTMLInputElement> document.getElementById(field.key)
    const inputValueSplit = inputHidden.value.split(',')
    
    const splitedItem = inputValueSplit[indexItem].split('?')
    if(field.key_form){
      splitedItem[indexValue+2] = valueInput.value
    } else {
      splitedItem[indexValue+1] = valueInput.value

    }
    const joined = splitedItem.join('?')
    inputValueSplit[indexItem] = joined
    const finalInputJoined = inputValueSplit.join(',')
    field.defaultValue = finalInputJoined
    inputHidden.setAttribute('value',finalInputJoined)
  }
  noSend(event: any) {
    event.preventDefault()
  }
  checkIfComplete(){
    this.disabled = false
    const formIdContainer = document.forms[this.formId]
    const formData = new FormData(formIdContainer)
    for (var p of formData) {
      let name = p[0];
      let value = p[1];
      if(name != 'cmarca' && name != 'cmodelo' && name != 'cversion'){
        if(!value) {
          this.disabled = true
        }
      }
    }
  }
}
