import React from 'react'

import PropTypes from "prop-types";

export const Lampu_andon = ({extra,red,yellow,green }) => {
  const width =  extra > 0  ? 40 + extra  :  40
  const height =  extra > 0  ? 20 + extra  :  20
  const widthTongkat =  extra > 0  ? 10 + extra  :  10
  const heightTongkat =  extra > 0  ? 20 + extra  :  20
    return (
      
      <div className=' d-flex flex-column align-items-center  ' style={{width :`${width}px` }}>
       
        
          <div className={`${red === true ? "active-light-red": "light-red "}`} style={{ width: `${width}px`, height: `${height}px` }}></div>
          <div className={`${yellow === true ? "active-light-yellow": "light-yellow "}`} style={{ width: `${width}px`, height: `${height}px` }}></div>
          <div className={`${green === true ? "active-light-green": "light-green "}`} style={{ width: `${width}px`, height: `${height}px` }}></div>
        {/*   <div className={`bg-warning`} style={{ width: `${width}px`, height: `${height}px` }}></div>
          <div className={`bg-success`} style={{ width: `${width}px`, height: `${height}px` }}></div>  */}
          <div className='bg-dark' style={{ width : `${widthTongkat}px`, height : `${heightTongkat}px` }}></div> 
      </div>
    );
  };



Lampu_andon.propTypes = {
  extra: PropTypes.number,
  red : PropTypes.bool,
  yellow : PropTypes.bool,
  green : PropTypes.bool,
};


