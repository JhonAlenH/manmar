import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-presupuesto-mant',
  templateUrl: './presupuesto-mant.component.html',
  styleUrls: ['./presupuesto-mant.component.scss']
})
export class PresupuestoMantComponent implements OnInit {
  itemId:any = ''


  constructor(private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.url.subscribe( v => {
      this.itemId = v[2].path
      console.log(v)
    });

  }

}
