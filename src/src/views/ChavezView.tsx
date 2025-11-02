import { React, useRef } from "react";
import Chavez from "src/assets/avatars/isaac.jpeg";
import styles from "./index.module.sass";
//
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
//

const ChavezView = () => {

  const chavezRef = useRef([]);
  const container = useRef();

  const { contextSafe } = useGSAP({ scope: container });

  const array = Array.from(Array(120).keys());

  const onMouseEnter = contextSafe((currentTarget) => {
    gsap.to(currentTarget.target, {
      scale: 2,
      filter: `invert(${100}%)`,
      zIndex: 100000000,
      duration: 0.5,
      ease: "back.out"
    });
  });

  const onMouseLeave = contextSafe((currentTarget) => {
    gsap.to(currentTarget.target, {
      scale: 1,
      filter: `invert(${0}%)`,
      clearProps:"zIndex",
      duration: 0.85,
      ease: "Power2.easeInOut"
    });
  });

  const elements = array.map((chavez, index) => {
    return (
      <img
        className={styles.chavez}
        src={Chavez}
        key={index}
        ref={(el) => (chavezRef.current[index] = el)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    )
  });

  const onClickGood = contextSafe(() => {
    const sections = chavezRef.current;
    
    //
    sections.forEach((section, index) => {
      //initSection(section, index);
      gsap.to(section, {
        alpha: 0,
        scale: Math.random() * 20,
        rotation: Math.random()*360,
        duration: 1,
        x: Math.random()*200,
        y: Math.random()*500,
        delay: Math.random()*4,
        filter: `invert(${100}%)`,
        // yoyo: true,
        // repeat: -1
      });
    });
  });

  const onClickSlide = contextSafe(() => {
    const sections = chavezRef.current;
    
    //
    sections.forEach((section, index) => {
      gsap.set(section, {zIndex: 100000-index});
      gsap.to(section, {
        duration: 1.5,
        alpha: 0,
        y: 800,
        delay: index/50,
        ease: "power3.easeInOut"
        // yoyo: true,
        // repeat: -1
      });
    });
  });

  const onClickWild = contextSafe(() => {
    const sections = chavezRef.current;
    
    //
    sections.forEach((section, index) => {
      gsap.set(section, {zIndex: 100000-index});
      gsap.to(section, {
        scale: 0.01,
        rotation: 800,
        duration: 1,
        // x: 375/2,
        // y: 350,
        delay: index/50,
        // yoyo: true,
        // repeat: -1
      });
    });
  });

  

  useGSAP(() => {
    //
    const sections = chavezRef.current;
    
    //
    sections.forEach((section, index) => {
      //initSection(section, index);
      gsap.from(section, {
        alpha: 0,
        scale: 3,
        rotation: 700,
        duration: 0.7,
        x: 300,
        y: 800,
        delay: index/100,
        filter: `invert(${Math.random()*100}%)`,
        // yoyo: true,
        // repeat: -1
      });
    });

  }, [0]);


  return (
    <div className={styles.Main} ref={container}>
      <div className={styles.chavezHolder}>
        {elements}
      </div>
      <div className={styles.buttons}>
        <div onClick={onClickGood}>1</div>
        <div onClick={onClickSlide}>2</div>
        <div onClick={onClickWild}>3</div>
      </div>
    </div>
  );
};

export default ChavezView;
