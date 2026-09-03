import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideRouter, Routes } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { LoginComponent } from "./app/auth/login.component";
import { RegisterComponent } from "./app/auth/register.component";
import { InvoiceFormComponent } from "./app/invoices/invoice-form.component";
import { InvoiceListComponent } from "./app/invoices/invoice-list.component";
import { DashboardComponent } from "./app/dashboard/dashboard.component";
import { authGuard, authInterceptor } from "./app/auth.service";
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "invoices",
    component: InvoiceListComponent,
    canActivate: [authGuard],
  },
  {
    path: "new-invoice",
    component: InvoiceFormComponent,
    canActivate: [authGuard],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: "", pathMatch: "full", redirectTo: "invoices" },
];
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCharts(withDefaultRegisterables()),
  ],
}).catch(console.error);
