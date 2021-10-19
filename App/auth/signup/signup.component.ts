import { Component, OnDestroy, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isloading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getOnStatusListener().subscribe(
      authStatus => {
        this.isloading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isloading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
