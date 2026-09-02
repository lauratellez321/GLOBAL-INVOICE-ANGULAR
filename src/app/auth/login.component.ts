import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  email = "";
  password = "";
  error = "";
  submit() {
    this.auth
      .login(this.email, this.password)
      .subscribe({
        next: (result) =>
          this.router.navigateByUrl(
            result.role === "AUDITOR" ? "/dashboard" : "/invoices",
          ),
        error: () => (this.error = "Credenciales inválidas"),
      });
  }
}
