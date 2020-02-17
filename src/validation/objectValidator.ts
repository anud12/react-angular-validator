import {AbstractControl, ValidatorFn} from "@angular/forms";

type ValidationEntry = {
    validatorFn: ValidatorFn,
    errorMessage: string
}
type ValidationMap<T> = {
    [P in keyof T]?: ValidationEntry
}

export type ValidatorResult<T> = ValidatorKey<T> & {
    isValid: boolean
}

type ValidatorKey<T> = {
    [P in keyof T]?: ValidatorKey<T[P]>
} & {
    _error?: Array<string>
}

export class ObjectValidator<T> {

    validators: ValidationMap<T> = {};

    addValidator(field: keyof T,
                 validatorFn: ValidatorFn,
                 errorMessage: string): ObjectValidator<T> {
        this.validators[field] = {
            validatorFn,
            errorMessage
        };
        return this;
    }

    validateField(key: keyof T, value?: any): ValidatorResult<{}> {
        const object = this.validators[key];
        if (!object || !object.validatorFn({value} as AbstractControl)) {
            return {
                isValid: true
            };
        }
        return {
            isValid: false,
            _error: [object.errorMessage]
        }
    }

    validate(target: Partial<T>): ValidatorResult<T> {
        const validationResult: ValidatorResult<T> = {
            isValid: true
        };

        Object.keys(this.validators)
            .forEach((entry) => {
                const key = entry as keyof T;
                const result = this.validateField(key, target[key]);
                if (!result.isValid) {
                    validationResult.isValid = false;
                    // @ts-ignore
                    validationResult[key] = {
                        _error: [...validationResult[key] || [], result._error]
                    }
                }

            });
        return validationResult;
    }
}