import React from "react";
import { Table } from "react-bootstrap";
import { Tabs, Tab } from "react-bootstrap";
import { Form } from 'react-bootstrap';

const Order = ({ selectRate, primaryCoin, secondaryCoin, orderBookAPI, futureTradesAPI }) => {

	return (
		<>
			<div className="order-book-market">
				<div className="order-book-market-wrapper">
					<Tabs
						defaultActiveKey="order-book"
						id="uncontrolled-tab-example"
						className="mb-2"
					>
						<Tab eventKey="order-book" title="Order Book">
							<div className="sellorder-header  mb-2">
								<div className="img-wrapper">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-3kwgah"><path d="M4 4h7v7H4V4z" fill="#F6465D"></path><path d="M4 13h7v7H4v-7z" fill="#0ECB81"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z" fill="currentColor"></path></svg>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-3kwgah"><path d="M4 4h7v16H4V4z" fill="#0ECB81"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z" fill="currentColor"></path></svg>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="css-3kwgah"><path d="M4 4h7v16H4V4z" fill="#F6465D"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z" fill="currentColor"></path></svg>
								</div>
								<div className='dropdown-wrapper'>
									<Form.Select
										id="orderbookDecimal-select"
										value=""
										// onChange={handleChange}
										name="orderBookDecimal"
									// {...register('sourceCurrency', addLeverageData?.sourceCurrency)}
									>
										<option value="0.01">0.01</option>
										<option value="0.1">0.1</option>
										<option value="1">1</option>
										<option value="5">5</option>
									</Form.Select>
								</div>
							</div>
							<div className="d-flex text-white">
								<h3
									className="w-100 text-center"
									style={{
										background: "rgba(202, 209, 210, 0.15)",
										paddingTop: "2px",
									}}
								>
									SELL ORDERS
								</h3>
							</div>
							<div className="table-responsive sell-orders" style={{ height: "295px", overflow: "hidden" }}>
								<Table className="trade-table">
									<thead>
										<tr>
											<th>Price</th>
											<th>Amount</th>
											<th>Sum</th>
										</tr>
									</thead>
									<tbody>
										{orderBookAPI && orderBookAPI.a ? orderBookAPI.a.filter(row => (parseFloat(row['1']) > 0)).map((order, index) => (
											<tr key={index} style={{ fontSize: "smaller" }} onClick={() => { selectRate(order[0]) }}>
												<td className="color-red"> {parseFloat(order[0]).toFixed(2)} </td>
												<td> {parseFloat(order[1]).toFixed(2)} </td>
												<td> {parseFloat(order[0] * order[1]).toFixed(2)} </td>
											</tr>
										))
											: (
												<td colSpan="3">"No orders found"</td>
											)}
									</tbody>
								</Table>
							</div>
							<div className="d-flex text-white">
								<h3
									className="w-100 text-center"
									style={{
										background: "rgba(202, 209, 210, 0.15)",
										paddingTop: "2px",
									}}
								>
									BUY ORDERS
								</h3>
							</div>
							<div className="table-responsive buy-orders" style={{ height: "295px", overflow: "hidden" }}>
								<Table className="trade-table">
									<thead>
										<tr>
											<th>Price</th>
											<th>Amount</th>
											<th>Sum</th>
										</tr>
									</thead>
									<tbody>
										{orderBookAPI && orderBookAPI.b ? orderBookAPI.b.filter(row => (parseFloat(row['1']) > 0)).map((order, index) => (
											<tr key={index} style={{ fontSize: "smaller" }} onClick={() => { selectRate(order[0]) }}>
												<td className="text-success"> {parseFloat(order[0]).toFixed(2)} </td>
												<td> {parseFloat(order[1]).toFixed(2)} </td>
												<td> {parseFloat(order[0] * order[1]).toFixed(2)} </td>
											</tr>
										))
											: (
												<td colSpan="3">"No orders found"</td>
											)}
									</tbody>
								</Table>
							</div>
						</Tab>
						<Tab eventKey="market-traders" title="Market Traders">
							<Table responsive className="trade-table market-table">
								<thead>
									<tr>
										<th>Time</th>
										<th>Price{"(" + primaryCoin?.symbol + ")"}</th>
										<th>Amount{"(" + secondaryCoin?.symbol + ")"}</th>
									</tr>
								</thead>
								<tbody>
									{futureTradesAPI && futureTradesAPI.length && futureTradesAPI.map(row =>
										<tr>
											<td>{new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(row.E)}</td>
											<td className={row.m ? "text-green" : "text-red"}>{parseFloat(row.p).toFixed(2)}</td>
											<td>{parseFloat(row.q).toFixed(2)}</td>
										</tr>
									)}
								</tbody>
							</Table>
						</Tab>
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default Order;