import { CCard } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Lampu_andon } from 'src/components/my component/MyIcon';

const Production = () => {
  const [machine, setMachine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonAndon, setButtonAndon] = useState({
    red: false,
    yellow: false,
    output: false,
    product: 'off',
  });

  const [displayModalAndon, setDisplayModalAndon] = useState({
    yellow : false,
    red :false
  })

  
  const [dataProductMachine, setDataProductMachine] = useState([])
  const [dandori, setDandori] = useState({
    dandori : false,
  })

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleLightYellow = () => {

    setDisplayModalAndon(prevData => {
      return { ...prevData, yellow : true, red: false}
    })
  };
  const handleLightRed = () => {
 
      setDisplayModalAndon(prevData => {
        return { ...prevData, red : true, yellow:false}
      })
  
  };

  const handleMachine = () => {
    try {
      if (machine.status && machine.status === 'off' || !machine.status) {
        setMachine((prevData) => {
          return { ...prevData, status: 'on' };
        });
        setButtonAndon((prevData) => {
          return { ...prevData, yellow: true };
        });
      } else {

        setMachine((prevData) => {
          return { ...prevData, status: 'off' };
        });
        setButtonAndon((prevData) => {
          return { ...prevData, yellow: false,red: false,output:false,product: "off" };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const handleDandori = () => {
    if(!dandori.dandori){

      setDandori(prevData => {return {...prevData , dandori : true}})
    }else{
      setDandori(prevData => {return {...prevData , dandori : false}})
      
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
                  <Lampu_andon extra={10} />
                </div>
                <div className="g-2 row col-md-6  pt-0 ms-2">
                  <div className="  ">
                    <button
                      disabled={
                        machine.status !== 'on' || buttonAndon.product === 'off' || dataProductMachine.length === 0 || buttonAndon.red === true || buttonAndon.yellow === true
                      }
                      className="btn  btn-sm text-white fw-bold col-12 btn-secondary"
                    >
                      Output Product {buttonAndon.product}
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
                        machine.status !== 'on' || buttonAndon.product === 'off' || dataProductMachine.length === 0
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
                      <span>Target :</span>
                      <span>Plan :</span>
                      <span>Actual :</span>
                      <span>Belance :</span>
                      <span>Performance (%) :</span>
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
                            <span>Part No :</span>
                            <span>Part name : </span>
                            <span>Target QTY : </span>
                            <span>CT Time : </span>
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

        {/* start modal button andon */}
        <div
          className="modal fade"
          id="modalButtonAndon"
          tabIndex="-1"
          aria-labelledby="modalButtonAndonLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content ">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="modalButtonAndonLabel">
                  
                  {displayModalAndon.yellow ? "Problem Non Machine"  : displayModalAndon.red && "Problem Machine"  }

                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/*  */}
                  <div className={` ${!displayModalAndon.yellow && "d-none"} col-md-12 rounded  p-1   `}>
                    <div className=" col-md-12">
                      <div className=" p-2 ">
                        <div className=" d-flex flex-column ">
                          <div className="row text-white p-0 g-2">
                            <div className="col-6  ">
                              <button onClick={handleDandori} className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex">
                                Dandori
                              </button>
                            </div>
                            <div className={ ` col-6  ${dandori.dandori=== true && "d-none"} `} >
                              <button disabled={dataProductMachine.length === 0} className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex">
                                RM A Habis
                              </button>
                            </div>
                            <div className={ ` col-6  ${dandori.dandori=== true && "d-none"} `} >
                              <button disabled={dataProductMachine.length === 0} className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex">
                                RM B Habis
                              </button>
                            </div>
                            <div className={ ` col-6  ${dandori.dandori=== true && "d-none"} `} >
                              <button disabled={dataProductMachine.length === 0} className=" col-md-12 btn  btn-warning text-white p-3 align-items-center justify-content-center d-flex">
                                MP Pergi
                              </button>
                            </div>
                            <div className={ ` mt-4 col-12 ${dandori.dandori=== false && "d-none"} `} >
                             
                                <form action="" className='text-dark' style={{fontSize: "14px"}}>
                                <div className="row mb-3 justify-content-center">
                                    <label  className="col-sm-3 col-form-label">Part No</label>
                                    <div className="col-sm-6">
                                      <input type="text" className="form-control form-control-sm" />
                                    </div>
                                  </div>
                                <div className="row mb-3 justify-content-center">
                                    <label  className="col-sm-3 col-form-label">Part Name</label>
                                    <div className="col-sm-6">
                                      <input type="text" className="form-control form-control-sm" />
                                    </div>
                                  </div>
                                <div className="row mb-3 justify-content-center">
                                    <label  className="col-sm-3 col-form-label">Target QTY</label>
                                    <div className="col-sm-6">
                                      <input type="number" className="form-control form-control-sm" />
                                    </div>
                                  </div>
                                <div className="row mb-3 justify-content-center">
                                    <label  className="col-sm-3 col-form-label">CT Time</label>
                                    <div className="col-sm-6">
                                      <input type="text" className="form-control form-control-sm" />
                                    </div>
                                  </div>
                                  <div className='text-center'>
                                    <button className='btn btn-sm btn-success text-white'>Submit</button>
                                  </div>
                                </form>
                            </div>
                          
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={` ${!displayModalAndon.red && "d-none"} col-md-12 rounded  p-1   `}>
                    <div className=" col-md-12">
                      <div className=" p-2 ">
                        <div className=" d-flex flex-column ">
                          <div className="row text-white p-0 g-2">
                            <div className="col-6  ">
                              <button className=" col-md-12 btn  btn-danger text-white p-3 align-items-center justify-content-center d-flex">
                                Problem Blade
                              </button>
                            </div>
                            <div className="col-6  ">
                              <button className=" col-md-12 btn  btn-danger text-white p-3 align-items-center justify-content-center d-flex">
                                Problem Stoper
                              </button>
                            </div>
                            <div className="col-6  ">
                              <button className=" col-md-12 btn  btn-danger text-white p-3 align-items-center justify-content-center d-flex">
                                Problem Rotor
                              </button>
                            </div>
                            <div className="col-6  ">
                              <button className=" col-md-12 btn  btn-danger text-white p-3 align-items-center justify-content-center d-flex">
                                Problem Rotor
                              </button>
                            </div>
                          
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
