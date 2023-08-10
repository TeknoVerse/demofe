import { cibFilezilla, cilFilter, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getUrlProduct } from 'src/config/Api';

const MasterProduct = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const [dataFormProduct, setDataFromProduct] = useState([]);
  const [editProduct, setEditProduct] = useState(false)

  const [search,setSearch] = useState('')
  const [filter, setFilter] = useState([])

  useEffect(() => {
    const bagInterval = [];
    const intervalProduct = setInterval(() => {
      getProduct();
    }, 1000);
    bagInterval.push(intervalProduct);
    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
        
      });
    };
  });

  const handleClearFormProduct = () => {
    setDataFromProduct([]);
    setEditProduct(false)

  };

  const getProduct = async () => {
    try {
      const response = await axios.get(getUrlProduct);

      setDataProduct(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (id) => {
  
    try {
      await axios.delete(`${getUrlProduct}?id=${id}`)
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleButtonTrueProduct = async (e) => {
    e.preventDefault()

    try {

      if(editProduct){
        await axios.patch(`${getUrlProduct}?id=${dataFormProduct.id}`, {
          part_name : dataFormProduct.part_name,
          part_no : dataFormProduct.part_no,
          qty : dataFormProduct.qty,
        })
        setDataFromProduct([])
        setEditProduct(false)
      }else{
        await axios.post(getUrlProduct, {
          part_name : dataFormProduct.part_name,
          part_no : dataFormProduct.part_no,
          qty : dataFormProduct.qty,
        })
        setDataFromProduct([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handeProductById = async (item) => {
    try {
      setEditProduct(true)
      setDataFromProduct({part_no : item.part_no, part_name: item.part_name, qty : item.qty, id: item.id  })
      
    } catch (error) {
      console.log(error)
    }
  } 

  return (
    <div className="container-fluid">
      <div className="row justify-content-evenly col-12">
        <div className={` border border-4   ${editProduct ? " border-danger " : ""} col-5 p-2 rounded `}>
          <form onSubmit={handleButtonTrueProduct} className="row g-1">
            <div className="col-12 ">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Part name
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id=""
                    value={dataFormProduct.part_name ? dataFormProduct.part_name : ''}
                    onChange={e => setDataFromProduct(prevData => {return {...prevData, part_name : e.target.value }})}
                    required
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
                  Part No
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    id=""
                    required
                    value={dataFormProduct.part_no ? dataFormProduct.part_no : ''}

                    onChange={e => setDataFromProduct(prevData => {return {...prevData, part_no : e.target.value }})}

                    placeholder="Part No"
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
                  <input
                    type="number"
                    required
                    value={dataFormProduct.qty ? dataFormProduct.qty : ''}

                    onChange={e => setDataFromProduct(prevData => {return {...prevData, qty : e.target.value }})}

                    className="form-control form-control-sm"
                    id=""
                    placeholder="Qty"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-evenly">
                <span
                  onClick={handleClearFormProduct}
                  className="btn col-sm-4 btn-danger text-white btn-sm"
                >
                   {editProduct ? "Cancel Editing" : "clear"}
                </span>
                <button
                  type="submit"
                  className="btn col-sm-4 btn-success text-white btn-sm"
                >
                    {editProduct ? "Save Editing" : "Add Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-1  d-flex ">
          
          <div className="bg-dark h-100 m-auto" style={{ width: '1px' }}>
            
          </div>
        </div>
        <div className="col-5   rounded bg-opacity-75">
          <div className="row">
            {/*    <div className='col-md-12 text-center'> 
                <span className='fw-bold fs-4 text-white'>Screen</span>
            </div> */}
          </div>
        </div>
        <div className="col-12">
          <hr />
          <div className='col-md-12'>
            <div className='row'>
              <div className='col-1  d-flex align-items-center justify-content-center '>
                <div className='col-3'>
                  <div className='d-flex justify-content-center align-items-center '>
                    <span className='btn btn-warning fw-bold'>

                  <CIcon icon={cilFilter}/>
                    </span>
                  </div>
                </div>
              </div>
              <div className='col-4 ms-auto'>

                <input type="text" value={search && search} onChange={e => setSearch(e.target.value) } className='form-control ' placeholder='Search' />
              </div>
            </div>

          </div>
          <div className="table-responsive mt-2">
            <table className="table table-sm align-middle">
              <thead>
                <tr className="text-center">
                  <th scope="col">No</th>
                  <th scope="col">Part Name</th>
                  <th scope="col">Part No</th>
                  <th scope="col">qty</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataProduct.filter(item => 
                  item.part_name.toLowerCase().includes(search.toLowerCase()) || 
                  item.part_no.toLowerCase().includes(search.toLowerCase()) || 
                  String(item.qty) .includes(search)  
                )     
                .map((item, index) => (
                  <tr className="text-center" key={index}>
                    <th >{index +1} </th>
                    <td>{item.part_name}</td>
                    <td>{item.part_no}</td>
                    <td>{item.qty}</td>
                    <td style={{ width: '150px' }}>
                      <span onClick={() => handleDeleteProduct(item.id)} className="btn btn-danger text-white">
                        
                        <CIcon icon={cilTrash} />
                      </span>
                      <span onClick={() => handeProductById(item)} className="btn btn-success text-white ms-3">
                        
                        <CIcon icon={cilPencil} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterProduct;
