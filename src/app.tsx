import * as React from "react";
import {Component, Fragment} from "react";
import {Validators} from "@angular/forms";
import {ObjectValidator, ValidatorResult} from "./validation/objectValidator";
import jsonwebtoken from "jsonwebtoken";
type State = {
    form: Partial<Person>,
    errors: ValidatorResult<Person>
    jwt?: string
    jwtResult?: string
}

type Person = {
    name: string,
    lastName: string,
}

export class App extends Component<{}, State> {

    state: State = {
        form: {},
        errors: {
            isValid: false
        }
    }

    validator = new ObjectValidator<Person>()
        .addValidator("name", Validators.required, "Required")
        .addValidator("lastName", Validators.required, "Required");

    onChange = (name: keyof Person) => (event: any) => {
        const value = event.target.value;
        this.setState(p => {
            const validationResult = this.validator.validateField(name, value);
            return {
                form: {
                    ...p.form,
                    [name]: value
                },
                errors: {
                    ...p.errors,
                    [name]: {
                        _error: validationResult._error
                    }
                }
            }
        })
    }

    render = () =>
        <Fragment>
            <input value={this.state.form.name || ""}
                   onChange={this.onChange("name")}/>
            <div>
                {this.state.errors?.name?._error}
            </div>
            <input value={this.state.form.lastName || ""}
                   onChange={this.onChange("lastName")}/>
            <div>
                {this.state.errors?.lastName?._error}
            </div>
            <pre>{JSON.stringify(this.state, null, 2)}</pre>


            <hr/>
            <div>Jwt decoder</div>
            <textarea cols={60} rows={5} onChange={event1 => {
                const value = event1.target.value;
                var decoded = jsonwebtoken.decode(value);
                this.setState({jwt: value, jwtResult: JSON.stringify(decoded, null, 2)})
            }} value={this.state.jwt}/>
            <pre>{this.state.jwtResult}</pre>
        </Fragment>

}