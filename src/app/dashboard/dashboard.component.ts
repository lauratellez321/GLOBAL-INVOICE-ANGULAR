import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { BaseChartDirective } from "ng2-charts";
import type { ChartConfiguration } from "chart.js";
import { Subscription, timer } from "rxjs";
import { API } from "../auth.service";

interface DashboardTotal {
  type: string;
  total: number;
}
@Component({
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private refreshSubscription?: Subscription;
  rows: DashboardTotal[] = [];
  labels: Record<string, string> = {};
  data: ChartConfiguration<"bar">["data"] = {
    labels: [],
    datasets: [
      { data: [], label: "Total facturado", backgroundColor: "#e99595" },
    ],
  };
  ngOnInit() {
    this.http
      .get<{ code: string; name: string }[]>(`${API}/invoice-types`)
      .subscribe((types) => {
        this.labels = Object.fromEntries(
          types.map((type) => [type.code, type.name]),
        );
        // Las Functions de Vercel no alojan un servidor Socket.IO persistente.
        // Se actualiza automáticamente sin abrir una conexión WebSocket.
        this.refreshSubscription = timer(0, 15_000).subscribe(() => this.load());
      });
  }
  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }
  private load() {
    this.http.get<DashboardTotal[]>(`${API}/dashboard`).subscribe((rows) => {
      this.rows = rows;
      this.data = {
        labels: rows.map((row) => this.labels[row.type] || row.type),
        datasets: [
          {
            data: rows.map((row) => row.total),
            label: "Total facturado",
            backgroundColor: "#e99595",
          },
        ],
      };
    });
  }
}
