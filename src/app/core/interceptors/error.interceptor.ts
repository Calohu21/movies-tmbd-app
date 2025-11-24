import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.status === 400) {
        errorMessage = 'No se han podido cargar las películas, inténtelo de nuevo';
      }
      return errorMessage
        ? throwError(() => new Error(errorMessage))
        : throwError(() => error.error.message || 'Error en la solicitud');
    }),
  );
};
