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
//修改订单状态
export const updateOrderState = (params) => { return req("post", "/broadband/manage/order/updateOrderState", params) };

//获取VIP申请列表
export const getVipList = (params) => { return req("post", "/broadband/manage/vip/page", params) };
//同意VIP申请
export const vipApprove = (params) => { return req("post", "/broadband/manage/vip/approve", params) };
//拒绝VIP申请
export const vipReject = (params) => { return req("post", "/broadband/manage/vip/reject", params) };

//获取客户端用户列表
export const getUserPage = (params) => { return req("post", "/broadband/manage/client/user/page", params) };
//新增客户端用户
export const userAdd = (params) => { return req("post", "/broadband/manage/client/user/add", params) };
//禁用客户端用户
export const userDisable = (params) => { return req("get", "/broadband/manage/client/user/disable?id="+params.id, params) };
//启用客户端用户
export const userEnable = (params) => { return req("get", "/broadband/manage/client/user/enable?id="+params.id, params) }; 
//修改客户端用户VIP到期时间
export const userUpdateVip = (params) => { return req("post", "/broadband/manage/client/user/updateVipExpirationTime", params) };
//修改客户端用户信息
export const userInfoUpdate = (params) => { return req("post", "/broadband/manage/client/user/updateUserlnfo", params) };

//获取供应商列表
export const getSupplierList = (params) => { return req("post", "/broadband/manage/supplier/page", params) };
//供应商启用
export const supplierDisable = (params) => { return req("GET", "/broadband/manage/supplier/disable?id="+params.id, params) };
//供应商禁用
export const supplierEnable = (params) => { return req("GET", "/broadband/manage/supplier/enable?id="+params.id, params) };
//供应商禁用
export const supplierUpdate = (params) => { return req("post", "/broadband/manage/supplier/update", params) };

//获取客服列表
export const getWaiterPage =  (params) => { return req("post", "/broadband/manage/waiter/page", params) }
//客服启用
export const waiterDisable = (params) => { return req("GET", "/broadband/manage/waiter/disable?id="+params.id, params) };
//客服禁用
export const waiterEnable = (params) => { return req("GET", "/broadband/manage/waiter/enable?id="+params.id, params) };
//新增客服
export const waiterAdd =  (params) => { return req("post", "/broadband/manage/waiter/add", params) }
//更新客服
export const waiterUpdate =  (params) => { return req("post", "/broadband/manage/waiter/update", params) }

//获取提现管理列表
export const getApplyList = (params) => { return req("post", "/broadband/manage/withdrawal/page", params) };
//同意提现
export const applyApprove = (params) => { return req("post", "/broadband/manage/withdrawal/approve", params) };
//拒绝提现
export const applyReject= (params) => { return req("post", "/broadband/manage/withdrawal/reject", params) };

//获取关于我们
export const getAboutUs = (params) => { return req("GET", "/broadband/manage/company/aboutUs", params) };
//修改关于我们
export const updateAboutUs = (params) => { return req("post", "/broadband/manage/company/updateAboutUs", params) };

//获取公告
export const getNotice= (params) => { return req("GET", "/broadband/manage/company/notice", params) };
//修改公共
export const updateNotice = (params) => { return req("POST", "/broadband/manage/company/updateNotice", params) };

//获取收款账户
export const getPayment = (params) => { return req("GET", "/broadband/manage/company/aboutPayment", params) };
//修改收款账户
export const updatePayment = (params) => { return req("POST", "/broadband/manage/company/updatePayment", params) };