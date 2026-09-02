import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { BaseChartDirective } from "ng2-charts";
import type { ChartConfiguration } from "chart.js";
import { io, Socket } from "socket.io-client";
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
  private readonly socket: Socket = io("http://localhost:3000");
  rows: DashboardTotal[] = [];
  labels: Record<string, string> = {};
  data: ChartConfiguration<"bar">["data"] = {
    labels: [],
    datasets: [
      { data: [], label: "Total facturado", backgroundColor: "#1667c7" },
    ],
  };
  ngOnInit() {
    this.http
      .get<{ code: string; name: string }[]>(`${API}/invoice-types`)
      .subscribe((types) => {
        this.labels = Object.fromEntries(
          types.map((type) => [type.code, type.name]),
        );
        this.load();
      });
    this.socket.on("invoice-created", () => this.load());
  }
  ngOnDestroy() {
    this.socket.disconnect();
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
            backgroundColor: "#1667c7",
          },
        ],
      };
    });
  }
}
