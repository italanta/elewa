import { Component }    from "@angular/core";
import { FormGroup,FormControl, FormBuilder, Validators } from '@angular/forms';

import { User }                from '@iote/bricks';
import { Logger, EventLogger } from '@iote/bricks-angular';
import { AuthService }         from '@ngfi/angular';
import { TranslateService } from '@ngfi/multi-lang';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
})
export class RegisterComponent
{
  registerForm: FormGroup;
  checkForm: FormGroup;
  confirmPassword: string;
  phoneFormat: string;
  lang : 'fr' | 'en' | 'nl';
  isLoading = false;
  isValid: boolean;
  passwordVisible = false;
  cPasswordVisible = false;

  constructor(private _fb: FormBuilder,
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _analytics: EventLogger,
              private _logger: Logger)
  {
    this._initForm();
    this.lang = this._translateService.initialise();
  }

  private _initForm()
  {
    this.registerForm = this._fb.group({
      name:[{value: '', disabled: false}, Validators.required],
      email:[{value: '', disabled: false}, [Validators.required,Validators.email]],
      password:[{value: '', disabled: false}, Validators.required],
      confirmPassword:[{value: '', disabled: false}, Validators.required],
      acceptConditions: [ false, [Validators.required]]

    },
    { validator: this._mustMatch('password', 'confirmPassword') });

  }



  doRegister(event: any){

    if(this.registerForm.valid)
    {
      this.isLoading = true;

      const frm = this.registerForm.value;
      const name = frm.name;

      this.registerForm.disable()

      const user  = {
        email: frm.email,

        profile: {
          email: frm.email,
          phone: '',
          buildings: {}
        },

        displayName: `${name}`,
        roles: {
          access: true,
          active: true
        }
      };

      this._authService.createUserWithEmailAndPassword(
                 `${name}`,
                  user.email,
                  frm.password,
                  user.profile,
                  user.roles
                )
            .then(value => this._analytics.logEvent('register', {"userId": (value as User).id}))
            .catch(error => this._analytics.logEvent('register_error', { "errorMsg": error}))
    }
  }

  countryChanged($event: any)
  {
    const splitPlaceholder = ($event.placeHolder).split($event.dialCode);
    this.phoneFormat = `${splitPlaceholder[0]}${$event.dialCode}   ${splitPlaceholder[1]}`;
  }

  private _mustMatch(controlName: string, matchingControlName: string)
  {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.cPasswordVisible = !this.cPasswordVisible;
  }

  formIsInvalid()
  {
    this.registerForm.invalid || !this.registerForm.value.acceptConditions;
  }

  loginGoogle() {
    return this._authService.loadGoogleLogin();
  }

  /** Facebook Login */
  loginFacebook() {
    return this._authService.loadFacebookLogin();
  }

  /** Microsoft Login */
  loginMicrosoft() {
    return this._authService.loadMicrosoftLogin();
  }

  setLang(lang: 'en' | 'fr')
  {
    this._translateService.setLang(lang);
  }

  getTermsLink()
  {
    return '';
  }

  getPolicyLink()
  {
    return '';
  }

}
