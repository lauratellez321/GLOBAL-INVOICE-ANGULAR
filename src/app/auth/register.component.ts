import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../auth.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  email = "";
  password = "";
  confirmation = "";
  role: "OPERATOR" | "AUDITOR" = "OPERATOR";
  error = "";
  loading = false;

  submit() {
    this.error = "";
    if (this.password !== this.confirmation) {
      this.error = "Las contraseñas no coinciden";
      return;
    }
    this.loading = true;
    this.auth.register(this.email, this.password, this.role).subscribe({
      next: async () => {
        await Swal.fire({
          icon: "success",
          title: "Cuenta creada",
          text: "Ya puedes iniciar sesión con tus credenciales.",
          confirmButtonColor: "#b31722",
        });
        this.router.navigateByUrl("/login");
      },
      error: (response) => {
        this.loading = false;
        this.error = response.error?.message || "No fue posible crear la cuenta";
      },
    });
  }
}
