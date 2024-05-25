# Abacus

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# ABACUS TIME TRACKING


## Adding Angular Modules and Components

1. to add a new module to the project, go to the components directory in src and run the following command
-<b> ng generate module <module-name></b>
- this will create a new module directory, binding all the components within here to their module
2. add the module to the app.module.ts imports list
3. If routing exists in this module...
- ng generate module <module-name-routing> --flat --module=../../app
- this will create a module and register it in the app module (depending on how deep this module is contained, specify the path to the app module from this module in the module flag)

### Adding a Component to a Module

1. cd to that directory and run this command 
- ng generate component <component-name> --module=<module-name-in-dir>