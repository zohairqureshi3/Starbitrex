import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import DataTable, { createTheme } from "react-data-table-component";

const Index = () => {


  createTheme(
    "solarizedd",
    {
      text: {
        primary: "#fff",
        secondary: "#fff",
      },
      background: {
        default: "#0F1015",
      },
      context: {
        background: "#0F1015",
        text: "#FFFFFF",
      },
      divider: {
        default: "#fff",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  const depositColumns = [
    {
      name: "Tier",
      selector: (row) => {
        return (
          "-"
        );
      },
      sortable: true,
    },
    {
      name: "Position Bracket (Notional Value in USDT)",
      selector: (row) => {
        return (
          "-"
        );
      },
      sortable: true,
    },
    {
      name: "Max Leverage",
      selector: (row) => {
        return (
          "-"
        );
      },
      sortable: true,
    },
    {
      name: "Maintenance Margin Rate",
      selector: (row) => {
        return (
          "-"
        );
      },
      sortable: true,
    },
    {
      name: "Maintenance Amount (USDT)",
      selector: (row) => {
        return (
          "-"
        );
      },
      sortable: true,
    }
  ]
  
  return (
    <>
        <section className='leverage-margin header-padding'>
            <div className='padding50'>
                <div className='container'>
                    <h3 className='text-white'>Leverage & Margin</h3>
                    <button type="button" className="btn css-1baucg5">USDⓈ-M</button>
                    <div className='leverage-para'>
                      <p className='text-white mb-0'>Leverage & Margin</p>
                    </div>
                    <div className='initial-margin-details'>
                        <p className="mb-0 text-white-light">Initial Margin = Notional Position Value / Leverage Level</p>
                        <p className="mb-0 text-white-light">Maintenance Margin = Notional Position Value * Maintenance Margin Rate - Maintenance Amount</p>
                    </div>

                    <div className="dropdown searchable-dropdown">
                      <button className="btn text-white dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <p className='mb-0 text-white-light'>Symbol</p>
                        <p className='mb-0 text-white'>BTCUSDT Perpetual</p>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li>
                          <div className='dd-search-bar'>
                            <div><FontAwesomeIcon className="text-white-light" icon={faSearch} /><input type="search" /></div>
                          </div>
                        </li>
                        <li><a className="dropdown-item">TRXUSDT Perpetual</a></li>
                        <li><a className="dropdown-item">ZRXUSDT Perpetual</a></li>
                      </ul>
                    </div>
                    <div className='leverage-margin-datatable'>
                    <DataTable
                      columns={depositColumns}
                      pagination
                      subHeader
                      fixedHeader
                      persistTableHead
                      theme="solarizedd"
                    />
                    </div>
                    <div className='rulues-info'>
                      <p className='mb-0'>*Rules Last Update Time: 2022/05/11 10:58</p>
                      <p>*Max leverage 125x USDⓈ-Margined Futures Contracts include: BTCUSDT Perpetual</p>

                      <p className='text-09 mb-0'><FontAwesomeIcon className="text-white-light me-2" icon={faInfoCircle} />Please be aware that in the event of extreme price movements or deviation from the price index, Binance will undertake additional protective measures, including but not limited to:</p>
                      <div className='points mb-3 ms-3'>
                        <p className='mb-0 text-09'>1. Adjust maximum leverage value</p>
                        <p className='mb-0 text-09'>2. Adjust position bracket in each tier</p>
                        <p className='mb-0 text-09'>3. Adjust maintenance margin rate in each tier</p>
                      </div>
                      <p className='text-09'><FontAwesomeIcon className="text-white-light me-2" icon={faInfoCircle} />New users with registered futures accounts of less than 60 days will not be allowed to open positions with leverage exceeding 20x. Learn More</p>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Index