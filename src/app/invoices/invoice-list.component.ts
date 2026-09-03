import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { API, AuthService } from "../auth.service";
import type { Invoice } from "./invoice.model";
import Swal from "sweetalert2";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.css"],
})
export class InvoiceListComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  invoices: Invoice[] = [];
  labels: Record<string, string> = {};
  editingId: number | null = null;
  error = "";
  readonly editForm = this.fb.nonNullable.group({
    type: "",
    subtotal: [0, [Validators.required, Validators.min(0.01)]],
    customsCode: "",
  });
  ngOnInit() {
    this.http
      .get<{ code: string; name: string }[]>(`${API}/invoice-types`)
      .subscribe(
        (types) =>
          (this.labels = Object.fromEntries(
            types.map((type) => [type.code, type.name]),
          )),
      );
    this.http.get<Invoice[]>(`${API}/invoices`).subscribe((invoices) => {
      this.invoices = invoices;
    });
  }
  edit(invoice: Invoice) {
    this.editingId = invoice.id;
    this.editForm.setValue({
      type: invoice.type,
      subtotal: invoice.subtotal,
      customsCode: invoice.customsCode ?? "",
    });
  }
  cancel() {
    this.editingId = null;
  }
  save(id: number) {
    const value = this.editForm.getRawValue();
    const body =
      value.type === "EXPORT"
        ? value
        : { type: value.type, subtotal: value.subtotal };
    this.http.put<Invoice>(`${API}/invoices/${id}`, body).subscribe({
      next: (invoice) => {
        this.invoices = this.invoices.map((item) =>
          item.id === id
            ? { ...invoice, totalInWords: item.totalInWords }
            : item,
        );
        this.cancel();
        Swal.fire({
          icon: "success",
          title: "Factura actualizada",
          timer: 1600,
          showConfirmButton: false,
        });
      },
      error: (r) =>
        Swal.fire({
          icon: "error",
          title: "No fue posible guardar",
          text: r.error.message,
        }),
    });
  }
  async remove(invoice: Invoice) {
    const result = await Swal.fire({
      title: "¿Eliminar factura?",
      text: `La factura #${invoice.id} no se podrá recuperar.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c91522",
    });
    if (result.isConfirmed)
      this.http.delete(`${API}/invoices/${invoice.id}`).subscribe({
        next: () => {
          this.invoices = this.invoices.filter(
            (item) => item.id !== invoice.id,
          );
          Swal.fire({
            icon: "success",
            title: "Factura eliminada",
            timer: 1600,
            showConfirmButton: false,
          });
        },
        error: () =>
          Swal.fire({
            icon: "error",
            title: "No fue posible eliminar la factura",
          }),
      });
  }
}
