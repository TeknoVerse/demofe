import React, { Component, useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  DataKanban,
  DataProduct,
  DataSloc,
  DataWarehouse,
} from 'src/config/GetDataApi';
import { cilCheck, cilFilter, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getUrlKanban, getUrlSloc } from 'src/config/Api';
import ReactToPrint from 'react-to-print';
import axios from 'axios';
import './cssPrintKanban.css';
import PropTypes from 'prop-types';

class PrintContent extends Component {
  render() {
    const { kanbanById, qrValue, qrCodeRef, kanbanRef,amount } = this.props;

    let currentAmount = 1
    if(amount){
      currentAmount = amount
    }
    const newData = []

    for (let index = 0; index < currentAmount; index++) {
      newData.push (
        <div className="col-6">
        <div className="p-2 print-content  border border-3 ">
          <div className="col-12 d-flex  justify-content-between">
            <div className="text-start " ref={kanbanRef}>
              <ul className="text-decoration-none">
                <li>Part No : {kanbanById.part_code} </li>
                <li>Part Name : {kanbanById.part_name} </li>
                <li>Qty : {kanbanById.qty} </li>
                <li>From : {kanbanById.from} </li>
                <li>To : {kanbanById.to} </li>
              </ul>
            </div>
            <div
              className="border border-dark border-5  col-6 "
              style={{
                height: '150px',
                width: '150px',
                margin: '0px',
                padding: '10px',
              }}
              ref={qrCodeRef}
            >
              {qrValue && (
                <QRCodeSVG
                  value={qrValue}
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '0px',
                    margin: '0px',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      )
      
    }

    return (
      <div className="contianer-fluid p-0 m-0">
        <div className="row g-2 p-1">
        {newData}
         
        </div>
        {/*  <div className="col-12  ">
      <div className="row">
        <div className="fw-bold fs-7 col-4   d-flex flex-column justify-content-center">
          PT. Tekno Digital Nusantara
        </div>
        <div className="col-1">
          <div
            className=" bg-dark"
            style={{ width: '3px', height: '100%' }}
          ></div>
        </div>
        <div className="fw-bold fs-7 col-7 text-center  d-flex flex-column justify-content-center  ">
          Kanban Warehouse
        </div>

        <div className="col-12">
          <hr
            className="mt-2 mb-1 col-12"
            style={{ border: '1px solid black' }}
          />
        </div>
        <div className="col-2">Part No :</div>
        <div className="col-1">
          <div
            className=" bg-dark"
            style={{ width: '3px', height: '100%' }}
          ></div>
        </div>
        <div className="col-8 text-center">
          <span className="fw-bold fs-1">12487G-HU</span>
        </div>
      </div>
    </div> */}
      </div>
    );
  }
}

const MasterKanban = () => {
  const [amountPrint, seAmountPrint] = useState(1)
  const products = DataProduct();
  const slocs = DataSloc();
  const warehouses = DataWarehouse();
  const kanbans = DataKanban();

  const [qrValue, setQRValue] = useState([]);
  const [dataQrCode, setDataQrCode] = useState([]);
  const [profuctFiltered, setProductFiltered] = useState([]);

  const [editQrCode, setEditQrCode] = useState(false);
  const [dataFormQrCode, setDataFromQrCode] = useState([]);
  const [search, setSearch] = useState('');

  const pdf = new jsPDF();
  const refPartCode = useRef(null);

  const refForm = useRef(null);
  const refTo = useRef(null);

  const handleCreateQrCode = async (e) => {
    e.preventDefault();
    try {
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

  const [cekForm, setCekForm] = useState(false);
  const handleFilterProduct = (e) => {
    if (cekForm) {
      refPartCode.current.clear();
      refTo.current.clear();
      setDataQrCode([]);
      setQRValue('');
      setCekForm(false);
    } else {
      /*  const cekExitProduct = products.filter((product) =>
        warehouses
          .filter((warehouse) => warehouse.sloc_code.includes(e))
          .map((filteredWarehouse) => filteredWarehouse.part_code)
          .some((result) =>
            String(result.part_code).includes(String(product.no)),
          ),
      ); */

      const getProductInWarehouse = warehouses.filter((warehouse) =>
        warehouse.sloc_code.toLowerCase().includes(e.toLowerCase()),
      );
      setCekForm(true);
      setProductFiltered(getProductInWarehouse);
    }
  };

  const [kanbanById, setKanbanById] = useState([]);
  const handlePreviewKanban = (item) => {
    setQRValue(
      `${item.part_name}|${item.part_code}|${item.qty}|${item.from}|${item.to}`,
    );
    setKanbanById(item);
  };

  const handleClosePreviewKanban = () => {
    setQRValue([]);
    setKanbanById([]);
  };

  const kanbanRef = useRef();
  const qrCodeRef = useRef();


  const componentPrintRef = useRef();

  const [mountPage, setMountPage] = useState();

  return (
    <div className="container-fluid body-kanban" style={{}}>
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
                      onChange={(e) =>
                        handleFilterProduct(
                          e[0] && e[0].code ? e[0].code : '',
                        ) &
                        setDataQrCode((prevData) => {
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
                    labelKey={'part_code'}
                    disabled={!dataQrCode.from}
                    className="form-control border-0 form-control-sm p-0 "
                    placeholder="Part Code"
                    required
                    onChange={(e) =>
                      setDataQrCode((prevData) => {
                        return {
                          ...prevData,
                          part_code:
                            e[0] && e[0].part_code ? e[0].part_code : '',
                          part_name:
                            e[0] && e[0].part_code
                              ? products.find(
                                  (item) =>
                                    parseInt(item.part_no) ===
                                    parseInt(e[0].part_code),
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
                    value={dataQrCode.part_name ? dataQrCode.part_name : ''}
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
                        Qty Available :
                        <span
                          className={`badge ${
                            !dataQrCode.part_code
                              ? 'bg-secondary'
                              : 'bg-success'
                          }  `}
                        >
                          {dataQrCode.part_code
                            ? warehouses.find(
                                (warehouse) =>
                                  parseInt(warehouse.part_code) ===
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
                          ? warehouses.find(
                              (warehouse) =>
                                parseInt(warehouse.part_code) ===
                                parseInt(dataQrCode.part_code),
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
                      disabled={!dataQrCode.from}
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
          <div
            className="table-responsive mt-2 bg-white mb-5"
            style={{ height: '50vh' }}
          >
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
                {kanbans.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
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
                        data-bs-toggle="modal"
                        data-bs-target="#detailKanban"
                        onClick={() => handlePreviewKanban(item)}
                        className="btn btn-success text-white ms-3"
                      >
                        <CIcon icon={cilCheck} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="detailKanban"
        tabIndex="-1"
        aria-labelledby="detailKanbanLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="detailKanbanLabel">
                Preview Kanban
              </h1>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* start kanban */}
                <div></div>

                <div className="col-12">
                  <PrintContent
                    ref={componentPrintRef}
                    kanbanById={kanbanById}
                    qrValue={qrValue}
                    amount={amountPrint}
                  />
                </div>
                {/* end kanban */}

                {/* start button print kanban */}
                <div className="col-4 mt-3">
                  <div className="d-flex">
            
                  </div>
                </div>
                {/* end button print kanban */}
              </div>
            </div>
            
            <div className="modal-footer">
            <div className="row mb-3">
    <label  className="col-sm-4 col-form-label">Amount</label>
    <div className="col-sm-8">
      <input type="number" onChange={e => seAmountPrint(e.target.value) }  className="form-control" />
    </div>
  </div>

            <ReactToPrint
                      content={() => componentPrintRef.current}
                      documentTitle="Kanban Warehouse"
                      removeAfterPrint
                      trigger={() => {
                        return (
                          <button
                            onClick={() => setMountPage(4)}
                            className="btn btn-primary"
                          >
                            Print{' '}
                          </button>
                        );
                      }}
                    />
              <button
                type="button"
                className="btn btn-danger text-white"
                data-bs-dismiss="modal"
                onClick={handleClosePreviewKanban}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MasterKanban;

PrintContent.propTypes = {
  kanbanById: PropTypes.array,
  qrValue: PropTypes.array,
  qrCodeRef: PropTypes.object,
  kanbanRef: PropTypes.object,
  amount: PropTypes.number,
};
