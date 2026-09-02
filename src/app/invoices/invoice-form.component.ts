import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { API } from "../auth.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./invoice-form.component.html",
  styleUrls: ["./invoice-form.component.css"],
})
export class InvoiceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  error = "";
  readonly form = this.fb.nonNullable.group({
    type: "NATIONAL",
    subtotal: [0, [Validators.required, Validators.min(0.01)]],
    customsCode: "",
  });
  types:{code:string}[]=[];
  readonly typeForm=this.fb.nonNullable.group({code:"",vatRate:[0,[Validators.min(0),Validators.max(100)]],withholdingRate:[0,[Validators.min(0),Validators.max(100)]]});
  ngOnInit(){this.http.get<{code:string}[]>(`${API}/invoice-types`).subscribe(types=>this.types=types);}
  save() {
    const { type, subtotal, customsCode } = this.form.getRawValue();
    const body =
      type === "EXPORT" ? { type, subtotal, customsCode } : { type, subtotal };
    this.http
      .post(`${API}/invoices`, body)
      .subscribe({
        next: () => this.router.navigateByUrl("/invoices"),
        error: (response) => (this.error = response.error.message),
      });
  }
  addType(){const value=this.typeForm.getRawValue();this.http.post<{code:string}>(`${API}/invoice-types`,{code:value.code.toUpperCase(),vatRate:value.vatRate/100,withholdingRate:value.withholdingRate/100}).subscribe({next:type=>{this.types=[...this.types,type];this.form.controls.type.setValue(type.code);this.typeForm.reset({code:"",vatRate:0,withholdingRate:0});},error:response=>this.error=response.error.message});}
}
