import { CCard } from '@coreui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Lampu_andon } from 'src/components/my component/MyIcon';
import { getUrlTtransOperation, getUrlTtransOutput, getUrlTtransStop } from 'src/config/Api';

const ProductionIsu = () => {
  const [machine, setMachine] = useState([]);
  const [lightGreen, setLightGreen] = useState([])
  const [dataMachine, setDataMachine] = useState([])
  const [dataTtransStopRed ,setDataTtransStopRed] = useState ([])
  const [dataTtransStopYellow ,setDataTtransStopYellow] = useState ([])
  const [lightYellow, setLightYellow] = useState([])
  const [lightRed, setLightRed] = useState([])
  const [loading , setLoading] = useState(true)
  const [planning, setPlanning] = useState(0)
  const [actual, setActual] = useState( )

  const [dataTtransOutput, setDataTtransOutput] = useState([])

 
  const now = new Date()
  /* const formattedTime = now.toISOString(); */

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
 /*  const currentTime = `${hours}:${minutes}`; */
  const currentTime = now.toISOString();;
  const machine_no = "machine_1" 


  useEffect(() => {
    const interval = setInterval(() => {
      setPlanning(prevData => prevData + 1);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  },[])

  useEffect(()=> {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  },[])

  useEffect(()=> {
    const bagInterval = []
   
    const intervalMachineCheck = setInterval(() => {
      machineCheck()
    }, 1000);
    const intervalTtransStop = setInterval(() => {
      ttransStopChecklightRed()
      ttransStopChecklightYellow()
    }, 1000);
    const intervalTtransOutput = setInterval(() => {
      getTtransOutputByMachine()
    }, 1000);
  
    bagInterval.push(intervalTtransStop, intervalMachineCheck, intervalTtransOutput)

    return () => {
      bagInterval.forEach(data => {
        clearInterval(data)
      });
    }

  })

  const ttransStopChecklightYellow = async () => {
    try {
      const response = await axios.get(`${getUrlTtransStop}?id_con=max&machine_no=${machine_no}&category=problem`)
      setDataTtransStopYellow(response.data)
      if(response.data.finish === null) {
        setLightYellow(prevData => {return {...prevData, status : true}})

      }
    } catch (error) {
      console.log(error)
    }
  }

  const ttransStopChecklightRed = async () => {
    try {
      const response = await axios.get(`${getUrlTtransStop}?id_con=max&machine_no=${machine_no}&category=stop`)
      setDataTtransStopRed(response.data)
      if(response.data.finish === null) {
        setLightRed(prevData => {return {...prevData, status : true}})

      }
    } catch (error) {
      console.log(error)
    }
  }

  const machineCheck = async () => {
    try {
      const response = await axios.get(`${getUrlTtransOperation}?id_con=max&machine_no=${machine_no}`)
      setDataMachine(response.data.finish)
    
      if(response.data.finish === null){
        setMachine(prevData => {return {...prevData, status : "on"  }})
        setLightGreen( prevData => {return {...prevData, status : lightRed.status !== true  && lightYellow.status !== true  &&  true  }})
      }else{
      setMachine(prevData => {return {...prevData, status : null  }})
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleMachine = async () => {
    if(machine.status === "on"){
      handleLightGreen()
      setMachine(prevData => {return {...prevData, status : null  }})
      setLightRed(prevData => {return {...prevData, status : false}})
      setLightGreen(prevData => {return {...prevData, status : false}})
      setLightYellow(prevData => {return {...prevData, status : false}})
      if(dataTtransStopRed.finish === null){
        await axios.patch(`${getUrlTtransStop}?machine_no=${machine_no}&category=stop`, {
          finish : currentTime
      })
      }
      if(dataTtransStopYellow.finish === null){
        await axios.patch(`${getUrlTtransStop}?machine_no=${machine_no}&category=problem`, {
          finish : currentTime
      })
      }
      await axios.patch(`${getUrlTtransOperation}?machine_no=${machine_no} `, {
          finish : currentTime
      })

    
    }else{
      setMachine(prevData => {return {...prevData, status : "on"  }})
      
      handleLightGreen()
      await axios.post(getUrlTtransOperation, {
        machine_no , start : currentTime 
      })
    }
  }

  const handleLightRed = async () => {
    if( lightRed.status === true){
      await axios.patch(`${getUrlTtransStop}?machine_no=${machine_no}&category=stop`, {
        finish : currentTime
    })
      setLightGreen(prevData => {return {...prevData, status : true}})
      setLightRed(prevData => {return {...prevData, status : false}})
    }else{
      await axios.post(`${getUrlTtransStop}`,{
        machine_no, start : currentTime, category: "stop"
      })
      setLightRed(prevData => {return {...prevData, status : true}})
      setLightGreen(prevData => {return {...prevData, status : false}})
      setLightYellow(prevData => {return {...prevData, status : false}})
    }
  }

  const handleLightYellow = async () => {
    if( lightYellow.status === true){
      await axios.patch(`${getUrlTtransStop}?machine_no=${machine_no}&category=problem`, {
        finish : currentTime
    })
      setLightGreen(prevData => {return {...prevData, status : true}})
      setLightYellow(prevData => {return {...prevData, status : false}})
    }else{
      await axios.post(`${getUrlTtransStop}`,{
        machine_no, start : currentTime, category: "problem"
      })
      setLightYellow(prevData => {return {...prevData, status : true}})
      setLightGreen(prevData => {return {...prevData, status : false}})
      setLightRed(prevData => {return {...prevData, status : false}})
    }
  }

  const handleLightGreen = () => {
    if( lightGreen.status === true){
      setLightGreen(prevData => {return {...prevData, status : false}})
    }else{
      setLightGreen(prevData => {return {...prevData, status : true}})
      setLightYellow(prevData => {return {...prevData, status : false}})
      setLightRed(prevData => {return {...prevData, status : false}})

    }
  }


 

  const getTtransOutputByMachine = async () => {
    try {
      const response = await axios.get(`${getUrlTtransOutput}/?machine_no=${machine_no}`)

      setActual(response.data.reduce((totalQty, data) => totalQty + (data.qty || 0),0 ))
      setDataTtransOutput(response.data)
    
    } catch (error) {
      console.log(error)
    }
  }


  const handleOutput = async () => {
    try {
       await axios.post(getUrlTtransOutput, {
        machine_no, qty : 1
       })
    } catch (error) {
      console.log(error)
    }
  }


  return (
   <CCard>
      <div className='p-2 container-fluid'>
        {/* START LAMPU ANDON */}
       <div className=' row p-2 '>
     
          <div className='col-4 '>
            <div className='col-12'>
              <div className="form-check form-switch">
                <input disabled={loading}  onChange={ handleMachine } className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={machine.status === "on"} />
                <label className="form-check-label" > {machine.status && machine.status === "on" ? "Mesin On" : "Mesin Off"  } /</label> 
              </div>
            </div>
            <div className='col-12 mt-2 d-flex justify-content-center '><Lampu_andon  red={lightRed.status} yellow={lightYellow.status} green={lightGreen.status} /></div>
            <div className='col-md-12'>
              <div className='g-2 row mt-1 '>
                <div  className='col-4  '> <button disabled={ machine.status !== "on" } onClick={handleOutput} className='btn text-white fw-bold col-12 btn-secondary'>Output</button > </div>
                <div  className='col-4  '> <button disabled={ machine.status !== "on" } onClick={handleLightYellow}  className='btn text-white fw-bold col-12 btn-warning'>Problem</button > </div>
                <div  className='col-4  '> <button disabled={ machine.status !== "on" } onClick={handleLightRed}  className='btn text-white fw-bold col-12  btn-danger' >Stop  </button > </div>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='row p-2 bg-default rounded  text-white '>
                <div>Part No : PB003  </div>
                <div>part Name : Wire </div>
                <div>CT(Seccond) : 5 </div>
                <div>Target :  </div>
                <div>Planning : {planning} </div>        
                <div>Actual :  {actual} </div>
                <div>Balance : {planning - actual}   </div>
                <div>Performance : {(actual/planning)*100}%hbghjkl;vb nm </div>
            </div>
          </div>

       </div>

        {/* END LAMPU ANDON */}

      </div>
   </CCard>
  );
};

export default ProductionIsu;
