import axios from 'axios';
import { loginreq, req } from './axiosFun';

// 登录接口 
export const login = (params) => { return loginreq("post", "/broadband/manage/system/login", params) };
//获取套餐列表
export const getComboList = (params) => { return req("post", "/broadband/manage/combo/page", params) };
//套餐启用
export const handleDisable = (params) => { return req("GET", "/broadband/manage/combo/disable?id="+params.id, params) };
//套餐禁用
export const handleEnable = (params) => { return req("GET", "/broadband/manage/combo/enable?id="+params.id, params) };

//获取轮播图列表
export const getSwiperList = (params) => { return req("post", "/broadband/manage/banner/page", params) };
//轮播图启用
export const bannerDisable = (params) => { return req("GET", "/broadband/manage/banner/disable?id="+params.id, params) };
//轮播图禁用
export const bannerEnable = (params) => { return req("GET", "/broadband/manage/banner/enable?id="+params.id, params) };
//s轮播图删除
export const bannerDelete = (params) => { return req("GET", "/broadband/manage/banner/delete?id="+params.id, params) };
//轮播图添加
export const bannerAdd = (params) => { return req("post", "/broadband/manage/banner/add", params) };
//轮播图修改
export const bannerUpdate = (params) => { return req("post", "/broadband/manage/banner/update", params) };

//获取订单列表
export const getOrderList = (params) => { return req("post", "/broadband/manage/order/pageOrder", params) };
