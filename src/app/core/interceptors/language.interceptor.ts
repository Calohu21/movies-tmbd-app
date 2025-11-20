import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.apiUrl) && !req.url.includes('/videos')) {
    const modifiedReq = req.clone({
      setParams: {
        language: 'es-ES',
        region: 'ES',
      },
    });

    return next(modifiedReq);
  }
  return next(req);
};
