import React, { useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import { Typeahead } from 'react-bootstrap-typeahead';
import { DataKanban, DataProduct, DataSloc, DataWarehouse } from 'src/config/GetDataApi';
import { cilFilter, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getUrlKanban, getUrlSloc } from 'src/config/Api';
import axios from 'axios';

const MasterKanban = () => {
  const products = DataProduct();
  const slocs = DataSloc();
  const warehouses = DataWarehouse()
  const kanbans = DataKanban()

  const [qrValue, setQRValue] = useState('');
  const [dataQrCode, setDataQrCode] = useState([]);
  const [profuctFiltered, setProductFiltered] = useState([])

  const [editQrCode, setEditQrCode] = useState(false);
  const [dataFormQrCode, setDataFromQrCode] = useState([]);
  const [search, setSearch] = useState('');

  const pdf = new jsPDF();
  const qrCodeRef = useRef(null);
  const refPartCode = useRef(null);

  const refForm = useRef(null)
  const refTo = useRef(null)

  const handleCreateQrCode = async (e) => {
    e.preventDefault();
    try {
      const qrValue = `${dataQrCode.part_name && dataQrCode.part_name}|${
        dataQrCode.part_no && dataQrCode.part_no
      }|${dataQrCode.qty && dataQrCode.qty}|${
        dataQrCode.from && dataQrCode.from
      }|${dataQrCode.to && dataQrCode.to}`;

      const response = await axios.post(getUrlKanban, {
        part_name: dataQrCode.part_name,
        part_code: dataQrCode.part_code,
        qty: dataQrCode.qty,
        from: dataQrCode.from,
        to: dataQrCode.to,
      });
      setQRValue(response.response);
      refPartCode.current.clear();
      refTo.current.clear();
      setDataQrCode([]);
      setQRValue('');
      refForm.current.clear(); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFromQrCode = () => {
    refPartCode.current.clear();
    refTo.current.clear();
     setDataQrCode([]);
    setQRValue('');
    refForm.current.clear(); 
  };

  const handQrCodeById = async (item) => {
    try {
      setEditQrCode(true);
      setDataFromQrCode({
        part_no: item.part_no,
        part_name: item.part_name,
        qty: item.qty,
        id: item.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSloc = async (id) => {
    try {
      await axios.delete(`${getUrlKanban}?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  
  const [cekForm, setCekForm] = useState(false)
  const handleFilterProduct = (e) => {
    if(cekForm ){
      refPartCode.current.clear();
    refTo.current.clear();
     setDataQrCode([]);
    setQRValue('');
      setCekForm(false)
    }else{
      const cekExitProduct = products.filter(product =>
        warehouses.filter(warehouse => warehouse.sloc_code.includes(e))
                  .map(filteredWarehouse => filteredWarehouse.part_code)
                  .some(result => String(result.part_code).includes(String(product.no)))
      );
      setCekForm(true)
         setProductFiltered(cekExitProduct)
        }
    }
  


  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className=" col-12 ">
         
          <form onSubmit={handleCreateQrCode} className="row g-1">
            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  From
                </label>
                <div className="col-sm-8">
                  <div className="d-flex">
                    <Typeahead
                      options={slocs}
                      ref={refForm}
                      labelKey={'code'}
                      className="form-control border-0 form-control-sm p-0 "
                      placeholder="Sloc Code"
                      onChange={(e) => handleFilterProduct(e[0] && e[0].code ? e[0].code : '') & setDataQrCode((prevData) => {
                        return {
                          ...prevData,
                          from: e[0] && e[0].code ? e[0].code : '',
                        };
                      })
                   }
                    />
                    <input
                      value={
                        dataQrCode.from
                          ? slocs.find(
                              (item) =>
                                String(item.code) === String(dataQrCode.from),
                            )?.name
                          : ''
                      }
                      disabled
                      type="Text"
                      className="form-control form-control-sm"
                      id=""
                      placeholder="Sloc Name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 ">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Part Code 
                </label>
                <div className="col-sm-8">
                  <Typeahead
                    options={profuctFiltered}
                    ref={refPartCode}
                    labelKey={'part_no'}
                    disabled={!dataQrCode.from }
                    className="form-control border-0 form-control-sm p-0 "
                    placeholder="Part Code"
                    required
                    onChange={(e) =>
                      setDataQrCode((prevData) => {
                        return {
                          ...prevData,
                          part_code: e[0] && e[0].part_no ? e[0].part_no : '',
                          part_name:
                            e[0] && e[0].part_no
                              ? products.find(
                                  (item) =>
                                    parseInt(item.part_no) ===
                                    parseInt(e[0].part_no),
                                )?.part_name
                              : '',
                        };
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Part Name
                </label>
                <div className="col-sm-8">
                  <input
                    value={dataQrCode.part_name ? dataQrCode.part_name :''}
                    onChange={(e) =>
                      setDataQrCode((prevData) => {
                        return { ...prevData, part_name: e.target.value };
                      })
                    }
                    disabled
                    className="form-control form-control-sm"
                    id=""
                    placeholder="Part Name"
                  />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Qty
                </label>
                <div className="col-sm-8">
                  <div className="d-flex flex-column">
                    <div className="col-12 mb-2">
                      <span className=" fs-6">
                        Qty Available :{' '}
                        <span
                          className={`badge ${
                            !dataQrCode.part_code
                              ? 'bg-secondary'
                              : 'bg-success'
                          }  `}
                        >
                          {dataQrCode.part_code
                            ? products.find(
                                (item) =>
                                  parseInt(item.part_no) ===
                                  parseInt(dataQrCode.part_code),
                              )?.qty
                            : '0'}
                        </span>
                      </span>
                    </div>
                    <input
                      value={dataQrCode.qty ? dataQrCode.qty : ''}
                      onChange={(e) =>
                        setDataQrCode((prevData) => {
                          return { ...prevData, qty: e.target.value };
                        })
                      }
                      required
                      disabled={!dataQrCode.part_code}
                      type="number"
                      max={
                        dataQrCode.part_code
                          ? products.find(
                              (item) =>
                                String(item.part_no) ===
                                String(dataQrCode.part_code),
                            )?.qty
                          : '0'
                      }
                      className="form-control form-control-sm"
                      id=""
                      placeholder="Qty For Qr Code"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  To
                </label>
                <div className="col-sm-8">
                  <div className="d-flex">
                    <Typeahead
                      options={slocs}
                      labelKey={'code'}
                      className="form-control border-0 form-control-sm p-0 "
                      placeholder="Sloc Code"
                      ref={refTo}
                    disabled={!dataQrCode.from }

                      onChange={(e) =>
                        setDataQrCode((prevData) => {
                          return {
                            ...prevData,
                            to: e[0] && e[0].code ? e[0].code : '',
                          };
                        })
                      }
                    />
                    <input
                      value={
                        dataQrCode.to
                          ? slocs.find(
                              (item) =>
                                String(item.code) === String(dataQrCode.to),
                            )?.name
                          : ''
                      }
                      disabled
                      type="Text"
                      className="form-control form-control-sm"
                      id=""
                      placeholder="Sloc Name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-evenly">
                <span
                  onClick={handleClearFromQrCode}
                  className="btn col-sm-4 btn-danger text-white btn-sm"
                >
                  clear
                </span>
                <button
                  type="submit"
                  disabled={
                    !dataQrCode.part_name ||
                    !dataQrCode.part_code ||
                    !dataQrCode.qty ||
                    !dataQrCode.to ||
                    !dataQrCode.from

                  }
                  className="btn col-sm-4 btn-success text-white btn-sm"
                >
                  Create Qr Code
                </button>
              </div>
            </div>
          </form>
        </div>

        {/*  <div className="col-5 row justify-content-center  ">
          <div className="col-12 text-center mb-3">
            <span className="fw-bold fs-4">Render Kanban</span>
          </div>
          <div className="border border-5 border-dark   col-7  h-75 ">
            {qrValue && (
              <QRCodeCanvas
                value={qrValue}
                ref={qrCodeRef}
                className="h-100 w-100 py-2"
              />
            )}
          </div>
          <div className='col-12 mt-2 d-flex flex-column justify-content-evenly'>
                <span className='btn btn-success btn-sm text-white'>Print Kanban </span>
            </div>
        </div> */}

        <div className="col-12">
          <hr />
          <div className="col-md-12">
            <div className="row">
              <div className="col-1  d-flex align-items-center justify-content-center ">
                <div className="col-3">
                  <div className="d-flex justify-content-center align-items-center ">
                    <span className="btn btn-warning fw-bold">
                      <CIcon icon={cilFilter} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-4 ms-auto">
                <input
                  type="text"
                  value={search && search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control "
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
          <div className="table-responsive mt-2">
            <table className="table table-sm text-center align-middle">
              <thead>
                <tr className="text-center">
                  <th scope="col">No</th>
                  <th scope="col">Part Name</th>
                  <th scope="col">Part No</th>
                  <th scope="col">qty</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  kanbans.map((item,index) => 
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{item.part_name} </td>
                      <td>{item.part_code} </td>
                      <td>{item.qty} </td>
                      <td>{item.from} </td>
                      <td>{item.to} </td>
                      
                      <td style={{ width: '150px' }}>
                        <span
                          /* onClick={() => handleDeleteSloc(item.id)} */ className="btn btn-danger text-white"
                        >
                          <CIcon icon={cilTrash} />
                        </span>
                        <span
                          /* onClick={() => handQrCodeById(item)} */ className="btn btn-success text-white ms-3"
                        >
                          <CIcon icon={cilPencil} />
                        </span>
                      </td>
                    </tr>
                    )
                }
              
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MasterKanban;
