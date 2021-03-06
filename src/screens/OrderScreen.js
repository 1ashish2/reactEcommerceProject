import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button,Col, Row,ListGroup,Image,Card } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"
import { getOrderDetails, payOrder,deliverOrder} from "../actions/orderAction"
import Message from '../components/Message';
import Loader from '../components/Loader';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { ORDER_PAY_RESET,ORDER_DELIVER_RESET } from '../constants/orderConstants';

import {orderLists} from "../actions/orderAction"
const OrderScreen = (props) => {
    const orderId = props.match.params.id;
    const dispatch = useDispatch()
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails;
    
    const orderPay = useSelector(state => state.orderPay)
    const { success: successPay, loading: loadingPay } = orderPay; //renameing
    
    const orderDeliver = useSelector(state => state.orderDeliver)
    const { success: successDeliver, loading: loadingDeliver } = orderDeliver; //renameing
    
   const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    const [sdkReady, setSdkReady] = useState(false)
    useEffect(() => {
        dispatch(getOrderDetails(orderId))
        dispatch(orderLists())
        setSdkReady(true)
    },[ props.match.params.id])
    useEffect(() => {
        if (!userInfo)
        {
            props.history.push('/login')
           }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createComment('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onLoad = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }
        
        if (!order || successPay || successDeliver) {
   
            setSdkReady(true)
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
         
        } else if (order && !order.isPaid)
        {
            if (!window.paypal)
            {
                addPayPalScript()
            }
            else {
               
                setSdkReady(true)
            }
        }
       
       
    }, [dispatch,order,orderId,successPay,successDeliver])
    const successPaymentHandler = (paymentResult) => {
        // console.log("payResult",paymentResult);
        dispatch(payOrder(orderId,paymentResult))
    }
    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    return (<>
         
        { loading  ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
            <div>
               
                <h1>Order {order && order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                               <p> <strong>Name: </strong>{order && order.user.name}</p>
                                <p><strong>Email: </strong><a href={`mailto:${order && order.user.email}`}>{order && order.user.email}</a></p>
                                <p><strong>Address: </strong>
                                    {order && order.shippingAddress.address},{order && order.shippingAddress.city},
                            {order && order.shippingAddress.postalCode},{order && order.shippingAddress.state},
                            {order && order.shippingAddress.country}
                                </p>
                                { order && order.isDelivered ? <Message variant='success'>
                                    Delivered on {order && order.deliveredAt}</Message>
                                    : <Message variant='danger'>Not Delivered</Message>
                                }
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                <strong>Method: </strong>
                                    {order && order.paymentMethod}</p>
                                { order && order.isPaid ? <Message variant='success'>
                                    Paid on {order && order.paidAt}</Message>
                                    : <Message variant='danger'>Not Paid</Message>
                                }
                            
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {
                                    order && order.orderItems.length === 0 ? <Message >Order is empty</Message> :
                                        <ListGroup variant='flush'>
                                            {
                                                order && order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                            </Col>
                                                            <Col >
                                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                            </Col>
                                                            <Col md={4}>
                                                                {item.qty} x {item.price} = <i className="fas fa-rupee-sign"></i>{item.qty * item.price}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))
                                            }

                                        </ListGroup>
                                } 
                            </ListGroup.Item>

                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col><i className="fas fa-rupee-sign"></i>{order && order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col><i className="fas fa-rupee-sign"></i>{order && order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col><i className="fas fa-rupee-sign"></i>{order && order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col><i className="fas fa-rupee-sign"></i>{order && order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {order && !order.isPaid && (
                                    <ListGroup.Item>

                                        {orderPay && loadingPay && <Loader />}
                                        { !sdkReady ? <Loader /> :
                                            <PayPalButton
                                                amount={order && order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                        }
                                    </ListGroup.Item>
                                )}
                                {loadingDeliver && <Loader/>}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Row>
                                         <Button type="button" className="btn btn-block" onClick={deliverHandler}>
                                          Mark As Delivered  
                                        </Button>
                                        </Row>
                                       
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            
            </div>
        }</>)

}
export default OrderScreen
