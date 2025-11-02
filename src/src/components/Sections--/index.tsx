import { React, ReactNode, useContext, useRef, forwardRef } from "react";
import styles from "./index.module.sass";
//
import Image from "src/assets/image.png";
import Image2 from "src/assets/image2.png";
import Image3 from "src/assets/image3.png";
//
import { useLayersDispatch, REMOVE_LAYER } from 'src/containers/LayersContext';
import * as Constants from 'src/data/constants';
//
import { Draggable } from 'gsap/Draggable';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
//
import TextBlock from "src/components/TextBlock";
import { SECTION, BLOCK } from "src/components/TextBlock";
import LinkBlocks from "src/components/LinkBlocks";
import RelatedArticles from "src/components/RelatedArticles";
import Divider, { DIVIDER_BETWEEN_SECTION_LARGE } from "src/components/Divider";
//
gsap.registerPlugin(Draggable);

interface ArticleData {
  pageTitle: string;
  title: string;
  image: string;
}

interface ArticleProps {
  data: ArticleData;
}

const Article = forwardRef<HTMLDivElement, ArticleProps>(({ data }, ref) => {
  const { pageTitle, title, image } = data;
  
  const linkBlockData = [
    {
      title: "Our Identity rules",
      onClick: () => {}
    },
    {
      title: "Consequences",
      onClick: () => {}
    },
    {
      title: "Our legal obligations",
      onClick: () => {}
    }
  ];

  return (
    <div ref={ref} style={{ width: '375px', height: '100%', display: 'inline-block', verticalAlign: 'top', padding: '16px' }}>
      <header style={{ marginBottom: '16px' }}>
        <h1>{title}</h1>
      </header>
      <img src={image} style={{ width: '100%', marginBottom: '16px' }} />
      <Divider size={DIVIDER_BETWEEN_SECTION_LARGE} />
      <TextBlock title="What is it?" body="A government-issued ID is an official document, like a passport or driver's license, used to verify a person's identity." size={BLOCK} />
      <LinkBlocks blocks={linkBlockData} />
      <RelatedArticles data={{
        articles: [
          { title: "Hello old chap", image: image },
          { title: "Hello old chap", image: image },
          { title: "Hello old chap", image: image }
        ]
      }} />
    </div>
  );
});

Article.displayName = 'Article';

