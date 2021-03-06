import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form,Button,Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"
import { login } from "../actions/userAction"
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';



const LoginScreen = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState(null)
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = userLogin;
    const redirect = props.location.search ? props.location.search.split('=')[1] : '/'
    
    useEffect(() => {
        if ( userInfo)
        {
              props.history.push(redirect)
        }
    },[props.history,userInfo,redirect])
    const submitHandler = (e) => {
        e.preventDefault()
        //console.log(email)
        dispatch(login(email, password));
    }
    return (
        <>
           
            <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email} onChange={(e) => setEmail(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password} onChange={(e) => setPassword(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Button type="submit" className="my-2" variant='primary' >Sign In</Button>
            </Form>
            <Row className='py-3 '>
                <Col>
                    New Customer? <Link to={redirect? `/register?redirect=${redirect}`:'/register'}>Register</Link>
                </Col>
            </Row>
            </FormContainer>
       </>
    )
}

export default LoginScreen
