// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import Index from '@/views/index';
/**
 * 基础菜单
 */
//数据分析
import DataAnalysis from '@/views/dataAnalysis/index'
//用户管理
import UserManagement from '@/views/userManagement/index'
//vip管理
import VipManagement from '@/views/vipManagement/index'
//订单管理
import OrderManagement from '@/views/orderManagement/index'

//轮播图管理
import Swiper from '@/views/operationManagement/swiper'
//供应商管理
import Supplier from '@/views/operationManagement/supplier'
//套餐管理
import SetMenu from '@/views/operationManagement/setMenu'
//客服
import CustomerService from '@/views/operationManagement/customerService'
//关于我们
import About from '@/views/operationManagement/about'
//公告
import Notice from '@/views/operationManagement/notice'
//收款账号设置
import Number from '@/views/operationManagement/number'

//提现申请
import Apply from '@/views/moneyManagement/apply'
//历史打款记录
import History from '@/views/moneyManagement/history'

//角色管理
import Role from '@/views/setting/role'
//用户管理
import User from '@/views/setting/user'



// 启用路由
Vue.use(Router);

// 导出路由 
export default new Router({
    routes: [{
        path: '/',
        name: '',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/login',
        name: '登录',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/index',
        name: '首页',
        component: Index,
        iconCls: 'el-icon-tickets',
        children: [{
            path: '/dataAnalysis/index',
            name: '数据分析',
            component: DataAnalysis,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/userManagement/index',
            name: '用户管理',
            component: UserManagement,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/vipManagement/index',
            name: 'VIP管理',
            component: VipManagement,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/orderManagement/index',
            name: '订单管理',
            component: OrderManagement,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/operationManagement/swiper',
            name: '轮播图管理',
            component: Swiper,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/operationManagement/supplier',
            name: '供应商管理',
            component: Supplier,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/operationManagement/setMenu',
            name: '套餐管理',
            component: SetMenu,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/operationManagement/customerService',
            name: '客服',
            component: CustomerService,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/operationManagement/about',
            name: '关于我们',
            component: About,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/operationManagement/notice',
            name: '公告',
            component: Notice,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/operationManagement/number',
            name: '收款账号设置',
            component: Number,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/financeManagement/apply',
            name: '提现申请',
            component: Apply,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/financeManagement/history',
            name: '历史打款记录',
            component: History,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/setting/role',
            name: '角色管理',
            component: Role,
            meta: {
                requireAuth: true
            }
        }, {
            path: '/setting/user',
            name: '系统用户管理',
            component: User,
            meta: {
                requireAuth: true
            }
        }]
    }]
})