export default function Sections() {

  const containerRef = useRef(null);
  const pickerRef = useRef(null);
  const sectionsRef = useRef([]);
  const indicatorsRef = useRef(null);
  const indicatorRef = useRef([]);

  const layersDispatch = useLayersDispatch();

  let currentIndex = 0;

  // useGSAP(() => {
  //   const draggable = Draggable.create(container.current, {
  //     type: 'x',
  //     inertia: true,
  //     bounds: {minX: -825, maxX: 125},
  //     snap: function (value) {
  //       return Math.round(value / 375) * 375;
  //     },
  //     onDrag: () => {
  //       console.log('dragging');
  //     },
  //   })[0];
  // }, []);

  // useGSAP(() => {
  //   gsap.defaults({ ease: 'none' });
  //   const picker = pickerRef.current;
  //   const sections = sectionsRef.current;
  //   const proxy = document.createElement('div');
  //   const myWrapper = gsap.utils.wrap(0, 1);

  //   const sectionWidth = 375;

  //   const totalSections = sections.length;
  //   const sectionStep = 1 / totalSections;
  //   const wrapWidth = sectionWidth * totalSections;

  //   const baseTl = gsap.timeline({ paused: true });

  //   gsap.set(picker, {
  //     width: wrapWidth - sectionWidth,
  //   });
  //   sections.forEach((section, i) => {
  //     initSection(section, i);
  //   });

  //   const animation = gsap
  //     .timeline({ repeat: -1, paused: true })
  //     .add(baseTl.tweenFromTo(1, 2));

  //   const draggable = Draggable.create(proxy, {
  //     type: 'x',
  //     trigger: picker,
  //     inertia: true,
  //     onDrag: updateProgress,
  //     onThrowUpdate: updateProgress,
  //     snap: {
  //       x: snapX,
  //     },
  //     onThrowComplete: () => {
  //       console.log('onThrowComplete');
  //       // TODO: animation that injects selected card title
  //     },
  //   })[0];

  //   function snapX(xPosition) {
  //     return Math.round(xPosition / sectionWidth) * sectionWidth;
  //   }

  //   function updateProgress() {
  //     animation.progress(myWrapper(draggable.x / wrapWidth));
  //   }

  //   animation.progress(1);

  //   function initSection(element, index) {
  //     gsap.set(element, {
  //       width: sectionWidth,
  //       scale: 1,
  //       x: -sectionWidth,
  //     });

  //     const tl = gsap
  //       .timeline({ repeat: 1 })
  //       .to(element, { duration: 1, x: `+=${wrapWidth}` }, 0)
  //       .to(
  //         element,
  //         {
  //           duration: sectionStep,
  //           color: '#009688',
  //           scale: 1,
  //           repeat: 1,
  //           yoyo: true,
  //         },
  //         0.5 - sectionStep
  //       );

  //     baseTl.add(tl, index * -sectionStep);
  //   }
  // }, []);

  const articleData = [
    {
      pageTitle: "Government ID",
      title: "We verify customer identities to prevent fraud, ensure compliance, and maintain secure transactions.", 
      image: Image
    },
    {
      pageTitle: "Money laundering",
      title: "Money laundering is the process of concealing illegal funds' origins, making them appear legitimate through complex transactions.", 
      image: Image2
    },
    {
      pageTitle: "Legal names",
      title: "We use your legal name to verify your identity, comply with regulations, prevent fraud, and ensure accurate account management.", 
      image: Image3
    }
  ];

  const articles = articleData.map((data, index)=>{
    return (
      <Article
        key={index}
        ref={(el) => (sectionsRef.current[index] = el)}
        data={data}
      >
      </Article>
    )
  });

  const indicators = articleData.map((data, index)=>{
    return (
      <li
        key={`indicator${index}`}
        className={currentIndex === index ? styles.active: ""}
        ref={(el) => (indicatorRef.current[index] = el)}
      >
      </li>
    )
  });

  useGSAP(() => {
    gsap.defaults({ ease: 'none' });
    const sections = sectionsRef.current;
    const sectionWidth = 375;
    const totalSections = articleData.length;
    const draggables = [];
    //
    sections.forEach((section, i) => {
      initSection(section, i);
    });

    gsap.set(sectionsRef.current[currentIndex], {x: 0});

    function snapX(xPosition) {
      return Math.round(xPosition / sectionWidth) * sectionWidth;
    }

    function updateProgress(event) {
      const currentX = this.x;
      const element = this.target;
      currentIndex = sectionsRef.current.indexOf(element);
      const nextIndex = currentIndex === totalSections-1 ? 0 : currentIndex+1;
      const previousIndex = currentIndex===0 ? totalSections-1 : currentIndex-1;
      const nextElement = sectionsRef.current[nextIndex];
      const previousElement = sectionsRef.current[previousIndex];
      gsap.set(nextElement, {
        x: currentX + sectionWidth
      });
      gsap.set(previousElement, {
        x: currentX - sectionWidth
      });
    }

    function initSection(element, index) {
      gsap.set(element, {
        width: sectionWidth,
        x: sectionWidth,
      });

      draggables.push(Draggable.create(element, {
        type: 'x',
        bounds: {
          minX: -sectionWidth, maxX: sectionWidth
        },
        inertia: true,
        onDrag: updateProgress,
        onThrowUpdate: updateProgress,
        snap: {
          x: snapX,
        },
        onDragStart:() => {
          //draggableY.disable();
        },
        onThrowComplete: () => {
          //console.log('onThrowComplete');
          // TODO: animation that injects selected card title
          draggableY.enable();
        },
      })[0]);
    }

    // Vertical drag

    gsap.fromTo(containerRef.current, {y: Constants.VIEW_HEIGHT}, {y: Constants.VIEW_OFFSET_TOP, ease:"power3.inOut", duration: 0.4});

    const draggableY = Draggable.create(containerRef.current, {
      type: 'y',
      inertia: true,
      bounds: {
        minY: Constants.VIEW_OFFSET_TOP, maxY: Constants.VIEW_HEIGHT
      },
      snap: {
        y: snapY,
      },
      onMove: (pointerEvent) => {
        //pointerEvent.stopPropogation();
      },
      onDrag: updateYProgress,
      onThrowUpdate: updateYProgress,
      onThrowComplete: () => {
        if(draggableY.y > Constants.VIEW_HEIGHT/2){
          layersDispatch({
            type: REMOVE_LAYER
          }); 
        }
      }
    })[0];

    function updateYProgress(event) {
      gsap.to(this.target, {
        //autoAlpha: 1 - (draggable.y / Constants.VIEW_HEIGHT),
        //filter: `blur(${draggable.y/20}px)`,
        duration: 0,
      });
      gsap.to(indicatorsRef.current, {
        y: (Constants.VIEW_OFFSET_TOP/1.5) - (draggableY.y / 1.5),
        duration: 0,
      });
    }

    function snapY(yPosition) {
      return Math.round(yPosition / Constants.VIEW_HEIGHT) * Constants.VIEW_HEIGHT;
    }
  }, []);




  return (
    <div className={styles.Main} ref={containerRef}>
      <div ref={pickerRef} className={styles.Picker}>
        {articles}
      </div>
      <ul className={styles.indicators} ref={indicatorsRef}>
        {indicators}
      </ul>
    </div>
  );
}


