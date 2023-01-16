import React from 'react';
import Header from '../Header/Header';
import Banner from './Banner';
import MarketTrend from './MarketTrend';
import TradeAnyway from './TradeAnyway';
import GetInTouch from './GetInTouch';
import Footer from '../Footer/Footer';

const index = () => {
  return (
    <>
        <Header />
        <Banner />
        <MarketTrend />
        <TradeAnyway />
        <GetInTouch />
        <Footer />
    </>
  )
}

export default index