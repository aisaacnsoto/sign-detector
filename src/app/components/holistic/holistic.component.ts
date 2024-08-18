import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks, lerp } from '@mediapipe/drawing_utils';
import { FACEMESH_FACE_OVAL, FACEMESH_LEFT_EYE, FACEMESH_LEFT_EYEBROW, FACEMESH_LIPS, FACEMESH_RIGHT_EYE, FACEMESH_RIGHT_EYEBROW, FACEMESH_TESSELATION, HAND_CONNECTIONS, Holistic, POSE_CONNECTIONS, POSE_LANDMARKS, POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT } from '@mediapipe/holistic';

@Component({
  selector: 'app-holistic',
  templateUrl: './holistic.component.html',
  styleUrls: ['./holistic.component.css']
})
export class HolisticComponent implements OnInit, AfterViewInit {

  @ViewChild('webcam') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('output_canvas') canvasEl: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const holistic = new Holistic({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    holistic.onResults(this.onResults);

    const camera = new Camera(this.videoEl.nativeElement, {
      onFrame: async () => {
        await holistic.send({image: this.videoEl.nativeElement});
      },
      width: 1280,
      height: 720
    });
    camera.start();
  }

  ngOnInit(): void {

  }

  connect(ctx, connectors) {
    const canvas = ctx.canvas;
    for (const connector of connectors) {
        const from = connector[0];
        const to = connector[1];
        if (from && to) {
            if (from.visibility && to.visibility &&
                (from.visibility < 0.1 || to.visibility < 0.1)) {
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
            ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
            ctx.stroke();
        }
    }
}

  onResults = (results) => {
    // let canvasCtx = this.canvasEl.nativeElement.getContext('2d');
    const canvasElement: any = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');
    canvasElement.width = this.videoEl.nativeElement.videoWidth;
    canvasElement.height = this.videoEl.nativeElement.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);
    /*canvasCtx.drawImage(results.segmentationMask, 0, 0,
                        this.canvasEl.nativeElement.width, this.canvasEl.nativeElement.height);*/

    // Connect elbows to hands. Do this first so that the other graphics will draw
    // on top of these marks.
    canvasCtx.lineWidth = 5;
    if (results.poseLandmarks) {
        if (results.rightHandLandmarks) {
            canvasCtx.strokeStyle = 'white';
            this.connect(canvasCtx, [[
                    results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
                    results.rightHandLandmarks[0]
                ]]);
        }
        if (results.leftHandLandmarks) {
            canvasCtx.strokeStyle = 'white';
            this.connect(canvasCtx, [[
                    results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
                    results.leftHandLandmarks[0]
                ]]);
        }
    }
    // Pose...
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: 'white' });
    drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_LEFT)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' });
    drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_RIGHT)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
    // Hands...
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: 'white',
        fillColor: 'rgb(0,217,231)',
        lineWidth: 2,
        radius: (data) => {
            return lerp(data.from.z, -0.15, .1, 10, 1);
        }
    });
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: 'white',
        fillColor: 'rgb(255,138,0)',
        lineWidth: 2,
        radius: (data) => {
            return lerp(data.from.z, -0.15, .1, 10, 1);
        }
    });
    // Face...
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, { color: 'rgb(0,217,231)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, { color: 'rgb(0,217,231)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, { color: 'rgb(255,138,0)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, { color: 'rgb(255,138,0)' });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0', lineWidth: 5 });
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, { color: '#E0E0E0', lineWidth: 5 });
    canvasCtx.restore();
  }
}
