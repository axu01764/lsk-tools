import React, {useEffect, useRef, useState} from 'react';
import site from './site-config.json';

// Three copies allow either direction to wrap without a visible jump.
export default function SlidingRail({items, render, className='', label, arrows=false, breakpoint=700, navigationLabel, cycle=false, slidesToShow=2, responsive, initialIndex=0, pausedOverride=false, verticalNavigation=false, initialPaused=false, onPauseChange}) {
  const count = items.length;
  const getVisible = () => responsive
    ? ([...responsive].sort((a,b)=>a.breakpoint-b.breakpoint).find(rule=>matchMedia(`(max-width: ${rule.breakpoint-1}px)`).matches)?.slidesToShow ?? slidesToShow)
    : (matchMedia(`(max-width: ${breakpoint-1}px)`).matches ? 1 : slidesToShow);
  const [visible, setVisible] = useState(getVisible);
  const [position, setPosition] = useState(count+initialIndex);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(initialPaused);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const navigation = useRef(null);
  const navigationButtons = useRef([]);
  const busy = useRef(false), timer = useRef(), touch = useRef(null);
  const loop = count > visible || (cycle && count > 1);
  const activeIndex = count ? ((position % count) + count) % count : 0;
  const settle = () => {
    clearTimeout(timer.current);
    setMoving(false);
    setPosition(value => count ? count + ((value % count) + count) % count : 0);
    busy.current = false;
  };
  const move = direction => {
    if (!loop || busy.current || !direction) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {setPosition(value => count + ((value + direction) % count + count) % count); return;}
    busy.current = true;
    setMoving(true);
    setPosition(value => value + direction);
    timer.current = setTimeout(settle, site.motion.transitionMs + 80);
  };
  useEffect(() => {
    const media = (responsive || [{breakpoint}]).map(rule=>matchMedia(`(max-width: ${rule.breakpoint-1}px)`));
    const update = () => {settle();setVisible(getVisible());};
    update();
    media.forEach(query=>query.addEventListener('change',update));
    return () => media.forEach(query=>query.removeEventListener('change',update));
  }, [breakpoint,slidesToShow,responsive]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {setReduced(media.matches);if(media.matches)settle();};
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const button = navigationButtons.current[activeIndex], container = navigation.current;
    if (button && container) container.scrollTo(verticalNavigation?{top:button.offsetTop-container.offsetTop-(container.clientHeight-button.clientHeight)/2,behavior:reduced?'instant':'smooth'}:{left:button.offsetLeft-container.offsetLeft-(container.clientWidth-button.clientWidth)/2,behavior:reduced?'instant':'smooth'});
  },[activeIndex,visible,reduced,verticalNavigation]);
  useEffect(() => {
    if (!loop || paused || pausedOverride || reduced) return;
    const interval = setInterval(() => move(1), site.motion.autoplayMs);
    return () => clearInterval(interval);
  }, [loop, count, paused,pausedOverride,reduced]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copies = loop ? [...items,...items,...items] : items;
  return <section className={'sliding-rail '+className} aria-label={label} tabIndex={0}
    onKeyDown={event => {if(event.key === 'ArrowLeft' || event.key === 'ArrowRight'){event.preventDefault();move(event.key === 'ArrowLeft' ? -1 : 1);}}}
    onTouchStart={event => {touch.current = event.touches.length===1 ? [event.touches[0].clientX,event.touches[0].clientY] : null;}}
    onTouchCancel={()=>{touch.current=null;}}
    onTouchEnd={event => {if(!touch.current)return;const dx=event.changedTouches[0].clientX-touch.current[0],dy=event.changedTouches[0].clientY-touch.current[1];if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);touch.current=null;}}>
    {arrows && loop && <button className="round prev" aria-label={'Previous '+label} onClick={() => move(-1)}><img src="/design/images/banner-btn-l.png" alt=""/></button>}
    <div className="rail-viewport"><div className={'rail-track '+(moving?'is-moving':'')} style={{transform:`translateX(-${loop ? position*100/visible : 0}%)`}} onTransitionEnd={event => {if(event.target===event.currentTarget && event.propertyName==='transform')settle();}}>
      {copies.map((item,index) => {const active = !loop || (index>=position && index<position+visible);return <div style={{flexBasis:`${100/visible}%`}} className={'rail-slide '+(active?'is-active':'')} key={index} aria-hidden={!active} inert={!active}>{render(item,active)}</div>;})}
    </div></div>
    {arrows && loop && <button className="round next" aria-label={'Next '+label} onClick={() => move(1)}><img src="/design/images/banner-btn-r.png" alt=""/></button>}
    {navigationLabel && <div className="rail-navigation" ref={navigation} aria-label={label+' navigation'}>{items.map((item,index) => <button key={index} ref={element => {navigationButtons.current[index]=element;}} aria-pressed={index===activeIndex} onClick={() => move(index-activeIndex)}><span aria-hidden="true"/>{navigationLabel(item)}</button>)}</div>}
    {loop && <button className="rail-pause" aria-label={(paused?'Resume ':'Pause ')+label} aria-pressed={paused} onClick={() => {settle();setPaused(!paused);onPauseChange?.(!paused);}}>{paused?'Play slideshow':'Pause slideshow'}</button>}
  </section>;
}
