import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getUrlWarehouse } from 'src/config/Api';
import { DataProduct, DataSloc, DataWarehouse } from 'src/config/GetDataApi';

const MasterWarehouseProduction = () => {
  const Slocs = DataSloc()
  const Products = DataProduct()
  const Werhaouses = DataWarehouse()

  

  const [getWareHouseById, setWareHouseById] = useState([]) 
  const [addFromProduct, setFromAddProduct] = useState(false)
  const [selectProduct, setSelectProduct] = useState([])
  const [qtyProduct, setQtyProduct] = useState('')

  const handleSelectProduct = (item) => {
    if(addFromProduct === true){
      setFromAddProduct(false)
      setSelectProduct([])
      setQtyProduct('')
    }else{
    setFromAddProduct(true)
    setSelectProduct(item)
    }
  }

  const addProduct = async (e) => {
    e.preventDefault()
    try {
      setFromAddProduct(false)
      setSelectProduct([])
      setQtyProduct('')
      await axios.post(getUrlWarehouse, {
        sloc_name : getWareHouseById.name ,
        sloc_code : getWareHouseById.code ,
        part_name : selectProduct.part_name,
        part_code : selectProduct.part_no,
        qty : qtyProduct
      })
     
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteItemWarehouse = async (id) => {
    try {
      await axios.delete(`${getUrlWarehouse}?id=${id}`)
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="row">
            {Slocs.map((item,index) => 
                <div key={index} className="col-6 ">
                  <div className='row'>
                <div className='col-12 d-flex align-items-center'>

                <span className="fs-3 fw-bold ">{item.name} </span>
                  <button onClick={() => setWareHouseById(item)} data-bs-toggle="modal" data-bs-target="#exampleModal" className='btn btn-warning ms-auto fw-bold'>Edit Product</button>
                </div>
                  
                <div className="table-responsive mt-2  " style={{height : "200px"}}>
                  <table className="table text-center   table-sm align-middle" >
                    <thead>
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col">Part Code</th>
                        <th scope="col">Part Name</th>
                        <th scope="col">Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Werhaouses.filter(warehouse => 
                        warehouse.sloc_code.toLowerCase().includes(item.code.toLowerCase())
                      ).map((warehouse_item,index) => 
                        <tr key={index}>
                          <td>{index +1} </td>
                          <td>{warehouse_item.part_code} </td>
                          <td>{warehouse_item.part_name} </td>
                          <td>{warehouse_item.qty} </td>
                        </tr>
                      )
                      }
                     
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
              )}
          
          </div>
        </div>
      </div>

      {/* Start Modal Edit Warehouse */}
<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-xl">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">{getWareHouseById.name} </h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className='container '>
              <div className='row'>
                  <div className='col-5'>
                      <div className='col-12 text-center'>
                          <span className='fw-bold fs-5'>List Product</span>
                      </div>
                      <div className='col-12'>
                        
                        <div className="table-responsive mt-2  " style={{height : "200px"}}>
                        {addFromProduct === true ? 
                        <form className='row ' onSubmit={addProduct}>
                          <span>Part Name : {selectProduct.part_name}  </span>
                          <span>Part Code : {selectProduct.part_no}  </span>
                          <span>Qty : {selectProduct.qty}  </span>
                          <hr className='mt-2' />
                          <div className="row ">
                              <label
                                htmlFor=""
                                className="col-sm-4 col-form-label col-form-label-sm"
                              >
                                Set Qty
                              </label>
                              <div className="col-sm-8">
                                <input
                                  type="number"
                                  max={`${selectProduct.qty}`}
                                  min={'1'}
                                  className="form-control form-control-sm"
                                  id=""
                                  value={qtyProduct}
                                  onChange={e => setQtyProduct(e.target.value)}
                                  required
                                />
                              
                              </div>
                              <div className='mt-3 col-12'>
                                  <div className='row justify-content-evenly'>

                                <span onClick={handleSelectProduct} className=' col-4 text-white  btn btn-danger'>Close</span>
                                <button type='submit' className=' col-4 text-white  btn btn-success'>Add Product</button>
                                  </div>

                                </div>
                            </div>
                        </form>
                        
                        :
                          <table className="table text-center table-sm align-middle" >
                            <thead>
                              <tr>
                                <th scope="col">No</th>
                                <th scope="col">Part Name</th>
                                <th scope="col">Part No</th>
                                <th scope="col">Stok</th>
                                <th scope="col">Option</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Products.map( (item,index) =>
                                <tr key={index}>
                                  <td>{index+1} </td>
                                  <td>{item.part_name} </td>
                                  <td>{item.part_no} </td>
                                  <td>{item.qty} </td>
                                  <td> <button onClick={() => handleSelectProduct(item)} className='btn btn-success text-white btn-sm'>Select</button> </td>
                               
                                </tr>
                              )}
                              
                            </tbody>
                          </table>
}
                        </div>
                          
                      </div>
                  </div>
                  <div className="col-1  d-flex ">
                    <div className="bg-dark h-100 m-auto" style={{ width: '1px' }}></div>
                  </div>
                  <div className='col-5' >
                      <div className='col-12 text-center'>
                          <span className='fw-bold fs-5'>Product In Warehouse</span>
                      </div>
                      <div className='col-12 mt-2'>
                      <table className="table text-center table-sm align-middle" >
                            <thead>
                              <tr>
                                <th scope="col">No</th>
                                <th scope="col">Part Name</th>
                                <th scope="col">Part No</th>
                                <th scope="col">Qty</th>
                                <th scope="col">Option</th>
                              </tr>
                            </thead>
                            <tbody>
                            {Werhaouses.filter(warehouse => 
                                warehouse.sloc_code.toLowerCase().includes(getWareHouseById.code)
                              ).map((warehouse_item,index) => 
                                <tr key={index}>
                                  <td>{index +1} </td>
                                  <td>{warehouse_item.part_name} </td>
                                  <td>{warehouse_item.part_code} </td>
                                  <td>{warehouse_item.qty} </td>
                                  <td style={{ width: '150px' }}>
                                    <span onClick={() => handleDeleteItemWarehouse(warehouse_item.id)} className="btn btn-danger text-white">
                                      
                                      <CIcon icon={cilTrash} />
                                    </span>
                                  {/*   <span onClick={() => handeItemWarehouseById(warehouse_item)} className="btn btn-success text-white ms-3">
                                      
                                      <CIcon icon={cilPencil} />
                                    </span> */}
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
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
      {/* End Modal Edit Warehouse */}
    </div>
  );
};

export default MasterWarehouseProduction;
