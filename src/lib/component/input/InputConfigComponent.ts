import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
} from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { uuidv4 } from '../../decorator/validator/BaseValidatorDecorator';
import { InputType } from '../../types/input-types';
import { messages } from '../../constants/messages';

const defaultErrorMessage: { [key: string]: string } = {
  matDatepickerParse: messages.invalidDateFormat,
};

export function shouldDisplayErrors(
  control: FormControl | null,
  form: FormGroupDirective | NgForm | null
): boolean {
  const isSubmitted = form && form.submitted;
  return !!(
    control &&
    control.invalid &&
    (control.dirty || control.touched || isSubmitted)
  );
}

@Component({ template: '' })
export default class InputConfigComponent implements ControlValueAccessor {
  @Output('onChange') inputChangeEmitter = new EventEmitter();
  @Input('type') _inputType!: InputType;
  @Input('props') _props: any = {};
  @Input('name') set name(name: string | undefined) {
    this._propertyName = name || '';
    this.updateValidators();
  }
  @Input('validators') set validators(validators: ValidatorFn[] | undefined) {
    this._validators = validators || [];
    this.updateValidators();
  }

  private _validators: ValidatorFn[] = [];
  private _form: FormGroup;
  private _autoGeneratedUUID: string;
  private _propertyName!: string;
  private _defaultProps0: any = {
    width: '100%',
    appearance: 'outline',
  };

  constructor(private _formGroupDirective: FormGroupDirective) {
    this._autoGeneratedUUID = uuidv4();
    this._form = !!this._formGroupDirective
      ? this._formGroupDirective.form
      : new FormGroup({
          [this._autoGeneratedUUID]: new FormControl(),
        });
  }

  get inputType(): InputType {
    return this._inputType;
  }

  get props(): any {
    let propsCopy = { ...this._props };
    for (let key of Object.keys(this._defaultProps0)) {
      let value = propsCopy[key];
      if (value === undefined && !(key in this.defaultProps)) {
        propsCopy[key] = this._defaultProps0[key];
      }
    }
    for (let key of Object.keys(this.defaultProps)) {
      let value = propsCopy[key];
      if (key in this._defaultProps0 || value === undefined) {
        propsCopy[key] = this.defaultProps[key];
      }
    }
    return propsCopy;
  }

  get defaultProps(): any {
    return {};
  }

  get propertyName(): string {
    return !!this._formGroupDirective
      ? this._propertyName
      : this._autoGeneratedUUID;
  }

  get validators(): ValidatorFn[] {
    return this._validators;
  }

  get form(): FormGroup {
    return this._form;
  }

  get control(): FormControl {
    return this.form.get(this.propertyName) as FormControl;
  }

  get value(): any {
    return this.control.value;
  }

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  get errors(): string[] {
    let errorMap = this.getErrorMap();
    for (let errorKey of Object.keys(errorMap)) {
      if (errorKey in defaultErrorMessage) {
        errorMap[errorKey] = defaultErrorMessage[errorKey];
      }
    }
    return Object.values(errorMap);
  }

  get shouldDisplayErrors(): boolean {
    return (
      !this._formGroupDirective ||
      shouldDisplayErrors(this.control, this._formGroupDirective)
    );
  }

  onDefaultInput() {
    this.inputChangeEmitter.next(this.value);
  }

  writeValue(value: any) {
    let config = {} as any;
    config[this.propertyName] = value;
    this.form.patchValue(config);
  }

  registerOnChange() {}

  registerOnTouched() {}

  private getErrorMap(): any {
    return this.control?.errors || {};
  }

  private updateValidators(): void {
    if (Array.isArray(this._validators) && this._validators.length > 0) {
      this.control?.setValidators(this._validators);
      this.control?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }
}