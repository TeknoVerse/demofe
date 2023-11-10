import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getUrlMachine, getUrlTtransOperation, getUrlTtransOutput, getUrlTworkDisplay } from 'src/config/Api';

const ProductionDisplay = () => {
  const [dataPlanning, setDataPlanning] = useState(0);
  const [currentDataMachine,setCurrentDataMachine] = useState([])
  const [actual, setActual] = useState('')

 
  useEffect( () => {
    const bagInterval = [];
    const intervalDataMachine = setInterval(() => {
       getDataMachine();
    }, 1000);
 
    const intervalAllDisplay = setInterval(() => {
      handleDisplayProduction();
    }, 1000);
    
    


    bagInterval.push(intervalDataMachine,intervalAllDisplay);
 
    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  },[actual,]);

  const getTworkDisplay = async () => {
    try {
      const response = await axios.get(`${getUrlTworkDisplay}?machine_no=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}` )
      const getData = response.data
      setDataPlanning(getData.ctime)
    } catch (error) {
      console.log(error)
    }
  }


  const handleDisplayProduction = async () => {
    try {
      
      const getTtransOutput = await axios.get(
        `${getUrlTtransOutput}?machine_no=${currentDataMachine.code}&part_no=${currentDataMachine.part_no}`,
      );
  
      setActual(
        getTtransOutput.data.reduce((totalQty, data) => totalQty + (data.qty || 0), 0),
      );
  
      const getTworkDisplays = await axios.get(
        `${getUrlTworkDisplay}?machine_no=${currentDataMachine.code}&part_code=${currentDataMachine.part_no}`,
      );
      const getData = getTworkDisplays.data;
      setDataPlanning(getData.ctime);
    } catch (error) {
      console.log(error)
    }
  }

  


  const getDataMachine = async () => {
    try {
      const response = await axios.get(getUrlMachine);
      const getCurrentData = response.data.find(item => process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code))
      setCurrentDataMachine(getCurrentData)
    } catch (error) {
      console.log(error);
    }
  };

  

/*   const getTtransOutput = async () => {
    try {
      const response = await axios.get(`${getUrlTtransOutput}?machine_no=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}`)
      setActual(response.data.reduce((totalQty, data) => totalQty + (data.qty || 0),0 ))
 
    } catch (error) {
      console.log(error)
    }
  } */


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
              <span>Part Code : {currentDataMachine.part_no}  </span>
              <span>Part Name : {currentDataMachine.part_name}  </span>
              <span>Target : 1.200  </span>
              <span>Plan : {dataPlanning}  </span>
              <span>Actual : {actual} </span>
              <span>Belance : {dataPlanning - actual} </span>
              <span>
                Performance (%) : {((actual / dataPlanning) * 100).toFixed(2)} %
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
