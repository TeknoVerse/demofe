import React, { useEffect, useRef, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import { getUrlMachine, getUrlShift, getUrlTworkOee } from 'src/config/Api';
import { Typeahead } from 'react-bootstrap-typeahead';

const MyGaugeChart = ({ value, width, title, fs }) => {
  const chartStyle = {
    width: width,
  };
  const replaceValue = value ? String(value).replace(/\./g, '') : 0;
  const cekData = String(value).split('.')[0]
  let currentValue = `0.` + replaceValue ;
 if(cekData === '0' || cekData.length === 1){
    currentValue = `0.0` + replaceValue
  }
  if(cekData.length === 3){
    let noIndex0 = []
    const splitData = replaceValue.split('')
    splitData.forEach((data,index) => {
      if(index !== 0){
        noIndex0 +=data
      }
    });
    
    currentValue = `${splitData[0]}.` +   parseFloat(noIndex0)
  }
  if(cekData.length ===0 ){

   currentValue = `0.` + replaceValue  ;
  }

  return (
    <div style={{ height: 'auto', width: 'auto' }} className="text-center ">
      <GaugeChart
        id="gauge-chart2"
        style={chartStyle}
        textColor={'#f5f2f5'}
        nrOfLevels={20}
        percent={currentValue}
      />
       
     {/*  <span className='text-white'> {value}
      </span> */}
      <br />
      <span
        style={{ marginTop: '40%', fontSize: `${fs}rem` }}
        className="fw-bold text-white flex"
      >
        
        {title}
      </span>
    </div>
  );
};

const OeeReportDisplay = () => {


  const newDate = new Date();
  const currentTime = newDate.toLocaleString();

  const [currentOee, setCurrentOee] = useState([]);
  const [dataMachine, setDataMachine] = useState([]);
  const [dataShift, setDataShift] = useState([]);

  /* Start Ref */
  const refMachine = useRef(null);
  const refShift = useRef(null);
  const refDate = useRef(null);
  /* End Ref */

  const [dataFormOee, setDataFormOee] = useState([]);
  const [firstView, setFirstView] = useState(true);

  useEffect(() => {
    const bagInterval = [];
    const intervalTmastMachine = setInterval(() => {
      getDataMachine();
    }, 1000);
    const intervalTmasttSHift = setInterval(() => {
      getDataShift();
    }, 1000);
    bagInterval.push(intervalTmastMachine, intervalTmasttSHift);
    return () => {
      bagInterval.forEach((data) => {
        clearInterval(data);
      });
    };
  });

  const getDataMachine = async () => {
    try {
      const response = await axios.get(getUrlMachine);
      const shouldUpdateDataMachine =
        dataMachine.length === 0 ||
        response.data.some(
          (resItem) => !dataMachine.find((item) => item.code === resItem.code),
        ) ||
        dataMachine.some(
          (item) =>
            !response.data.find((resItem) => resItem.code === item.code),
        );

      if (shouldUpdateDataMachine) {
        setDataMachine(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataShift = async () => {
    try {
      const response = await axios.get(getUrlShift);
      const shouldUpdateDataShift =
        dataMachine.length === 0 ||
        response.data.some(
          (resItem) => !dataShift.find((item) => item.name === resItem.name),
        ) ||
        dataShift.some(
          (item) =>
            !response.data.find((resItem) => resItem.name === item.name),
        );

      if (shouldUpdateDataShift) {
        setDataShift(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const handleMethodOee = async (e) => {
    e.preventDefault()
    try {
      setFirstView(false)
      if( dataFormOee.machine_no && dataFormOee.shift_id){
        refDate.current.value = ''
        refShift.current.clear()
        refMachine.current.clear()

        const response = await axios.post(getUrlTworkOee, {
          machine_no : dataFormOee.machine_no,
          shift_id : dataFormOee.shift_id,
          date : dataFormOee.date
        })

        
          if(response){
            setCurrentOee(response.data)
            setFirstView(false)
          }
      }
    

    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div
      style={{ height: '100vh', background: 'black' }}
      className=" d-flex flex-column align-items-center justify-content-center   m-0 g-1 p-0"
    >
      <div className={` ${firstView !== true && 'd-none'  } d-flex col-12 mb-5  align-items-center  justify-content-center text-white`}>
        <form className=" col-5 p-2" onSubmit={handleMethodOee}>
          <div className="row mb-3 ">
            <label className="col-sm-4 col-form-label">Machine No</label>
            <div className="col-sm-8">
              <Typeahead
                labelKey={'code'}
                className={`  ${refMachine && ' form-control is-invalid ps-0 py-0'}   `}
                ref={refMachine}
                id={(e) => (e[0] != null && e[0].id != null ? e[0].id : null)}
                onChange={(e) =>
                  setDataFormOee((prevdata) => {
                    return {
                      ...prevdata,
                      machine_no:
                        e[0] != null && e[0].code != null ? e[0].code : '',
                    };
                  })
                }
                options={dataMachine}
              />
            </div>
          </div>
          <div className="row mb-3 ">
            <label className="col-sm-4 col-form-label">Select Shift</label>
            <div className="col-sm-8">
              <Typeahead
                labelKey={'name'}
                ref={refShift}
                id={(e) => (e[0] != null && e[0].id != null ? e[0].id : null)}
                onChange={(e) =>
                  setDataFormOee((prevdata) => {
                    return {
                      ...prevdata,
                      shift_id: e[0] != null && e[0].id != null ? e[0].id : '',
                    };
                  })
                }
                options={dataShift}
              />
            </div>
          </div>
          <div className="row mb-3 ">
            <label className="col-sm-4 col-form-label"> Date</label>
            <div className="col-sm-8">
              <input
                type="date"
                ref={refDate}
                onChange={(e) =>
                  setDataFormOee((prevdata) => {
                    return { ...prevdata, date: e.target.value };
                  })
                }
                required
                className="form-control"
              />
                
            </div>
          </div>
          <div className='text-center'>
            <button type='submit' className='btn btn-sm btn-success text-white'>Set Oee</button>
          </div>
        </form>
      </div>

      <div className={` ${firstView === true && 'd-none'} d-flex align-items-center   justify-content-center`}>
        <MyGaugeChart
          width={200}
          value={currentOee && currentOee.oee}
          title={'OEE'}
          fs={1}
        />
        <MyGaugeChart
          width={200}
          value={currentOee && currentOee.avaibility}
          title={'AVAILABILITY'}
          fs={1}
        />
        <MyGaugeChart
          width={200}
          value={currentOee && currentOee.performance}
          title={'PERFORMANCE'}
          fs={1}
        />
        <MyGaugeChart
          width={200}
          value={currentOee && currentOee.quality}
          title={'QUALIY'}
          fs={1}
        />
      </div>
    </div>
  );
};

MyGaugeChart.propTypes = {
  fs: PropTypes.number,
  value: PropTypes.number,
  width: PropTypes.number,
  title: PropTypes.string,
};

export default OeeReportDisplay;
