import axios from "axios"
const { useState, useEffect } = require("react")
const { getUrlProduct, getUrlSloc, getUrlWarehouse, getUrlKanban } = require("./Api")

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