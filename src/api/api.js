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
//添加套餐列表
export const comboAdd = (params) => { return req("post", "/broadband/manage/combo/add", params) };
//修改套餐列表
export const comboUpdate = (params) => { return req("post", "/broadband/manage/combo/update", params) };

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
//订单回退
export const orderReset = (params) => { return req("post", "/broadband/manage/order/cancel", params) };
//订单接单
export const orderApprove = (params) => { return req("post", "/broadband/manage/order/approve", params) };

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
export const userInfoUpdate = (params) => { return req("post", "/broadband/manage/client/user/updateUserInfo", params) };

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
export const waiterDisable = (params) => { return req("post", "/broadband/manage/waiter/disable", params) };
//客服禁用
export const waiterEnable = (params) => { return req("POST", "/broadband/manage/waiter/enable", params) };
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

//获取数据分析
export const getAnalysisCount = () => { return req("GET", "/broadband/manage/analysis/count") };
export const getAnalysisCountQuery = (params) => { return req("POST", "/broadband/manage/analysis/query",params) };

//分销
export const pageTeamUser = (params) => { return req("POST", "/broadband/manage/client/user/pageTeamUser", params) };

//管理端用户管理查询
export const pageSysUserPage = (params) => { return req("POST", "/broadband/manage/user/page", params) };
//管理员添加
export const sysUserAddd = (params) => { return req("POST", "/broadband/manage/user/add", params) };
//管理端用户禁用
export const sysUserDisable = (params) => { return req("get", "/broadband/manage/user/disable?id="+params.id, params) };
//管理端用户启用
export const sysUserEnable = (params) => { return req("get", "/broadband/manage/user/enable?id="+params.id, params) };
//管理端用户重置密码
export const sysUserRefreshPassword = (params) => { return req("get", "/broadband/manage/user/resetPwd?id="+params.id, params) };
//管理员修改密码
export const sysUserUpdatePassWord = (params) => { return req("POST", "/broadband/manage/user/updatePassword", params) };
//获取所有角色
export const sysRoleList = (params) => { return req("POST", "/broadband/manage/role/list", params) };
//管理端用户绑定角色
export const updateUserRoles = (params) => { return req("POST", "/broadband/manage/user/saveUserRole", params) };
//获取管理端用户详情
export const getSysUserDetail = (params) => { return req("get", "/broadband/manage/user/get?id="+params.id, params) };

//获取角色菜单
export const getRolePage = (params) => { return req("POST", "/broadband/manage/role/page", params) };
//创建角色
export const createRole = (params) => { return req("POST", "/broadband/manage/role/create", params) };
//修改角色
export const updateRole = (params) => { return req("POST", "/broadband/manage/role/update", params) };
//修改角色权限
export const updateRoleMenus = (params) => { return req("POST", "/broadband/manage/role/update", params) };
//获取权限页面树
export const getRoleTree = (params) => { return req("get", "/broadband/manage/role/findByRoleCode?roleCode="+params.roleCode, params) };