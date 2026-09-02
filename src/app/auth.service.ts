import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpInterceptorFn } from "@angular/common/http";
import { Router, CanActivateFn } from "@angular/router";
import { tap } from "rxjs";
const API = "http://localhost:3000/api";
@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  role = localStorage.getItem("role");
  login(email: string, password: string) {
    return this.http
      .post<{
        token: string;
        role: string;
      }>(`${API}/auth/login`, { email, password })
      .pipe(
        tap((r) => {
          localStorage.setItem("token", r.token);
          localStorage.setItem("role", r.role);
          this.role = r.role;
        }),
      );
  }
  logout() {
    localStorage.clear();
    this.role = null;
    this.router.navigateByUrl("/login");
  }
}
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  return next(
    token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req,
  );
};
export const authGuard: CanActivateFn = () =>
  inject(AuthService).role ? true : inject(Router).createUrlTree(["/login"]);
export { API };
