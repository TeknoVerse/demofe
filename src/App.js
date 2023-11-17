import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

//import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"

import './scss/style.scss'
import './scss/Mycss.scss'
import ProductionDisplay from './views/modul/demo/singleDisplay/ProductionDisplay'
import DataProductionDisplay from './views/modul/demo/singleDisplay/DataProductionDisplay'
import { DataProvider } from './views/modul/DataContext'
import OeeReportDisplay from './views/modul/demo/singleDisplay/OeeReportDisplay'


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <DataProvider>

      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/production-display" name="Production Display" element={<ProductionDisplay />} />
            <Route exact path="/data-production-display" name="Data Production Display" element={<DataProductionDisplay />} />
            <Route exact path="/oee-display" name="Oee Display" element={<OeeReportDisplay />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
      </DataProvider>

    )
  }
}

export default App
