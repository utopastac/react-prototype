import React, { useRef, useEffect } from "react";
import * as Colors from "src/data/colors";
import styles from "./index.module.sass";

export interface CircularProgressProps {
  progress: number;
  image?: string;
}

const CircularProgress = ({ progress, image }: CircularProgressProps) => {
  

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dpi = window.devicePixelRatio;

  const lw = 4;
  const radius = 30;
  const circle = (radius * dpi) - lw;
  const start = radius * dpi;
  const angle = progress * (Math.PI*2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const track = Colors.GetColor(Colors.COLOR_BORDER_SUBTLE);
    const arc = Colors.GetColor(Colors.COLOR_LOGO_BRAND);

    fix_dpi(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = lw * dpi;
    ctx.strokeStyle = track;
    ctx.beginPath();
    ctx.arc(start, start, circle, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = lw * dpi;
    ctx.strokeStyle = arc;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.arc(start, start, circle, -Math.PI/2, angle -Math.PI/2);
    ctx.stroke();
  });

  function fix_dpi(canvas: HTMLCanvasElement): void {
    const style = {
      height() {
        return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
      },
      width() {
        return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
      }
    };
    canvas.setAttribute('width', String(style.width() * dpi));
    canvas.setAttribute('height', String(style.height() * dpi));
  }

  return (
    <div className={styles.Main}>
      <canvas ref={canvasRef} width={60} height={60} />
      {/* <div className={styles.progress}></div> */}
      { image &&
        <img src={image} alt="Progress indicator" />
      }
    </div>
  );
};

export default CircularProgress;
