import { cilCheck, cilFilter } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import React, { Component, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { getUrlDn } from 'src/config/Api';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
class PrintDN extends Component {
  render() {
    const { data } = this.props;
    JsBarcode('#barcode', data && data.dn_number, {
      height: 30,
    });

    return (
      <div
        className="py-3 bg-white "
        style={{
          color: 'black',
          position: 'relative',
        }} /* style={{position : 'relative'}} */
      >
        <div className="d-flex flex-wrap px-2">
          <div className=" col-8 text-center fw-bold">
            <span style={{ fontSize: '2rem' }}>Delivery Note</span>
          </div>
          <div className="col-4 mb-3">
            <div className="ms-auto col-12 ">
              <svg id="barcode"></svg>
            </div>
          </div>
          <div
            className="col-12 d-flex align-items-center flex-wrap"
            style={{ lineHeight: 1.2, fontSize: '0.8rem' }}
          >
            <div className="col-4 container p-1 ">
              <div className="d-flex flex-wrap">
                <div className="col-12 row">
                  <span className="col-6">Vendor Code</span>
                  <span className="col-6"> : ..... </span>
                </div>
                <div className="col-12 row">
                  <span className="col-6">Vendor Name</span>
                  <span className="col-6"> : ..... </span>
                </div>
                <div className="col-12 row">
                  <span className="col-6">Vendor Size</span>
                  <span className="col-6"> : ..... </span>
                </div>
              </div>
            </div>
            <div className="col-4 container p-1 ">
              <div className="d-flex flex-wrap">
                <div className="col-12 row">
                  <span className="col-6">Transporter</span>
                  <span className="col-6"> : ..... </span>
                </div>
                <div className="col-12 row">
                  <span className="col-6">Group Route</span>
                  <span className="col-6"> : ..... </span>
                </div>
              </div>
            </div>
            <div className="col-4 p-1  d-flex justify-content-center">
              <QRCodeSVG
                value={data && data.dn_number}
                style={{
                  width: '6rem',
                  height: '6rem',
                  padding: '2px',
                  border: 'solid black 2px',
                }}
              />
            </div>
          </div>
          <div
            className="col-12 d-flex mb-3 align-items-center flex-wrap"
            style={{ lineHeight: 1.2, fontSize: '0.8rem' }}
          >
            <div className="col-4  container p-1 ">
              <div className="d-flex flex-wrap">
                <div className="col-12 mb-3 fw-bold">
                  <span>ORDER</span>
                </div>
                <div className="col-12 row">
                  <span className="col-6">Date</span>
                  <span className="col-6"> : ..... </span>
                </div>
                <div className="col-12 row">
                  <span className="col-6">Line No</span>
                  <span className="col-6"> : ..... </span>
                </div>
                <div className="col-12 row">
                  <span className="col-6">Delivery / Day</span>
                  <span className="col-6"> : ..... </span>
                </div>
                <div className="col-12 row">
                  <span className="col-6">Category</span>
                  <span className="col-6"> : ..... </span>
                </div>
              </div>
            </div>
            <div className="col-8 container p-1 d-flex flex-wrap ">
              <div className="col-12 mb-3 fw-bold">
                <span>Delivery</span>
              </div>
              <div className="col-6">
                <div className="d-flex flex-wrap">
                  <div className="col-12 row">
                    <span className="col-6">Shop</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                  <div className="col-12 row">
                    <span className="col-6">Date</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                  <div className="col-12 row">
                    <span className="col-6">Del Cycle</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                  <div className="col-12 row">
                    <span className="col-6">Plant Site</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                  <div className="col-12 row">
                    <span className="col-6">Parking No</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex flex-wrap">
                  <div className="col-12 row">
                    <span className="col-6">DN No</span>
                    <span className="col-6"> : {data && data.dn_number} </span>
                  </div>
                  <div className="col-12 row">
                    <span className="col-6">Page</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                  <div className="col-12 row">
                    <span className="col-6">PO No</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                  <div className="col-12 row">
                    <span className="col-6">Total Kanban</span>
                    <span className="col-6"> : ..... </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive col-12">
            <table
              className="table table-sm table-bordered  "
              style={{ fontSize: '0.7rem' }}
            >
              <thead>
                <tr className=" text-center align-middle">
                  <th scope="col">No</th>
                  <th scope="col">Material No</th>
                  <th scope="col">Job No</th>
                  <th scope="col">Material Name</th>
                  <th scope="col">Qty Box</th>
                  <th scope="col">Total Kanban</th>
                  <th scope="col">Total Qty</th>
                  <th
                    colSpan="3"
                    className="p-0"
                    style={{ background: '#07757C' }}
                  >
                    <span>Confiration Check</span>

                    <div className=" col-12  d-flex">
                      <div
                        style={{ width: '5rem' }}
                        className="border border-start-0 border-bottom-0"
                      >
                        Vendor
                      </div>
                      <div
                        style={{ width: '5rem' }}
                        className="border border-bottom-0"
                      >
                        Log Partner
                      </div>
                      <div
                        style={{ width: '5rem' }}
                        className="border border-end-0 border-bottom-0"
                      >
                        ADM
                      </div>
                    </div>
                  </th>

                  <th scope="col">Remark</th>
                  {/*   */}
                </tr>
              </thead>
              <tbody>
                {data.material_amount &&
                  Object.values(data.material_amount).map((item, index) => {
                    if (item.material_no) {
                      return (
                        <tr key={index}>
                          <th scope="row" className="text-center">
                            {' '}
                            {index + 1}
                          </th>
                          <td>{item.material_no}</td>
                          <td>Otto</td>
                          <td style={{ maxWidth: '5rem' }}>
                            {item.material_name}
                          </td>
                          <td style={{ width: '3rem' }} className="text-center">
                            {item.qty}
                          </td>
                          <td style={{ width: '3rem' }} className="text-center">
                            {item.jumlah_dn}
                          </td>
                          <td>
                            {parseInt(item.qty) * parseInt(item.jumlah_dn)}
                          </td>
                          <td style={{ width: '5rem' }}>{item.vendor}</td>
                          <td style={{ width: '5rem' }}>@mdo</td>
                          <td style={{ width: '5rem' }}>@mdo</td>
                          <td>@mdo</td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
          <div
            className=" mt-3 d-flex flex-wrap "
            style={{
              fontSize: '0.8rem',
              bottom: '0rem',
              zIndex: -1,
              left: '27rem',
              position: 'fixed',
            }}
          >
            <div className=" col-3 d-flex ms-auto flex-wrap ">
              <span className="col-12 text-center mb-2 fw-bold ">SUPPLIER</span>
              <div className="col-12 d-flex flex-wrap">
                <div className="text-center col-6 d-flex px-2 flex-column">
                  <span className="fw-bold" style={{ marginBottom: '2.5rem' }}>
                    Approved
                  </span>
                  <hr />
                </div>
                <div className="text-center col-6 d-flex px-2 flex-column">
                  <span className="fw-bold" style={{ marginBottom: '2.5rem' }}>
                    Prepared
                  </span>
                  <hr />
                </div>
              </div>
            </div>
            <div className=" col-3 d-flex flex-wrap ">
              <span className="col-12 text-center mb-2 fw-bold ">
                TRANSPORER
              </span>
              <div className="col-12 d-flex flex-wrap">
                <div className="text-center col-6 d-flex px-2 flex-column">
                  <span className="fw-bold" style={{ marginBottom: '2.5rem' }}>
                    Approved
                  </span>
                  <hr />
                </div>
                <div className="text-center col-6 d-flex px-2 flex-column">
                  <span className="fw-bold" style={{ marginBottom: '2.5rem' }}>
                    Prepared
                  </span>
                  <hr />
                </div>
              </div>
            </div>
            <div className=" col-3 d-flex flex-wrap ">
              <span className="col-12 text-center mb-2 fw-bold ">PT. ADM</span>
              <div className="col-12 d-flex flex-wrap">
                <div className="text-center col-6 d-flex px-2 flex-column">
                  <span className="fw-bold" style={{ marginBottom: '2.5rem' }}>
                    Approved
                  </span>
                  <hr />
                </div>
                <div className="text-center col-6 d-flex px-2 flex-column">
                  <span className="fw-bold" style={{ marginBottom: '2.5rem' }}>
                    Prepared
                  </span>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const DeliveryNote = () => {
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');
  const [dataDn, setDataDn] = useState([]);

  useEffect(() => {
    const bagInterval = [];
    const dataInterval = setInterval(() => {
      getDataDn();
    }, 1000);
    bagInterval.push(dataInterval);

    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  });

  const getDataDn = async () => {
    try {
      const response = await axios.get(getUrlDn);
      const data = response.data;

      let aggregatedData = {};

      data.forEach((item) => {
        if (!aggregatedData[item.field_1]) {
          aggregatedData[item.field_1] = {
            dn_number: item.field_1,
            material_amount: {
              [item.field_86]: {
                material_no: item.field_86,
                material_name: item.field_23,
                qty: item.field_18,
                jumlah_dn: 1,
                vendor: item.field_22,
              },
            },
            qty: item.field_18,
          };
        } else {
          aggregatedData[item.field_1].qty =
            parseInt(aggregatedData[item.field_1].qty, 10) +
            parseInt(item.field_18, 10);

          if (aggregatedData[item.field_1].material_amount[item.field_86]) {
            aggregatedData[item.field_1].material_amount[item.field_86].qty +=
              item.field_18;
            aggregatedData[item.field_1].material_amount[
              item.field_86
            ].jumlah_dn += 1;
          } else {
            aggregatedData[item.field_1].material_amount[item.field_86] = {
              material_no: item.field_86,
              qty: item.field_18,
              jumlah_dn: 1,
            };
          }
        }
      });
      setDataDn(Object.values(aggregatedData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post(getUrlDn, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const printDnRef = useRef();
  const [dataPrintDN, setDataprintDn] = useState([]);
  const [dislayPrint, setDisplayPrint] = useState(false);
  const handlePrintDn = (e) => {
    setDisplayPrint(true);
    setDataprintDn(e);
  };
  const handleClosePrintDn = () => {
    setDisplayPrint(false);
    setDataprintDn([]);

  };

  return (
    <div className="container-fluid pb-4">
      <form onSubmit={handleSubmit} className="row g-2">
        <span className="text-danger fw-bold">
          Upload Data Delivery with file
        </span>
        <div className="col-3">
          <input
            type="file"
            className="form-control"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button className="btn btn-success col-1 text-white" type="submit">
          Upload
        </button>
      </form>
      <hr />

      <div className="col-md-12 mb-3">
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
        className={`${
          dislayPrint === true && 'd-none'
        } table-responsive mt-2 text-center bg-white`}
        style={{ height: '70vh' }}
      >
        <table className="table table-sm align-middle">
          <thead>
            <tr className="text-center">
              <th scope="col">No</th>
              <th scope="col">DN Number</th>
              {/*  <th scope="col">Material Amount</th> */}
              <th scope="col">Total Qty</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataDn
              .filter((item) => item.dn_number.includes(search))

              .map((item, index) => (
                <tr key={item.id}>
                  <td> {index + 1} </td>
                  <td> {item.dn_number} </td>
                  {/*               <td>
                    {' '}
                    {Object.values(item.material_amount).map(
                      ((item,index) => {

                      if(item.material_no) {
return (
    <div key={index}>
      Material Code : {item.material_no} | qty : {item.qty} | jumlah_dn : {item.jumlah_dn}
    </div>
)
                      }
                    }

                       )
                    )}
                  </td> */}
                  <td> {item.qty} </td>
                  <td>
                    {' '}
                    <span
                      onClick={() => handlePrintDn(item)}
                      className="btn btn-success text-white ms-3"
                    >
                      <CIcon icon={cilCheck} />
                    </span>{' '}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className={`${dislayPrint === false && 'd-none'} `}>
        <PrintDN ref={printDnRef} data={dataPrintDN} />
<div className='d-flex mt-1'>

        <div className="p-2">
          <ReactToPrint
            content={() => printDnRef.current}
            documentTitle="Delivery Note"
            removeAfterPrint
            trigger={() => {
              return <button className="btn btn-primary ">Print</button>;
            }}
          />
        </div>
        <div className='p-2'>
          <button onClick={handleClosePrintDn} className='btn btn-danger text-white'>Cancel</button>
        </div>
</div>

      </div>
    </div>
  );
};

export default DeliveryNote;

PrintDN.propTypes = {
  data: PropTypes.array,
};
