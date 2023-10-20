import { CCard } from '@coreui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Lampu_andon } from 'src/components/my component/MyIcon';
import {
  getUrlMachine,
  getUrlSubCategory,
  getUrlTtransOperation,
  getUrlTtransOutput,
  getUrlTtransStop,
  getUrlTworkDisplay,
} from 'src/config/Api';

const Production = () => {
  const newDate = new Date();
  const currentTime = newDate.toLocaleString();


  const defaultMachineCode = 'MT-01';
  const defaultMachineName = 'Wire Machine';
  const [actual, setActual] = useState(0);

  const [machine, setMachine] = useState([]);
  const [checked, setChacker] = useState(false);

  const [loading, setLoading] = useState(true);

  const [displayModalAndon, setDisplayModalAndon] = useState({
    yellow: false,
    red: false,
  });

  const [dataTtransOperation, setDataTtransOperation] = useState([]);

  const [dataPlanning, setDataPlanning] = useState(0);

  const [dataMachine, setDataMachine] = useState([]);
  

  const [dataSubCategoryPnm, setDataSubCategoryPnm] = useState([])
  const [dataSubCategoryPm, setDataSubCategoryPm] = useState([])

  const [formDandori, setFormDandori] = useState({
    status: false,
    name: process.env.REACT_APP_DEFAULT_MACHINE_NAME,
    code: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
  });

  const [currentDataMachine, setCurrentDataMachine] = useState([]);

  const handleDataOutput = async (e) => {
    e.preventDefault();
    await axios.post(getUrlTtransOutput, {
      machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
      qty: 1,
      part_no: currentDataMachine.part_no,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const bagInterval = [];
    const intervalDataMachine = setInterval(() => {
      getDataMachine();
    }, 1000);
    const IntervalTtransOperation = setInterval(() => {
      getDataTtrasOperation();
    }, 1000);
    const IntervalTtransOutput = setInterval(() => {
      getTtransOutput();
    }, 1000);
    const IntervalTworkDisplay = setInterval(() => {
      getTworkDisplay();
    }, 1000);
  
    const IntervalTmastSubCategory = setInterval(() => {
      getTmastSubCategory()
    }, 1000);

    bagInterval.push(
      intervalDataMachine,
      IntervalTtransOperation,
      IntervalTtransOutput,
      IntervalTworkDisplay,
      IntervalTmastSubCategory,
    );

    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  });

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

  const handleLightYellow = async (e) => {
    e.preventDefault();

    setDisplayModalAndon((prevData) => {
      return { ...prevData, yellow: true, red: false };
    });

    const cekMachineCode = dataMachine.find((item) =>
      process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code),
    );

    if (cekMachineCode) {
      await axios.patch(`${getUrlMachine}?id=${cekMachineCode.id}`, {
        status_green: false,
        status_yellow: true,
        status_red: false,
      });
    }
  };

  const handleLightRed = async (e) => {
    e.preventDefault();
    setDisplayModalAndon((prevData) => {
      return { ...prevData, red: true, yellow: false };
    });

    const cekMachineCode = dataMachine.find((item) =>
      process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code),
    );

    if (cekMachineCode) {
      await axios.patch(`${getUrlMachine}?id=${cekMachineCode.id}`, {
        status_green: false,
        status_yellow: false,
        status_red: true,
      });
    }
  };

  const getDataTtrasOperation = async () => {
    try {
      const response = await axios.get(getUrlTtransOperation);
      setDataTtransOperation(response.data);
      const cekStatusMachine = dataTtransOperation.find((item) =>
        item.machine_no.includes(defaultMachineCode),
      );
      if (cekStatusMachine) {
        if (cekStatusMachine.finish === null) {
          setChacker(true);

          setMachine((prevData) => {
            return { ...prevData, status: 'on' };
          });

          if (
            !currentDataMachine.status_yellow &&
            !currentDataMachine.status_green &&
            !currentDataMachine.status_red
          ) {
          }
        } else {
          setChacker(false);

          setMachine((prevData) => {
            return { ...prevData, status: 'off' };
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMachine = async (e) => {
    try {
      const cekStatusMachine = dataTtransOperation.find((item) =>
        item.machine_no.includes(defaultMachineCode),
      );

      if (cekStatusMachine) {
        if (cekStatusMachine.finish) {
          await axios.patch(
            `${getUrlTtransOperation}?id=${cekStatusMachine.id}`,
            {
              start: currentTime,
              finish: null,
            },
          );
        } else {
          await axios.patch(
            `${getUrlTtransOperation}?id=${cekStatusMachine.id}`,
            {
              finish: currentTime,
            },
          );
        }
      } else {
        await axios.post(getUrlTtransOperation, {
          machine_no: defaultMachineCode,
          start: currentTime,
        });
      }

      if (!machine.status || (machine.status && machine.status === 'off')) {
        setMachine((prevData) => {
          return { ...prevData, status: 'on' };
        });
      } else {
        setMachine((prevData) => {
          return { ...prevData, status: 'off' };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataMachine = async () => {
    try {
      const response = await axios.get(getUrlMachine);
      setDataMachine(response.data);
      const getCurrentData = response.data.find((item) =>
        defaultMachineCode.includes(item.code),
      );
      if (getCurrentData) {
        setCurrentDataMachine(getCurrentData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormDandori = async (e) => {
    e.preventDefault();

    try {
      if (currentDataMachine.length !== 0) {
        await axios.patch(
          `${getUrlMachine}?id=${currentDataMachine.id}`,
          formDandori,
        );
        await axios.patch(`${getUrlMachine}?id=${currentDataMachine.id}`, {
          status_green: true,
          status_yellow: false,
          status_red: false,
        });
        setFormDandori((prevData) => {
          return { ...prevData, status: false };
        });
      } else {
        const DataStatus = { ...formDandori, status_green: true };
        await axios.post(`${getUrlMachine}`, DataStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModalAndon = async (e) => {
    e.preventDefault();

    const cekMachineCode = dataMachine.find((item) =>
      process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code),
    );

    if (cekMachineCode) {
      await axios.patch(`${getUrlMachine}?id=${cekMachineCode.id}`, {
        status_green: true,
        status_yellow: false,
        status_red: false,
      });
    }
  };

  const handleProblemNonMachine = async (e) => {
    if (currentDataMachine) {
      await axios.patch(
        `${getUrlMachine}?code=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}`,
        {
          status_green: false,
          status_yellow: true,
          status_red: false,
        },
      );

      await axios.patch(`${getUrlMachine}?id=${currentDataMachine.id}`, {
        category: currentDataMachine.category === e.code ? null : e.code,
      });
    
       await axios.post(getUrlTtransStop, {
        time : currentTime,
        machine_no : process.env.REACT_APP_DEFAULT_MACHINE_CODE,
        category_code : e.category_code,
        sub_category_code : e.code ,
        

      }) 
    }
  };

  const handleProblemMachine = async (e) => {
    if (currentDataMachine) {
      await axios.patch(
        `${getUrlMachine}?code=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}`,
        {
          status_green: false,
          status_yellow: false,
          status_red: true,
        },
      );

      await axios.patch(`${getUrlMachine}?id=${currentDataMachine.id}`, {
        category: currentDataMachine.category === e.code ? null : e.code,
      });

      await axios.post(getUrlTtransStop, {
        time : currentTime,
        machine_no : process.env.REACT_APP_DEFAULT_MACHINE_CODE,
        category_code : e.category_code,
        sub_category_code : e.code 

      }) 
    }
  };

  const getTtransOutput = async () => {
    try {
      const response = await axios.get(
        `${getUrlTtransOutput}?machine_no=${process.env.REACT_APP_DEFAULT_MACHINE_CODE}`,
      );
      setActual(
        response.data.reduce((totalQty, data) => totalQty + (data.qty || 0), 0),
      );
    } catch (error) {
      console.log(error);
    }
  };



  const getTmastSubCategory = async () => {
    try {
      const response = await axios.get(getUrlSubCategory)
      const dataSub = response.data
      const categoryPnm = dataSub.filter(itemSub =>  itemSub.category_code === 'PNM-01')
      const categoryPm = dataSub.filter(itemSub =>  itemSub.category_code === 'PM-01')
      setDataSubCategoryPnm(categoryPnm)
      setDataSubCategoryPm(categoryPm)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CCard className="mb-4 p-2">
      <div className="p-2 container-fluid">
        <div className="d-flex justify-">
          <div className="col-md-12 ">
            <div className="col-md-12 ">
              <div className="form-check form-switch">
                <input
                  disabled={loading}
                  onChange={handleMachine}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  checked={checked === true}
                />
                <label className="form-check-label">
                  {machine.status && machine.status === 'on'
                    ? 'Mesin On'
                    : 'Mesin Off'}
                </label>
              </div>
            </div>
            <div className="row mt-3  justify-content-center ">
              <div className="col-md-5 d-flex mb-4  align-items-center justify-content-center  ">
                <div className="mx-5">
                  <Lampu_andon
                    extra={10}
                    green={currentDataMachine.status_green}
                    yellow={currentDataMachine.status_yellow}
                    red={currentDataMachine.status_red}
                  />
                </div>
                <div className="g-2 row col-md-6  pt-0 ms-2">
                  <div className="  ">
                    <button
                      disabled={
                        machine.status !== 'on' ||
                        currentDataMachine.status_green !== true
                      }
                      className="btn  btn-sm text-white fw-bold col-12 btn-secondary"
                      onClick={handleDataOutput}
                    >
                      Output Product
                    </button>
                  </div>
                  <div className="  ">
                    <button
                      disabled={machine.status !== 'on'}
                      onClick={handleLightYellow}
                      data-bs-toggle="modal"
                      data-bs-target="#modalButtonAndon"
                      className="btn btn-sm text-white fw-bold col-12 btn-warning"
                    >
                      Problem Non Machine
                    </button>
                  </div>
                  <div className="  ">
                    <button
                      disabled={
                        machine.status !== 'on' ||
                        currentDataMachine.length === 0
                      }
                      onClick={handleLightRed}
                      data-bs-toggle="modal"
                      data-bs-target="#modalButtonAndon"
                      className="btn btn-sm text-white fw-bold col-12  btn-danger"
                    >
                      Problem Machine
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-1 d-flex justify-content-center align-items-center">
                <div
                  style={{ width: '3px', height: '100%', background: 'black' }}
                ></div>
              </div>
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
                      <span>Target : 1.200</span>
                      <span>Plan : {dataPlanning}</span>
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
              <div className="col-md-12 ">
                <div className="row g-3 p-0">
                  <div className="col-md-12   p-1 ">
                    <div
                      style={{ background: 'black' }}
                      className=" rounded mt-3 col-md-12"
                    >
                      <div className="text-center pt-2">
                        <span className="text-white fw-bold  ">
                          Machine Running
                        </span>
                      </div>
                      <div className=" p-2 ">
                        <div className=" d-flex flex-column bg-success">
                          <div className="row text-white text-start p-2">
                            <span>
                              Part No :{' '}
                              {currentDataMachine && currentDataMachine.part_no}{' '}
                            </span>
                            <span>
                              Part name : {' '}
                              {currentDataMachine &&
                                currentDataMachine.part_name}{' '}
                            </span>
                            <span>
                              Target QTY :{' '}
                              {currentDataMachine && currentDataMachine.qty}{' '}
                            </span>
                            <span>
                              CT Time :{' '}
                              {currentDataMachine && currentDataMachine.ct}{' '}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

   
        <div
          className="modal fade"
          id="modalButtonAndon"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content ">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalButtonAndonLabel">
                  {displayModalAndon.yellow
                    ? 'Problem Non Machine'
                    : displayModalAndon.red && 'Problem Machine'}
                </h1>
                <button
                  type="button"
                  disabled={currentDataMachine.category !== null}
                  onClick={handleCloseModalAndon}
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/*  */}
                  <div
                    className={` ${
                      !displayModalAndon.yellow && 'd-none'
                    } col-md-12 rounded  p-1   `}
                  >
                    <div className=" col-md-12">
                      <div className=" p-2 ">
                        <div className=" d-flex flex-column ">
                          <div className="row text-white p-0 g-2">
                            <div className="col-6  ">
                              <button
                                disabled={currentDataMachine.category}
                                onClick={() =>
                                  setFormDandori((prevData) => {
                                    return {
                                      ...prevData,
                                      status: !prevData.status,
                                    };
                                  })
                                }
                                className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex"
                              >
                                Dandori
                              </button>
                            </div>

                            {
                                dataSubCategoryPnm.map((item,index) => (
                                  <div
                                  key={index}
                                  className={` col-6  ${
                                    formDandori.status === true && 'd-none'
                                  } `}
                                >
                                  <button
                                    disabled={
                                      currentDataMachine.length === 0 ||
                                      currentDataMachine === null ||
                                      (currentDataMachine.category &&
                                        currentDataMachine.category !== item.code )
                                    }
                                    onClick={() => handleProblemNonMachine(item)}
                                    className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex"
                                  >
                                {item.name}
                                  </button>
                                </div>
                                ))
                              }
                           

                            <div
                              className={` mt-4 col-12 ${
                                formDandori.status === false && 'd-none'
                              } `}
                            >
                              <form
                                onSubmit={handleFormDandori}
                                className="text-dark"
                                style={{ fontSize: '14px' }}
                              >
                                <div className="row mb-3 justify-content-center">
                                  <label className="col-sm-3 col-form-label">
                                    Machine Code
                                  </label>
                                  <div className="col-sm-6">
                                    <input
                                      type="text"
                                      value={
                                        process.env
                                          .REACT_APP_DEFAULT_MACHINE_CODE
                                      }
                                      required
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                                <div className="row mb-3 justify-content-center">
                                  <label className="col-sm-3 col-form-label">
                                    Machine Name
                                  </label>
                                  <div className="col-sm-6">
                                    <input
                                      value={
                                        process.env
                                          .REACT_APP_DEFAULT_MACHINE_NAME
                                      }
                                      type="text"
                                      required
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                                <div className="row mb-3 justify-content-center">
                                  <label className="col-sm-3 col-form-label">
                                    Part No
                                  </label>
                                  <div className="col-sm-6">
                                    <input
                                      type="text"
                                      value={
                                        formDandori.part_no
                                          ? formDandori.part_no
                                          : ''
                                      }
                                      required
                                      onChange={(e) =>
                                        setFormDandori((prevData) => {
                                          return {
                                            ...prevData,
                                            part_no: e.target.value,
                                          };
                                        })
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                                <div className="row mb-3 justify-content-center">
                                  <label className="col-sm-3 col-form-label">
                                    Part Name
                                  </label>
                                  <div className="col-sm-6">
                                    <input
                                      type="text"
                                      value={
                                        formDandori.part_name
                                          ? formDandori.part_name
                                          : ''
                                      }
                                      required
                                      onChange={(e) =>
                                        setFormDandori((prevData) => {
                                          return {
                                            ...prevData,
                                            part_name: e.target.value,
                                          };
                                        })
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                                <div className="row mb-3 justify-content-center">
                                  <label className="col-sm-3 col-form-label">
                                    {' '}
                                    QTY
                                  </label>
                                  <div className="col-sm-6">
                                    <input
                                      type="number"
                                      value={
                                        formDandori.qty ? formDandori.qty : ''
                                      }
                                      required
                                      onChange={(e) =>
                                        setFormDandori((prevData) => {
                                          return {
                                            ...prevData,
                                            qty: e.target.value,
                                          };
                                        })
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                                <div className="row mb-3 justify-content-center">
                                  <label className="col-sm-3 col-form-label">
                                    CT
                                  </label>
                                  <div className="col-sm-6">
                                    <input
                                      type="Number"
                                      value={
                                        formDandori.ct ? formDandori.ct : ''
                                      }
                                      required
                                      onChange={(e) =>
                                        setFormDandori((prevData) => {
                                          return {
                                            ...prevData,
                                            ct: e.target.value,
                                          };
                                        })
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <button
                                    type="submit"
                                    className="btn btn-sm btn-success text-white"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={` ${
                      !displayModalAndon.red && 'd-none'
                    } col-md-12 rounded  p-1   `}
                  >
                    <div className=" col-md-12">
                      <div className=" p-2 ">
                        <div className=" d-flex flex-column ">
                          <div className="row text-white p-0 g-2">

    {
                                dataSubCategoryPm.map((item,index) => (
                                  <div
                                  key={index}
                                  className={` col-6  ${
                                    formDandori.status === true && 'd-none'
                                  } `}  
                                >
                                  <button
                                    disabled={
                                      currentDataMachine.length === 0 ||
                                      currentDataMachine === null ||
                                      (currentDataMachine.category &&
                                        currentDataMachine.category !== item.code )
                                    }
                                    onClick={() => handleProblemMachine(item)}
                                    className=" col-md-12 btn  btn-danger text-white p-3 align-items-center justify-content-center d-flex"
                                  >
                                {item.name}
                                  </button>
                                </div>
                                ))
                              }  
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end modal button andon */}
      </div>
    </CCard>
  );
};

export default Production;
