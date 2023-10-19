import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private sharedService: SharedService, private router: Router) { }

  canActivate(): boolean {
    if(this.sharedService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/register']);
      return false;
    }
  }

}
