import { React, useRef, useEffect } from "react";
import * as Colors from "src/data/colors";
import styles from "./index.module.sass";
//
type Props = {
  progress: Number,
  image?: String
};

const Sparkline = (({ progress, image }: Props) => {

  

  const canvasRef = useRef(null);
  const dpi = window.devicePixelRatio;

  const lw = 3;
  const totalWidth: number = 96;
  const totalHeight: number = 48;
  const points: array = [];
  const totalPoints: number = 40;
  let i: number = 0;
  let start: number = Math.random()*20;

  while(i < totalPoints){
    //points.push(Math.random()*totalHeight-lw);
    const point = Math.min(Math.max(start + ((Math.random()*10)-5), lw), totalHeight-lw);

    points.push(point);
    start = point;
    i++;
  }  

  useEffect(()=>{

    const line = Colors.GetColor(Colors.COLOR_LOGO_BRAND);

    const canvas = canvasRef.current;
    fix_dpi(canvas);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = lw * dpi;
    ctx.lineJoin = "round";
    ctx.strokeStyle = line;
    ctx.beginPath();
    for(let i:number = 0; i<totalPoints; i++){
      const xPos = lw + ((totalWidth/totalPoints) * i) * dpi;
      const yPos = lw + points[i] * dpi
      ctx.lineTo(xPos, yPos);
    }
    ctx.stroke();

  });

  function fix_dpi(canvas) {
    let style = {
      height() {
        return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
      },
      width() {
        return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
      }
    }
    canvas.setAttribute('width', style.width() * dpi);
    canvas.setAttribute('height', style.height() * dpi);
  }
  

  return (
    <div className={styles.Main}>
      <canvas ref={canvasRef} width={totalWidth} height={totalHeight} />
    </div>
  );
});

export default Sparkline;
