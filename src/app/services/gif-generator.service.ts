import { Injectable } from '@angular/core';
import GIF from 'gif.js';

@Injectable({
  providedIn: 'root'
})
export class GifGeneratorService {

  constructor() { }

  generateGif(imageBase64Array: string[]): Promise<string> {
    return new Promise((resolve) => {
      let gif = new GIF({
        workers: 2,
        workerScript: this.getWorkerURL(),
        quality: 10
      });

      imageBase64Array.forEach(imageBase64 => {
        let img = new Image();
        img.src = imageBase64;
        gif.addFrame(img, {delay: 10});
      });

      gif.on('finished', (blob) => {
        let url = URL.createObjectURL(blob);
        resolve(url);
      });

      gif.on('abort', () => {
        resolve('abort gif.js');
      });

      gif.render();
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
