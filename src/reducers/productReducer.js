import React from 'react'
import {PRODUCT_FAIL,PRODUCT_REQUEST,PRODUCT_SUCCESS,PRODUCT_DETAIL_FAIL,PRODUCT_DETAIL_REQUEST,PRODUCT_DETAIL_SUCCESS, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAIL, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAIL, PRODUCT_CREATE_RESET, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_FAIL, PRODUCT_UPDATE_RESET, PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_CREATE_REVIEW_FAIL, PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants"
export const productReducer = (state={products:[]},action) => {
    switch (action.type)
    {
        case PRODUCT_REQUEST:
            return { loading: true,products:[] }
        case PRODUCT_SUCCESS:
            return {
                loading: false,
                products: action.payload
            } //because we have pagination now in backend and returning multiple data from backend 
        case PRODUCT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state

    }
}

export const productFilterReducer = (state={products:[]},action) => {
    switch (action.type)
    {
        case PRODUCT_REQUEST:
            return { loading: true,products:[] }
        case PRODUCT_SUCCESS:
            return {
                loading: false,
                products: action.payload.productslist,
                pages: action.payload.pages,
                page:action.payload.page
            } //because we have pagination now in backend and returning multiple data from backend 
        case PRODUCT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state

    }
}

// export const productReducer = (state={products:[]},action) => {
//     switch (action.type)
//     {
//         case PRODUCT_REQUEST:
//             return { loading: true,products:[] }
//         case PRODUCT_SUCCESS:
//             return {
//                 loading: false,
//                 products: action.payload.products,
//                 pages: action.payload.pages,
//                 page:action.payload.page
//             } //because we have pagination now in backend and returning multiple data from backend 
//         case PRODUCT_FAIL:
//             return { loading: false, error: action.payload }
//         default:
//             return state

//     }
// }

export const productDetailReducer = (state={product:{reviews:[]}},action) => {
    switch (action.type)
    {
        case PRODUCT_DETAIL_REQUEST:
            return { loading: true,...state }
        case PRODUCT_DETAIL_SUCCESS:
            return { loading: false, product: action.payload }
        case PRODUCT_DETAIL_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state

    }
}

export const deleteProductReducer = (state={},action) => {
    switch (action.type)
    {
        case PRODUCT_DELETE_REQUEST:
            return { loading: true}
        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success:true }
        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state

    }
}


export const createProductReducer = (state={},action) => {
    switch (action.type)
    {
        case PRODUCT_CREATE_REQUEST:
            return { loading: true}
        case PRODUCT_CREATE_SUCCESS:
            return { loading: false, success:true,product:action.payload }
        case PRODUCT_CREATE_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCT_CREATE_RESET:
            return {}
        default:
            return state

    }
}


export const updateProductReducer = (state={product:{}},action) => {
    switch (action.type)
    {
        case PRODUCT_UPDATE_REQUEST:
            return { loading: true}
        case PRODUCT_UPDATE_SUCCESS:
            return { loading: false, success:true,product:action.payload }
        case PRODUCT_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCT_UPDATE_RESET:
            return {product:{}}
        default:
            return state

    }
}


export const createProductReviewReducer = (state={},action) => {
    switch (action.type)
    {
        case PRODUCT_CREATE_REVIEW_REQUEST:
            return { loading: true}
        case PRODUCT_CREATE_REVIEW_SUCCESS:
            return { loading: false, success:true}
        case PRODUCT_CREATE_REVIEW_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCT_CREATE_REVIEW_RESET:
            return {}
        default:
            return state

    }
}
