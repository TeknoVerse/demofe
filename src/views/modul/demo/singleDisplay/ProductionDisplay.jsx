import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  getUrlMachine,
  getUrlTtransOperation,
  getUrlTtransOutput,
  getUrlTworkDisplay,
} from 'src/config/Api';

const ProductionDisplay = () => {
  const [dataPlanning, setDataPlanning] = useState(0);
  const [currentDataMachine, setCurrentDataMachine] = useState([]);
  const [actual, setActual] = useState('');
  const [totalDandori, setTotalDandori] = useState(0)
  const [totalProblemNonMachine, setTotalProblemNonMachine] = useState(0)
  const [totalProblemMachine, setTotalProblemMachne] = useState(0)

  useEffect(() => {
    const bagInterval = [];
    const intervalDataMachine = setInterval(() => {
      getDataMachine();
    }, 1000);

    const intervalAllDisplay = setInterval(() => {
      handleDisplayProduction();
    }, 1000);

    bagInterval.push(intervalDataMachine, intervalAllDisplay);

    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  }, [actual, currentDataMachine, actual]);

  const getTworkDisplay = async () => {
    try {
      const response = await axios.get(
        `${getUrlTworkDisplay}?machine_no=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}`,
      );
      const getData = response.data;
      setDataPlanning(getData.ctime);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisplayProduction = async () => {
    new Promise(async (resolve, reject) => {
      try {
        const getTtransOutput = await axios.get(
          `${getUrlTtransOutput}?machine_no=${currentDataMachine.code}&part_no=${currentDataMachine.part_no}`,
        );

        setActual(
          getTtransOutput.data.reduce(
            (totalQty, data) => totalQty + (data.qty || 0),
            0,
          ),
        );

        const getTworkDisplays = await axios.get(
          `${getUrlTworkDisplay}?machine_no=${currentDataMachine.code}&part_code=${currentDataMachine.part_no}`,
        );
        const getData = getTworkDisplays.data;
        setDataPlanning(getData && getData.ctime);
        setTotalDandori(getData && 
          getData.dandorishift1 +
          getData.dandorishift2 +
          getData.dandorishift3 
          );
        setTotalProblemMachne(getData && 
          getData.problem_machine_1 +
          getData.problem_machine_2 +
          getData.problem_machine_3 
          );
        setTotalProblemNonMachine(getData && 
          getData.problem_non_machine_1 +
          getData.problem_non_machine_2 +
          getData.problem_non_machine_3
          );
      } catch (error) {
        reject(error)
      }
    });
  };

  const getDataMachine = async () => {
    try {
      const response = await axios.get(getUrlMachine);
      const getCurrentData = response.data.find((item) =>
        process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code),
      );
      setCurrentDataMachine(getCurrentData);
    } catch (error) {
      console.log(error);
    }
  };

  const getDadori = async () => {
    
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center container-fluid"
      style={{ height: '100vh' }}
    >
      <div className="col-3">
        <div
          style={{
            background: 'black',
            position: 'relative',
            height: 'auto',
            color: 'yellow',
          }}
          className="row  p-3 rounded "
        >
          <div className="text-center fw-bold mb-3 fs-4">
            <span>Line Assy</span>
          </div>
          <hr style={{border: '1px solid yellow', opacity: '.6'}} />
          

          <div className="col-12 mb-3">
            <div style={{minHeight: '16rem'}} className="row fs-5">
              <div className="col-12  d-flex">
                <div className="col-9">Part Code</div>
                <div className="col-3 d-flex "> <span className='ms-auto'> {currentDataMachine.part_no} </span> </div>
              </div>
              <div className="col-12  d-flex">
                <div className="col-9">Part Name</div>
                <div className="col-3 d-flex "> <span className='ms-auto'> {currentDataMachine.part_name} </span> </div>
              </div>
              <div className="col-12  d-flex">
                <div className="col-9">Target</div>
                <div className="col-3 d-flex "> <span className='ms-auto'> 1.200 </span> </div>
              </div>
              <div className="col-12  d-flex">
                <div className="col-9">Plan</div>
                <div className="col-3 d-flex "> <span className='ms-auto'> {dataPlanning} </span> </div>
              </div>
              <div className="col-12  d-flex">
                <div className="col-9">Actual</div>
                <div className="col-3 d-flex "> <span className='ms-auto'> {actual}</span> </div>
              </div>
              <div className="col-12  d-flex">
                <div className="col-9">Belance</div>
                <div className="col-3 d-flex "> <span className='ms-auto'> {dataPlanning - actual}</span> </div>
              </div>
              <div className="col-12  d-flex">
                <div className="col-9">Performance (%)</div>
                <div className="col-3 d-flex "> <span className='ms-auto'> {((actual / dataPlanning) * 100).toFixed(2)} %</span>
                </div>
              </div>
            </div>
            <div className="row">
              <hr className="mt-2 " style={{border: '1px solid yellow', opacity: '.6'}} />
              <div className="col-md-12" style={{ fontSize: '12px' }}>
                <div className="row">
                  <span className='ms-auto'>Dandori (minutes) : {(totalDandori/60).toFixed(2)}</span>
                  <span className='ms-auto'>Problem Machine (minutes) : {(totalProblemMachine/60).toFixed(2)} </span>
                  <span>Problem Non Machine (minutes) : {(totalProblemNonMachine/60).toFixed(2)}</span>
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
