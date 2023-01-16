import React from "react";
import Header from '../../layout/Header';
import { useDispatch } from 'react-redux';
import { adminLogin } from "../../redux/auth/authActions";
import { withRouter, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from '../../assets/images/STBRX-new-logo-01.png';
import { Row, Col, Nav, Tab } from "react-bootstrap";

const LoginPage = (props) => {

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const userData = {
        email: {
            required: "Email is required",
            pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email',
            }
        },
        password: {
            required: "Password is required"
        }
    };

    const handleSave = async (formData) => {

        const data = {
            email: formData.email,
            password: formData.password
        }
        dispatch(adminLogin(data));
    }

    return (
        <>
            {/* <Header /> */}
            <div className="col-lg-12 col-md-12 login-page p-0">
                <div className="content-wrapper">
                    {/* <div className="content-box auth-box"> */}
                    {/* <h3 className="text-center mb-4">Login User</h3>
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className="form-group col-md-12">
                            <label className="control-label mb-2">Email</label>
                            <input type="email" className="form-control" placeholder="Enter email"
                                {...register('email', userData.email)} name='email' />
                            {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                            <label className="control-label mb-2">Password</label>
                            <input type="password" className="form-control" placeholder="Enter password"
                                {...register('password', userData.password)} name='password' />
                            {errors?.password && <span className="errMsg">{errors.password.message}</span>}
                        </div>
                        <div className="login-page-buttons mt-2">
                            <button className="btn-default w-100 btn mt-2" type="submit">Login</button>
                        </div>
                        <br />
                        <div className="text-center">
                            <Link to='/admin/forget-password-email'>Forget Password</Link>
                        </div>
                        <br />
                    </form> */}
                    {/* </div> */}

                    <div className="login-section">
                        <div className="image-section">

                        </div>
                        <div className="login-data">
                            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                <Row>
                                    <Col sm={12}>
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">LOGIN</Nav.Link>
                                            </Nav.Item>
                                            {/* <Nav.Item>
                                                <Nav.Link eventKey="second">REGISTER</Nav.Link>
                                            </Nav.Item> */}
                                        </Nav>
                                    </Col>
                                    <Col sm={12}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first">
                                                <div className="logo">
                                                    <Link to="/admin"><img className="img-fluid" src={logo} /></Link>
                                                </div>
                                                <form onSubmit={handleSubmit(handleSave)}>
                                                    <div className="form-group col-md-12">
                                                        <label className="control-label mb-2">Email</label>
                                                        <input type="email" className="form-control" placeholder="Enter email"
                                                            {...register('email', userData.email)} name='email' />
                                                        {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                                                    </div>
                                                    <div className="form-group col-md-12 pt-2">
                                                        <label className="control-label mb-2">Password</label>
                                                        <input type="password" className="form-control" placeholder="Enter password"
                                                            {...register('password', userData.password)} name='password' />
                                                        {errors?.password && <span className="errMsg">{errors.password.message}</span>}
                                                    </div>
                                                    <div className="login-page-buttons mt-2">
                                                        <button className="btn-default w-100 btn mt-2" type="submit">Login</button>
                                                    </div>
                                                    <br />
                                                    <div className="text-center">
                                                        <Link to='/admin/forget-password-email'>Forget Password</Link>
                                                    </div>
                                                    <br />
                                                </form>
                                            </Tab.Pane>
                                            {/* <Tab.Pane eventKey="second">
                                                <div className="logo">
                                                    <Link to="/admin"><img className="img-fluid" src={logo} /></Link>
                                                </div>
                                                <form onSubmit={handleSubmit(handleSave)}>
                                                    <div className="form-group col-md-12 pt-2">
                                                        <label className="control-label mb-2">Name</label>
                                                        <input type="email" className="form-control" placeholder="Enter name"
                                                            {...register('email', userData.email)} name='name' />
                                                        {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                                                    </div>
                                                    <div className="form-group col-md-12 pt-2">
                                                        <label className="control-label mb-2">Email</label>
                                                        <input type="email" className="form-control" placeholder="Enter email"
                                                            {...register('email', userData.email)} name='email' />
                                                        {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                                                    </div>
                                                    <div className="form-group col-md-12 pt-2">
                                                        <label className="control-label mb-2">Password</label>
                                                        <input type="password" className="form-control" placeholder="Enter password"
                                                            {...register('password', userData.password)} name='password' />
                                                        {errors?.password && <span className="errMsg">{errors.password.message}</span>}
                                                    </div>
                                                    <div className="form-group col-md-12 pt-2">
                                                        <label className="control-label mb-2">Confirm Password</label>
                                                        <input type="password" className="form-control" placeholder="Enter password"
                                                            {...register('password', userData.password)} name='password' />
                                                        {errors?.password && <span className="errMsg">{errors.password.message}</span>}
                                                    </div>
                                                    <div className="login-page-buttons mt-2">
                                                        <button className="btn-default w-100 btn mt-2" type="submit">Signup</button>
                                                    </div>
                                                    <br />
                                                    <div className="text-center">
                                                        <Link to='/admin/forget-password-email'>Login</Link>
                                                    </div>
                                                    <br />
                                                </form>
                                            </Tab.Pane> */}
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default withRouter(LoginPage)
