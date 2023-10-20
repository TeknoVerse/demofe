import React, { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types"


const DataContext = createContext()

export const useData = () => useContext(DataContext)
export const DataProvider = ({children}) => {
    const [dataPlanningx,setDataPlanningx] = useState(0)
    const [damiDataOutputx,setDamiDataOutputx] = useState(0)

    return (
        <DataContext.Provider value={{dataPlanningx,setDataPlanningx,damiDataOutputx,setDamiDataOutputx}}>
            {children}
        </DataContext.Provider>
    )
}

DataProvider.propTypes = {
    children: PropTypes.node, // Menambahkan validasi prop types untuk children
  };