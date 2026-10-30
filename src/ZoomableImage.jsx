import React, {useRef,useState} from 'react';

// Key this component by the image source so navigation always starts fitted.
export default function ZoomableImage({src,alt}) {
  const [zoom,setZoom]=useState(false);
  const viewport=useRef(null);
  function toggle(){
    setZoom(value=>!value);
    if(viewport.current) viewport.current.scrollTo({top:0,left:0,behavior:'instant'});
  }
  return <div className="image-viewer">
    <div className="image-viewer-tools"><button type="button" aria-pressed={zoom} onClick={toggle}>{zoom?'Fit image':'Zoom in'}</button><span aria-live="polite">{zoom?'2× view — scroll to inspect':'Fit to window'}</span></div>
    <div className={'image-viewer-viewport'+(zoom?' is-zoomed':'')} ref={viewport} tabIndex={0} role="region" aria-label={alt+' image viewer'} onDoubleClick={toggle} onKeyDown={event=>{if(zoom && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) event.stopPropagation();}}>
      <div className="image-viewer-stage"><img src={src} alt={alt} draggable="false"/></div>
    </div>
  </div>;
}
