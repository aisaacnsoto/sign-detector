import { Injectable } from '@angular/core';
import * as gifshot from 'gifshot';

@Injectable({
  providedIn: 'root'
})
export class GifGeneratorService {

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

}
