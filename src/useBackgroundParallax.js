import {useEffect,useRef} from 'react';

export default function useBackgroundParallax(speed=0.5){
  const ref=useRef(null);
  useEffect(()=>{
    const element=ref.current;
    if(!element)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const desktop=matchMedia('(min-width: 701px)');
    let frame=0;
    const update=()=>{
      frame=0;
      if(reduced.matches||!desktop.matches){element.style.setProperty('--about-parallax','0px');return;}
      const bounds=element.getBoundingClientRect();
      if(bounds.bottom<0||bounds.top>innerHeight)return;
      element.style.setProperty('--about-parallax',`${(bounds.top+bounds.height/2-innerHeight/2)*speed}px`);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',schedule);
    reduced.addEventListener('change',schedule);
    desktop.addEventListener('change',schedule);
    schedule();
    return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);reduced.removeEventListener('change',schedule);desktop.removeEventListener('change',schedule);};
  },[speed]);
  return ref;
}
