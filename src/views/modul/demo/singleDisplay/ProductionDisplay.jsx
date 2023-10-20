import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getUrlMachine, getUrlTtransOperation, getUrlTtransOutput, getUrlTworkDisplay } from 'src/config/Api';

const ProductionDisplay = () => {
  const [dataPlanning, setDataPlanning] = useState(0);
  const [currentDataMachine,setCurrentDataMachine] = useState([])
  const [dataTtransOperation,setDataTtransOperation] = useState([])
  const [actual, setActual] = useState(0)

 
  useEffect( () => {
    const bagInterval = [];
    const intervalDataMachine = setInterval( async() => {
       getDataMachine();
    }, 1000);
    const intervalDataTtransOperation = setInterval(() => {
      getDataTtrasOperation();
    }, 1000);
    const intervalDataTtransOutput = setInterval(() => {
      getTtransOutput();
    }, 1000);
    const intervalTworkDisplay = setInterval(() => {
      getTworkDisplay();
    }, 1000);
    
    

    bagInterval.push(intervalDataMachine,intervalDataTtransOperation,intervalDataTtransOutput,intervalTworkDisplay);
 
    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  },[]);

  const getTworkDisplay = async () => {
    try {
      const response = await axios.get(`${getUrlTworkDisplay}?machine_no=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}` )
      const getData = response.data
      setDataPlanning(getData.ctime)
    } catch (error) {
      console.log(error)
    }
  }


  const getDataTtrasOperation = async () => {
    try {
      const response = await axios.get(getUrlTtransOperation);
      const cekStatusMachine = response.data.find((item) =>
      process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.machine_no),
      );
      setDataTtransOperation(cekStatusMachine);

    } catch (error) {
      console.log(error);
    }
  };



  const getDataMachine = async () => {
    try {
      const response = await axios.get(getUrlMachine);
      const getCurrentData = response.data.find(item => process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code))
      if(getCurrentData){
        
        setCurrentDataMachine(prevData => {return { ...prevData,
        name : getCurrentData.name ,
        code : getCurrentData.code ,
        status_green : getCurrentData.status_green ,
        status_yellow : getCurrentData.status_yellow ,
        status_red : getCurrentData.status_red ,
        ct : prevData.ct === getCurrentData.ct ? prevData.ct : getCurrentData.ct,
        qty : getCurrentData.qty,
        }}  )
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const getTtransOutput = async () => {
    try {
      const response = await axios.get(`${getUrlTtransOutput}?machine_no=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}`)
      setActual(response.data.reduce((totalQty, data) => totalQty + (data.qty || 0),0 ))
 
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div
      className="d-flex align-items-center justify-content-center container-fluid"
      style={{ height: '100vh' }}
    >
      <div className="col-md-5">
        <div
          style={{ background: 'black', color: 'yellow' }}
          className="row  p-2 rounded "
        >
          <div className="text-center fw-bold">
            <span>Line Assy</span>
          </div>
          <div className="col-md-12 mb-3">
            <div className="row">
              <span>Target : 1.200  </span>
              <span>Plan : {dataPlanning}  </span>
              <span>Actual : {actual} </span>
              <span>Belance : {dataPlanning - actual} </span>
              <span>
                Performance (%) : {(actual / dataPlanning) * 100} %{' '}
              </span>
              <hr className="my-3 " />
              <div className="col-md-12" style={{ fontSize: '12px' }}>
                <div className="row">
                  <span>Dandori (minutes) :</span>
                  <span>Problem Machine (minutes) :</span>
                  <span>Problem Non Machine (minutes) :</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDisplay;
