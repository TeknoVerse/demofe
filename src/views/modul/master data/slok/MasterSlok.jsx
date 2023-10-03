import { cibFilezilla, cilFilter, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getUrlSloc } from 'src/config/Api';

const MasterSlok = () => {
  const [dataSloc, setDataSloc] = useState([]);
  const [dataFormSloc, setDataFromSloc] = useState([]);
  const [editSloc, setEditSloc] = useState(false)

  const [search,setSearch] = useState('')
  const [filter, setFilter] = useState([])

  useEffect(() => {
    const bagInterval = [];
    const intervalProduct = setInterval(() => {
      getSloc();
    }, 1000);
    bagInterval.push(intervalProduct);
    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
        
      });
    };
  });

  const handleClearFormSloc = () => {
    setDataFromSloc([]);
    setEditSloc(false)

  };

  const getSloc = async () => {
    try {
      const response = await axios.get(getUrlSloc);

      setDataSloc(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSloc = async (id) => {
  
    try {
      await axios.delete(`${getUrlSloc}?id=${id}`)
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleButtonTrueSloc = async (e) => {
    e.preventDefault()

    try {

      if(editSloc){
        await axios.patch(`${getUrlSloc}?id=${dataFormSloc.id}`, {
          name : dataFormSloc.name,
          code : dataFormSloc.code,
        })
        setDataFromSloc([])
        setEditSloc(false)
      }else{
        await axios.post(getUrlSloc, {
          name : dataFormSloc.name,
          code : dataFormSloc.code,
        })
        setDataFromSloc([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handeSlocById = async (item) => {
    try {
      setEditSloc(true)
      setDataFromSloc({code : item.code, name: item.name, id: item.id  })
      
    } catch (error) {
      console.log(error)
    }
  } 

  return (
    <div className="container-fluid">
      <div className="row justify-content-evenly col-12">
        <div className={` border border-4   ${editSloc ? " border-danger " : ""} col-5 p-2 rounded `}>
          <form onSubmit={handleButtonTrueSloc} className="row g-1">
            <div className="col-12 ">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Name
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id=""
                    value={dataFormSloc.name ? dataFormSloc.name : ''}
                    onChange={e => setDataFromSloc(prevData => {return {...prevData, name : e.target.value }})}
                    required
                    placeholder="Name Sloc"
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
                  Code
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id=""
                    required
                    value={dataFormSloc.code ? dataFormSloc.code : ''}
                    maxLength={"7"}
                    minLength={"7"}
                    onChange={e => setDataFromSloc(prevData => {return {...prevData, code : e.target.value }})}

                    placeholder="Code Sloc"
                  />
                </div>
              </div>
            </div>
          
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-evenly">
                <span
                  onClick={handleClearFormSloc}
                  className="btn col-sm-4 btn-danger text-white btn-sm"
                >
                   {editSloc ? "Cancel Editing" : "clear"}
                </span>
                <button
                  type="submit"
                  className="btn col-sm-4 btn-success text-white btn-sm"
                >
                    {editSloc ? "Save Editing" : "Add Slock"}
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
                  <th scope="col">Name</th>
                  <th scope="col">Code</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {dataSloc.filter(item => 
                  item.name.toLowerCase().includes(search.toLowerCase()) || 
                  item.code.toLowerCase().includes(search.toLowerCase()) 
                )     
                .map((item, index) => (
                  <tr className="text-center" key={index}>
                    <th >{index +1} </th>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td style={{ width: '150px' }}>
                      <span onClick={() => handleDeleteSloc(item.id)} className="btn btn-danger text-white">
                        
                        <CIcon icon={cilTrash} />
                      </span>
                      <span onClick={() => handeSlocById(item)} className="btn btn-success text-white ms-3">
                        
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

export default MasterSlok;
