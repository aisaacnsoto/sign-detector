import { Injectable } from '@angular/core';
import * as gifshot from 'gifshot';

@Injectable({
  providedIn: 'root'
})
export class GifGeneratorService {

  constructor() { }

  generateGif(imageBase64Array: string[]): Promise<string> {
    return new Promise((resolve) => {
      gifshot.createGIF({
        'gifWidth': 200,
        'gifHeight': 200,
        'images': imageBase64Array
      },(obj) => {
        if(!obj.error) {
          resolve(obj.image);
        } else {
          resolve('');
        }
      });
    });
  }

  private getWorkerURL() {
    const protocol = window.location.protocol; // 'http:' o 'https:'
    const domain = window.location.hostname; // 'example.com'
    const port = window.location.port; // '8080' si existe, de lo contrario estará vacío

    // Construir la URL base
    let baseUrl = `${protocol}//${domain}`;
    if (port) {
      baseUrl += `:${port}`;
    }

    return `${baseUrl}/assets/gif.worker.js`;
  }
}
