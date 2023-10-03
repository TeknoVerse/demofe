import { cilCheck, cilFilter } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getUrlDn } from 'src/config/Api';

const DeliveryNote = () => {
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');
  const [dataDn, setDataDn] = useState([]);


  useEffect(() => {
    const bagInterval = []
    const dataInterval = setInterval(() => {
        getDataDn()
    }, 1000);
    bagInterval.push(dataInterval)
    
    return () => {
      bagInterval.forEach(data => {
          clearInterval(data)
      });
    }
  })

  const getDataDn = async () => {
    try {
      const response = await axios.get(getUrlDn)
      const data = response.data
      
 
      const aggregatedData = {};

      data.forEach(item => {
        if (!aggregatedData[item.field_1]) {
          aggregatedData[item.field_1] = {
            dn_number : item.field_1,
            material_amount : {[item.field_86] : 1} ,
            qty : item.field_18
          };
        } else {
          aggregatedData[item.field_1].qty = parseInt(aggregatedData[item.field_1].qty, 10) + parseInt(item.field_18, 10);

          if(aggregatedData[item.field_1].material_amount[item.field_86]){
            aggregatedData[item.field_1].material_amount[item.field_86] += 1
          }else {
            aggregatedData[item.field_1].material_amount[item.field_86] = 1
            
          }
        }
      });
    
      setDataDn(Object.values(aggregatedData))
    } catch (error) {
      console.log(error)
    }
  }

  



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(getUrlDn, formData, {
          headers: {
            "Content-Type" : 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };
  return (
    <div className='container-fluid'>
       <form onSubmit={handleSubmit}  className='row g-2'>
        <span className='text-danger fw-bold'>Upload Data Delivery with file</span>
        <div className='col-3'>
          <input type="file" className='form-control' required onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button className='btn btn-success col-1 text-white' type="submit">Upload</button>
      </form>
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



      <div className="table-responsive mt-2 text-center bg-white" style={{height: "50vh"}}> 
            <table className="table table-sm align-middle">
              <thead>
                <tr className="text-center">
                  <th scope="col">No</th>
                  <th scope="col">DN Number</th>
                  <th scope="col">Material Amount</th>
                  <th scope="col">Total Qty</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  dataDn.filter(item => 
                    item.dn_number.includes(search)
                  )
                  
                  .map((item,index) => (
                    <tr key={item.id}>
                      <td> {index + 1} </td>
                      <td> {item.dn_number} </td>
                      <td> {Object.entries(item.material_amount).map(([code, total]) => (
                                  <div key={code}>
                                  Material Code : {code} / {total}
                                </div>

                      ) )} </td>
                      <td> {item.qty} </td>
                      <td> <span
                        data-bs-toggle="modal"
                        data-bs-target="#detailKanban"
                        className="btn btn-success text-white ms-3"
                      >
                        <CIcon icon={cilCheck} />
                      </span> </td>
                     
                    </tr>
                  ))
                }
             
              </tbody>
            </table>
          </div>
    </div>
  )
}

export default DeliveryNote