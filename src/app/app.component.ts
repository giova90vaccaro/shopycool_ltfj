import { Component, Input, ViewChild } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, Validators,FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import {MatCardModule} from '@angular/material/card'; 
import {MatSelectModule} from '@angular/material/select'; 
import { ReactiveFormsModule } from '@angular/forms'; // <-- Import this
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

export interface user{
  nomeUtente:String
  password:String
}

export interface Comuni {
  comune: string;
  cap:string
  provincia:string
}

export interface cliente{
  nome:String
  DataNascita:String
  Indirizzo:String
  Comune:String
  mail:String
  mark:boolean
  privacy:boolean
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MatInputModule,MatFormFieldModule,MatCardModule,MatSelectModule,MatAutocompleteModule,ReactiveFormsModule,NgIf,CommonModule,MatButtonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'landingPage';
  emailFormControl:any
  nome:any
  cognome:any
  coideTessera!:any
  indirizzo:any
  clienti!:any
  citta:any
  cap!:any
  nascita:any
  changeCount:number
  stato=false
  body:any
  filteredOptions!: Observable<string[]>;
  sesso!:any
  showtessera=false
  checked = false;
  indeterminate = false;
  telefono:any
  checkedmarketing=false
  cilcofor!:any
  comune!:Comuni[]
  ins_comune!:any
  testComuni:string[]=[]
  showTessera=false
  Tessera!:any
  @Input() capvaloredef!:string
  @ViewChild('name') inpucod: any;
  @ViewChild('cgn') inpulotto: any;
  @ViewChild('scadenza') inpuscadenza: any;
  @ViewChild('barcode') inpuric: any;
  @ViewChild('cap') capValue:any
  @ViewChild('provincia') prvoValue:any


  stateForm: any;
  id!:any
  prefisso: FormControl<string | null>;
  //nome.value, cognome.value,emailFormControl.value, indirizzo.value, citta.value, nascita.value
  constructor(private api:HttpClient, private call:HttpClient, private route: ActivatedRoute){
    this.body = this.setUsers('dario@cvggold.com', '1CvgGold');

    this.call.post("https://cvggold-dash.ns0.it/External/BackEndControll/splio/comune/comuni.php", this.body).subscribe(
      data=>{
        let x:any
        x = data;
        this.comune = x
        this.cilcofor = this.comune.length
        for(let i=0; i<this.comune.length; i++){
          this.testComuni.push(this.comune[i].comune)
        }
      }
    )
    this.emailFormControl = new FormControl('', [Validators.required]);
    this.nome = new FormControl('', [Validators.required])
    this.ins_comune = new FormControl('', [Validators.required])
    this.cognome = new FormControl('', [Validators.required])
    this.coideTessera = new FormControl('', [Validators.required])
    this.indirizzo = new FormControl('', [Validators.required])
    this.prefisso = new FormControl('', [Validators.required])
    this.citta = new FormControl('', [Validators.required])
    this.Tessera = new FormControl('', [Validators.required])
    this.nascita = new FormControl('', [Validators.required])
    this.cap = new FormControl('', [Validators.required])
    this.telefono = new FormControl('', [Validators.required])
    this.sesso = new FormControl('', [Validators.required])
    this.changeCount=0;
  }


    onChangeEvent(event: any){
      //console.log(event.target.value);
      if(event.target.value){
        this.changeCount++
      }else{
        this.changeCount--
      }

    }
    SaveDate(){
        var getvalue = "?a="+this.nome.value+"&t="+this.telefono.value+"&b="+this.cognome.value+"&c="+this.sesso.value+"&d="+this.nascita.value+"&e="+this.indirizzo.value+"&f="+this.citta.value+"&g="+this.emailFormControl.value+"&h="+this.ins_comune.value+"&m="+this.checkedmarketing+"&p="+this.checked+"&i="+this.capValue.nativeElement.value

        console.log(getvalue)

        let newUser : cliente={
          nome: this.nome.value+"::"+this.cognome.value+"::"+this.sesso.value,
          DataNascita: this.nascita.value+"::"+this.coideTessera.value,
          Indirizzo: this.indirizzo.value+"::"+this.capValue.nativeElement.value,
          Comune: this.ins_comune.value+"::"+this.citta.value,
          mail: this.emailFormControl.value+"::"+this.prefisso.value+this.telefono.value,
          mark: this.checkedmarketing,
          privacy : this.checked
        }
        console.log(newUser)


    }

    contatore(){
      if(this.changeCount>=6)
        this.stato = true
      else
       this.stato = false
    }

    reader(event:any, ){
      for(let i=0; i<this.clienti.length; i++){
        if(event.target.value === this.clienti[i].email){
          this.coideTessera = this.clienti[i].codiceTessera
          this.nome.value = this.clienti[i].nome
          this.cognome.value = this.clienti[i].cognome
          this.indirizzo.value = this.clienti[i].indirizzo
          this.citta.value = this.clienti[i].citta
          this.changeCount = 7
        }

      }
    }
    public setUsers(a:String, b:String):any{
      let utenza:user={nomeUtente:a, password:b}
      const body = JSON.stringify(utenza);
      return body;
   }


  ngOnInit() {

    this.filteredOptions = this.citta.valueChanges.pipe(
      startWith(''),
      map((valore: any) => this._filter(String(valore))));

      this.id = this.route.snapshot.queryParamMap.get("id")

  this.route.queryParamMap.subscribe(queryParams => {
    this.id = queryParams.get("id")
    if(this.id != null){
      this.showTessera = true
    }

  })

  this.route.queryParamMap.subscribe(queryParams => {
      this.nome.value = queryParams.get("val1")
      this.cognome.value = queryParams.get("val2")
      this.emailFormControl.value = queryParams.get("val3")
  })

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let cittaaux:string[]
    cittaaux = this.testComuni.filter(option => option.toLowerCase().includes(filterValue));
    let valString:String=cittaaux.toString()
    for(let cnt = 0; cnt<this.cilcofor; cnt++){
      if(this.citta.value === this.comune[cnt].comune){
        this.capValue.nativeElement.value = this.comune[cnt].cap
        this.prvoValue.nativeElement.value = this.comune[cnt].provincia
        this.ins_comune.value = this.comune[cnt].provincia
      }


    }
    return cittaaux
  }

}