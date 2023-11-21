import {
  cilArrowLeft,
  cilArrowRight,
  cilArrowThickLeft,
  cilArrowThickRight,
  cilSpeedometer,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard } from '@coreui/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import { Lampu_andon } from 'src/components/my component/MyIcon';
import {
  getUrlMachine,
  getUrlSubCategory,
  getUrlTtransDefect,
  getUrlTtransOperation,
  getUrlTtransOutput,
  getUrlTtransStop,
  getUrlTworkDisplay,
} from 'src/config/Api';
import {
  DataMasterDefect,
  DataProduct,
  DatattransDefect,
} from 'src/config/GetDataApi';

const Production = () => {
  const newDate = new Date();

  const [currentDataMachine, setCurrentDataMachine] = useState([]);

  const currentTime = newDate.toLocaleString();
  const getDataProduct = DataProduct();
  const getTmastDefectByGroup = DataMasterDefect({
    machine_group: currentDataMachine.machine_group_code,
  });
  const getTmastDefect = DataMasterDefect({ machine_group: null });
  const getTtransDefectByGroup = DatattransDefect({
    machine_no: currentDataMachine.code,
  });

  const defaultMachineCode = 'MT-01';
  const defaultMachineName = 'Wire Machine';
  const [actual, setActual] = useState(0);

  const [machine, setMachine] = useState([]);
  const [checked, setChacker] = useState(false);

  const [loading, setLoading] = useState(true);

 

  const [dataTtransOperation, setDataTtransOperation] = useState([]);

  const [dataPlanning, setDataPlanning] = useState(0);

  const [dataMachine, setDataMachine] = useState([]);

  const [dataSubCategoryPnm, setDataSubCategoryPnm] = useState([]);
  const [dataSubCategoryPm, setDataSubCategoryPm] = useState([]);

  const [formDandori, setFormDandori] = useState({
    status: false,
    name: process.env.REACT_APP_DEFAULT_MACHINE_NAME,
    code: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
  });

  const handleDataOutput = async (e) => {
    e.preventDefault();
    await axios.post(getUrlTtransOutput, {
      machine_no: currentDataMachine.code,
      qty: 1,
      current_time: currentTime,
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
    const IntervalDisplayProduction = setInterval(() => {
      handleDisplayProduction();
    }, 1000);

    const IntervalTmastSubCategory = setInterval(() => {
      getTmastSubCategory();
    }, 1000);

    bagInterval.push(
      intervalDataMachine,
      IntervalTtransOperation,
      IntervalDisplayProduction,
      IntervalTmastSubCategory,
    );

    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  }, [dataMachine, checked, machine, dataSubCategoryPm, dataSubCategoryPnm]);

  const getTworkDisplay = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleLightYellow = async (e) => {
    e.preventDefault();

    new Promise (async (res,rej) => {
      try {
        if(!currentDataMachine.status_yellow ){
          await axios.post(getUrlTtransStop, {
            time: currentTime,
            machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
          });
        }
      } catch (error) {
        rej(error)
      }
    })



  

    new Promise (async (res,rej) => {
      try {
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
      } catch (error) {
        rej(error)
      }
    })

  
  };


  const handleDefect = async (e) => {
    e.preventDefault();
   

    const cekMachineCode = dataMachine.find((item) =>
      process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code),
    );

    if (cekMachineCode) {
      await axios.patch(`${getUrlMachine}?id=${cekMachineCode.id}`, {
        status_green: true,
        status_yellow: false,
        status_red: false,
        defect: true,
      });
    }
  };

  const handleLightRed = async (e) => {
    e.preventDefault();

    new Promise(async (res,rej) => {
    try {
      if(!currentDataMachine.status_red ){
        await axios.post(getUrlTtransStop, {
          time: currentTime,
          machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
        });
      }
    } catch (error) {
      rej(error)
    }

    })
    new Promise(async (res,rej) => {
try {

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


    
   
} catch (error) {
  rej(error)
}
    })
  
  };
  const getDataTtrasOperation = async () => {
    try {
      const response = await axios.get(getUrlTtransOperation);
      setDataTtransOperation(response.data);
      const cekStatusMachine = dataTtransOperation.find((item) =>
        item.machine_no.includes(process.env.REACT_APP_DEFAULT_MACHINE_CODE),
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
        item.machine_no.includes(process.env.REACT_APP_DEFAULT_MACHINE_CODE),
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
          machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
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
        process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code),
      );
      if (getCurrentData) {
        setCurrentDataMachine(getCurrentData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const modalRef = useRef(null);

  const handleFormDandori = async (e) => {
    e.preventDefault();

    try {
      
/*       if (currentDataMachine.length !== 0) { */
new Promise(async(resolve, reject) => {
  await axios.patch(
    `${getUrlMachine}?id=${currentDataMachine.id}`,
    formDandori,
  );

})
setFormDandori((prevData) => {
  return { ...prevData,    status: !prevData.status, };
});
          
    /*   } else {
        const DataStatus = { ...formDandori, status_green: true };
        await axios.post(`${getUrlMachine}`, DataStatus);
      } */
 
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModalAndon = async (e) => {
    await axios.patch(`${getUrlMachine}?id=${currentDataMachine.id}`, {
      status_green: true,
      status_yellow: false,
      status_red: false,
      defect: false,
    });  

  };

  const handleProblemNonMachine = async (e) => {
    if (currentDataMachine) {

      new Promise (async() => {
        await axios.patch(`${getUrlMachine}?id=${currentDataMachine.id}`, {
          category: currentDataMachine.category === e.code ? null : e.code,
        });
      })

      new Promise (async() => {
        if(currentDataMachine.category){
          await axios.post(getUrlTtransStop, {
            options : 'end' ,
            time: currentTime,
            machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
            category_code: e.category_code,
            sub_category_code: e.code,
          });
        }else{
          await axios.post(getUrlTtransStop, {
            options : 'process' ,
            time: currentTime,
            machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
            category_code: e.category_code,
            sub_category_code: e.code,
          });
        }
      })

    

  

    

    }
  };

  const handleProblemMachine = async (e) => {
    if (currentDataMachine) {
   


     new Promise (async() => {
      await axios.patch(`${getUrlMachine}?id=${currentDataMachine.id}`, {
        category: currentDataMachine.category === e.code ? null : e.code,
      });
     })
     new Promise (async() => {
      if(currentDataMachine.category){
        await axios.post(getUrlTtransStop, {
          options : 'end' ,
          time: currentTime,
          machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
          category_code: e.category_code,
          sub_category_code: e.code,
        });
      }else{
        await axios.post(getUrlTtransStop, {
          
          options : 'process' ,
          time: currentTime,
          machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
          category_code: e.category_code,
          sub_category_code: e.code,
        });
      }
     })
    }
  };

  const handleButtonDandori = async () => {

    new Promise (async() => {
      await axios.patch(`${getUrlMachine}?id=${currentDataMachine.id}`, {
        category: currentDataMachine.category === "DNDP1" ? null : "DNDP1",
      });
     })


     new Promise (async() => {
      if(currentDataMachine.category){
        await axios.post(getUrlTtransStop, {
          options : 'end' ,
          time: currentTime,
          machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
          category_code: 'DND',
          sub_category_code: "DNDP1",
        });
     /*    setFormDandori((prevData) => {
          return {
            ...prevData,
            status: false,
          };
        }) */
      }else{
   
       /*  setFormDandori((prevData) => {
          return {
            ...prevData,
            status: true,
          };
        }) */
    
        await axios.post(getUrlTtransStop, {
          
          options : 'process' ,
          time: currentTime,
          machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
          category_code: 'DND',
          sub_category_code: "DNDP1",
        });

      }
     })


  }

  const handleDisplayProduction = async () => {
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
      setDataPlanning(getData.ctime);
    } catch (error) {
      console.log(error);
    }
  };

  const getTmastSubCategory = async () => {
    try {
      const response = await axios.get(getUrlSubCategory);
      const dataSub = response.data;
      const categoryPnm = dataSub.filter(
        (itemSub) => itemSub.category_code === 'PNM-01',
      );
      const categoryPm = dataSub.filter(
        (itemSub) => itemSub.category_code === 'PM-01',
      );
      setDataSubCategoryPnm(categoryPnm);
      setDataSubCategoryPm(categoryPm);
    } catch (error) {
      console.log(error);
    }
  };

  const [dataFormDefect, setDataFormDefect] = useState({
    defect: [],
    qty: 0,
  });

  const handleFormDefect = async (e) => {
    e.preventDefault();
    if (dataFormDefect.defect.length === 0) {
      console.log('kosong');
    } else {
      const getCT = getDataProduct.find(
        (item) => currentDataMachine.part_no === item.part_no,
      );
      await axios.post(getUrlTtransDefect, {
        part_no: currentDataMachine.part_no,
        time: currentTime,
        machine_no: currentDataMachine.code,
        qty: dataFormDefect.qty,
        ct: getCT.ct,
        category_code: dataFormDefect.defect.code,
      });
    }
  };


  return (
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
                  <div className="">
                    <button
                      disabled={
                        machine.status !== 'on' ||
                        currentDataMachine.status_green !== true
                        
                      }
                      onClick={handleDefect}
                      className="btn  btn-sm text-white fw-bold col-12 bg-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#modalButtonAndon"
                    >
                      Product Defect
                    </button>
                  </div>
                  <hr style={{ border: '2px solid black' }} className=" mb-0" />
                  <div className="">
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
                        Performance (%) :{' '}
                        {((actual / dataPlanning) * 100).toFixed(2)} %
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
                              Part name :{' '}
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
          <div className="modal-dialog modal-xl">
            <div className="modal-content  ">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalButtonAndonLabel">
                  {currentDataMachine.status_yellow
                    ? 'Problem Non Machine'
                    : currentDataMachine.status_red && 'Problem Machine'}
                </h1>
                <button
                id='closeButton'
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
                      !currentDataMachine.status_yellow && 'd-none'
                    } col-md-12 rounded  p-1   `}
                  >
                    <div className=" col-md-12">
                      <div className=" p-2 ">
                        <div className=" d-flex flex-column ">
                          <div className="row text-white p-0 g-2">
                            <div className="col-6  ">
                              <button
                                disabled={currentDataMachine.category && currentDataMachine.category !== 'DNDP1'}
                                onClick={() => handleButtonDandori()
                                
                                }
                                className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex"
                              >
                                Dandori
                              </button>
                            </div>

                            {dataSubCategoryPnm.map((item, index) => (
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
                                      currentDataMachine.category !== item.code)
                                  }
                                  onClick={() => handleProblemNonMachine(item)}
                                  className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex"
                                >
                                  {item.name}
                                </button>
                              </div>
                            ))}

                            <div
                              className={` mt-4 col-12 ${
                                currentDataMachine.category !== "DNDP1" && 'd-none'
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
                                    <Typeahead
                                      options={getDataProduct}
                                      labelKey={'part_no'}
                                      id={(e) =>
                                        e[0] != null && e[0].id != null
                                          ? e[0].id
                                          : null
                                      }
                                      onChange={(e) =>
                                        setFormDandori((prevData) => {
                                          return {
                                            ...prevData,
                                            part_no:
                                              e[0] != null &&
                                              e[0].part_no != null
                                                ? e[0].part_no
                                                : '',
                                            part_name:
                                              e[0] != null &&
                                              e[0].part_name != null
                                                ? e[0].part_name
                                                : '',
                                            ct:
                                              e[0] != null && e[0].ct != null
                                                ? e[0].ct
                                                : '',
                                          };
                                        })
                                      }
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
                                      disabled
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                                <div className="row mb-3 justify-content-center">
                                  <label className="col-sm-3 col-form-label">
                                    CT (Seccond)
                                  </label>
                                  <div className="col-sm-6">
                                    <input
                                      type="text"
                                      value={
                                        formDandori.ct ? formDandori.ct : ''
                                      }
                                      disabled
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                            {/*     <div className="row mb-3 justify-content-center">
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
                                </div> */}

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
                      !currentDataMachine.status_red && 'd-none'
                    } col-md-12 rounded  p-1   `}
                  >
                    <div className=" col-md-12">
                      <div className=" p-2 ">
                        <div className=" d-flex flex-column ">
                          <div className="row text-white p-0 g-2">
                            {dataSubCategoryPm.map((item, index) => (
                              <div
                                key={index}
                                className={` col-6  ${
                                  currentDataMachine.category === "DNDP1" && 'd-none'
                                } `}
                              >
                                <button
                                  disabled={
                                    currentDataMachine.length === 0 ||
                                    currentDataMachine === null ||
                                    (currentDataMachine.category &&
                                      currentDataMachine.category !== item.code)
                                  }
                                  onClick={() => handleProblemMachine(item)}
                                  className=" col-md-12 btn  btn-danger text-white p-3 align-items-center justify-content-center d-flex"
                                >
                                  {item.name}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div       className={` ${
                      !currentDataMachine.defect  && 'd-none'
                    } col-md-12 rounded  p-2   `}>
                  <div className="row">
                    <div className="col-6  p-0 ">
                      <div className="row g-3 m-0 p-0  ">
                        {getTmastDefectByGroup.map((item, index) => (
                          <div
                            key={index}
                            className="col-4 d-flex align-items-center  justify-content-center"
                          >
                            <button
                              onClick={() =>
                                setDataFormDefect((prevData) => {
                                  return { ...prevData, defect: item };
                                })
                              }
                              className="col-12 btn btn-warning fw-bold"
                            >
                              {item.name}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-6 bg-yellow">
                      <div className="row  text-center  justify-content-center ">
                        <span className="fw-bold fs-4">
                          {dataFormDefect.defect
                            ? dataFormDefect.defect.name
                            : '_______'}
                        </span>
                        <hr className="p-0 mb-3 mt-3 w-50" />
                        <form onSubmit={handleFormDefect}>
                          <div className="d-flex justify-content-evenly align-items-cneter">
                            <div className="btn btn-outline-primary btn-sm">
                              <CIcon
                                icon={cilArrowLeft}
                                height={30}
                                onClick={() =>
                                  setDataFormDefect((prevData) => {
                                    return {
                                      ...prevData,
                                      qty: prevData.qty - 1,
                                    };
                                  })
                                }
                                customClassName="nav-icon"
                              />
                            </div>

                            <div className="col-6">
                              <input
                                value={
                                  dataFormDefect.qty ? dataFormDefect.qty : 0
                                }
                                onChange={(e) =>
                                  setDataFormDefect((prevData) => {
                                    return { ...prevData, qty: e.target.value };
                                  })
                                }
                                type="number"
                                required
                                min={1}
                                className="border  border-primary form-control"
                              />
                            </div>
                            <div className="btn btn-outline-primary btn-sm">
                              <CIcon
                                icon={cilArrowRight}
                                height={30}
                                onClick={() =>
                                  setDataFormDefect((prevData) => {
                                    return {
                                      ...prevData,
                                      qty: prevData.qty + 1,
                                    };
                                  })
                                }
                                customClassName="nav-icon"
                              />
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <button
                              type="submit"
                              className="col-7 btn btn-primary"
                            >
                              Enter
                            </button>
                          </div>
                        </form>

                        <div
                          className="table-responsive   mt-3 "
                          style={{ height: '12rem' }}
                        >
                          <table className="table table-sm align-middle  ">
                            <thead className="">
                              <tr className="text-center ">
                                <th scope="col">No</th>
                                <th scope="col">Jenis Defect</th>
                                <th scope="col">QTY</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getTtransDefectByGroup.length !== 0 &&
                                Object.values(
                                  getTtransDefectByGroup.reduce(
                                    (data, values) => {
                                      if (data[values.category_code]) {
                                        data[values.category_code].qty +=
                                          values.qty;
                                      } else {
                                        data[values.category_code] = {
                                          category_code: values.category_code,
                                          qty: values.qty,
                                        };
                                      }
                                      return data;
                                    },
                                    {},
                                  ),
                                ).map((item, index) => (
                                  <tr key={index}>
                                    <th> {index + 1} </th>
                                    <td>
                                      {' '}
                                      {
                                        getTmastDefect.find(
                                          (masterDefect) =>
                                            masterDefect.code ===
                                            item.category_code,
                                        )?.name
                                      }{' '}
                                    </td>
                                    <td> {item.qty} </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
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

        {/* start modal Defect */}
        <div
          className="modal fade"
          id="modalDefect"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="modalDefectLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalDefectLabel">
                  Product Defect | Machine :{' '}
                  {process.env.REACT_APP_DEFAULT_MACHINE_CODE}{' '}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
               
              </div>
              <div className="modal-footer">
                {/*   <button type="button" className="btn btn-success">Save</button> */}
              </div>
            </div>
          </div>
        </div>
        {/* end modal Defect */}
      </div>
  );
};

export default Production;
