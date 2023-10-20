import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  getUrlMachine,
  getUrlSubCategory,
  getUrlTtransStop,
} from 'src/config/Api';
import { DataProduct } from 'src/config/GetDataApi';

const DataProductionDisplay = () => {
  const getDataProduct = DataProduct()
  const newDate = new Date();
  const currentTime = newDate.toLocaleString();
  const [currentDataMachine, setCurrentDataMachine] = useState([]);
  const [dataSubCategoryPnm, setDataSubCategoryPnm] = useState([]);
  const [dataSubCategoryPm, setDataSubCategoryPm] = useState([]);

  const [displayOptions, setDisplayOptions] = useState({
    machine_running: false,
    problem_non_machine: false,
    problem_machine: false,
  });
  const [formDandori, setFormDandori] = useState({
    status: false,
    name: process.env.REACT_APP_DEFAULT_MACHINE_NAME,
    code: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
  });

  useEffect(() => {
    const bagInterval = [];

    const intervalDataMachine = setInterval(() => {
      getDataMachine();
    }, 1000);
    const IntervalTmastSubCategory = setInterval(() => {
      getTmastSubCategory();
    }, 1000);

    bagInterval.push(IntervalTmastSubCategory, intervalDataMachine);
    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  });

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

  const getDataMachine = async () => {
    try {
      const response = await axios.get(getUrlMachine);
      const getCurrentData = response.data.find((item) =>
        process.env.REACT_APP_DEFAULT_MACHINE_CODE.includes(item.code),
      );
      if (getCurrentData.length !== 0) {
        setCurrentDataMachine(getCurrentData);
        if (getCurrentData.status_yellow === false) {
          setFormDandori({ status: false });
        }
        setDisplayOptions({
          machine_running: getCurrentData.status_green,
          problem_non_machine: getCurrentData.status_yellow,
          problem_machine: getCurrentData.status_red,
        });
      }
    } catch (error) {
      console.log(error);
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
        time: currentTime,
        machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
        category_code: e.category_code,
        sub_category_code: e.code,
      });
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
        time: currentTime,
        machine_no: process.env.REACT_APP_DEFAULT_MACHINE_CODE,
        category_code: e.category_code,
        sub_category_code: e.code,
      });
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

  return (
    <div
      className="d-flex align-items-center justify-content-center container-fluid"
      style={{ height: '100vh' }}
    >
      <div className="col-md-6 ">
        <div className="row g-3 p-0">
          <div
            className={`${
              currentDataMachine.length === 0 ||
              currentDataMachine.status_green === false
                ? 'd-none'
                : ''
            } col-md-12   p-1 `}
          >
            <div
              style={{ background: 'black' }}
              className=" rounded mt-3 col-md-12"
            >
              <div className="text-center pt-2">
                <span className="text-white fw-bold  ">Machine Running</span>
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
                      {currentDataMachine && currentDataMachine.part_name}{' '}
                    </span>
                    <span>
                      Target QTY :{' '}
                      {currentDataMachine && currentDataMachine.qty}{' '}
                    </span>
                    <span>
                      CT Time : {currentDataMachine && currentDataMachine.ct}{' '}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={` ${
              currentDataMachine.length === 0
                ? ''
                : currentDataMachine.status_yellow === false
                ? currentDataMachine.status_green === false &&
                  currentDataMachine.status_red === false
                  ? ''
                  : 'd-none'
                : ''
            } row text-white p-0 g-2`}
          >
            <div className="col-6  ">
              <button
                disabled={currentDataMachine.category}
                onClick={() =>
                  setFormDandori((prevData) => {
                    return { ...prevData, status: !prevData.status };
                  })
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
            {/*       <div
              className={` col-6  ${formDandori.status === true && 'd-none'} `}
            >
              <button
                disabled={
                  currentDataMachine.length === 0 ||
                  currentDataMachine === null ||
                  (currentDataMachine.category &&
                    currentDataMachine.category !== 'RM-01')
                }
                onClick={() => handleProblemNonMachine('RM-01')}
                className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex"
              >
                RM A Habis
              </button>
            </div>

            <div
              className={` col-6  ${formDandori.status === true && 'd-none'} `}
            >
              <button
                disabled={
                  currentDataMachine.length === 0 ||
                  currentDataMachine === null ||
                  (currentDataMachine.category &&
                    currentDataMachine.category !== 'RM-02')
                }
                onClick={() => handleProblemNonMachine('RM-02')}
                className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex"
              >
                RM B Habis
              </button>
            </div>
            <div
              className={` col-6  ${formDandori.status === true && 'd-none'} `}
            >
              <button
                disabled={
                  currentDataMachine.length === 0 ||
                  currentDataMachine === null ||
                  (currentDataMachine.category &&
                    currentDataMachine.category !== 'MP-03')
                }
                onClick={() => handleProblemNonMachine('MP-03')}
                className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex"
              >
                MP Pergi
              </button>
            </div> */}

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
                      value={process.env.REACT_APP_DEFAULT_MACHINE_CODE}
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
                      value={process.env.REACT_APP_DEFAULT_MACHINE_NAME}
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
                                    labelKey={"part_no"}
                                    id={(e) => (e[0] != null && e[0].id != null ? e[0].id : null)}
                                    onChange={(e) =>
                                      setFormDandori((prevData) => {
                                        return {
                                          ...prevData,
                                          part_no:  e[0] != null && e[0].part_no != null ? e[0].part_no : '',
                                          part_name:  e[0] != null && e[0].part_name != null ? e[0].part_name : '',
                                          ct:  e[0] != null && e[0].ct != null ? e[0].ct : '',
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
                                        formDandori.ct
                                          ? formDandori.ct
                                          : ''
                                      }
                                      disabled
                                 
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
          <div
            className={` ${
              currentDataMachine.length === 0 ||
              currentDataMachine.status_red === false
                ? 'd-none'
                : ''
            } row text-white p-0 g-2`}
          >
            {dataSubCategoryPm.map((item, index) => (
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
                  onClick={() => handleProblemMachine(item)}
                  className=" col-md-12 btn  btn-danger text-white p-3 align-items-center justify-content-center d-flex"
                >
                  {item.name}
                </button>
              </div>
            ))}
            <div
              className={` mt-4 col-12 ${
                formDandori.status === false && 'd-none'
              } `}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProductionDisplay;
