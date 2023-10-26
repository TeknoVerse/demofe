import axios from "axios"
import PropTypes, { number } from "prop-types"
const { useState, useEffect } = require("react")
const { getUrlProduct, getUrlSloc, getUrlWarehouse, getUrlKanban, getUrlTmastDefect, getUrlMachine, getUrlTtransDefect } = require("./Api")


export const DataMasterMachine = ({code}) => {
    const [data, setData] = useState([])
    
    useEffect(() => {
        const interval = setInterval(() => {
            getDataTmastMachine()
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [data])

    const getDataTmastMachine = async () => {
        try {
            if(code){
                const response = await axios.get(`${getUrlMachine}?code=${code}`)
                setData(response.data)
            }else{
                const response = await axios.get(`${getUrlMachine}`)
                setData(response.data)

            }
        } catch (error) {
            console.log(error)
        }
    }
    return data
}



export const DatattransDefect = ({machine_no}) => {
    const [data, setData] = useState([])
    
    useEffect(() => {
        const interval = setInterval(() => {
            getDataTtransDefect()
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [data])

    const getDataTtransDefect = async () => {
        try {
            if(machine_no){
                const response = await axios.get(`${getUrlTtransDefect}?machine_no=${machine_no}`)
                setData(response.data)
            }else{
                const response = await axios.get(`${getUrlTtransDefect}`)
                setData(response.data)

            }
        } catch (error) {
            console.log(error)
        }
    }
    return data
}
export const DataMasterDefect = ({machine_group}) => {
    const [data, setData] = useState([])
    
    useEffect(() => {
        const interval = setInterval(() => {
            getDataTmastDefect()
        }, 1000);

        return () => {
            clearInterval(interval)
        }
    }, [data])

    const getDataTmastDefect = async () => {
        try {
            if(machine_group){
                const response = await axios.get(`${getUrlTmastDefect}?machine_group=${machine_group}`)
                setData(response.data)
            }else{
                const response = await axios.get(`${getUrlTmastDefect}`)
                setData(response.data)

            }
        } catch (error) {
            console.log(error)
        }
    }
    return data
}

export const DataProduct = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const dataInterval = setInterval(() => {
            getData()
        }, 1000);

        return () => {
            clearInterval(dataInterval)
        }
    },[])

    const getData = async () => {
        try {
            const response = await axios.get(getUrlProduct)
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return data
}

export const DataSloc = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const dataInterval = setInterval(() => {
            getData()
        }, 1000);

        return () => {
            clearInterval(dataInterval)
        }
    },[])

    const getData = async () => {
        try {
            const response = await axios.get(getUrlSloc)
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return data
}

export const DataWarehouse = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const dataInterval = setInterval(() => {
            getData()
        }, 1000);

        return () => {
            clearInterval(dataInterval)
        }
    },[])

    const getData = async () => {
        try {
            const response = await axios.get(getUrlWarehouse)
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return data
}

export const DataKanban = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const dataInterval = setInterval(() => {
            getData()
        }, 1000);

        return () => {
            clearInterval(dataInterval)
        }
    },[])

    const getData = async () => {
        try {
            const response = await axios.get(getUrlKanban)
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return data
}

DatattransDefect.propTypes = {
    machine_no : PropTypes.string
}

DataMasterDefect.propTypes = {
    machine_group : PropTypes.string
}
DataMasterMachine.propTypes = {
    code : PropTypes.string
}