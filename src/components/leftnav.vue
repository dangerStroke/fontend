/**
* 左边菜单
*/ 
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened
    class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <div v-for="menu in allmenu" :key="menu.menuid">
      <el-submenu :key="menu.menuid" :index="menu.menuname" v-if="menu.menus">
        <template slot="title" >
          <i class="iconfont" :class="menu.icon"></i>
          <span v-if="!collapsed">{{ menu.menuname }}</span>
        </template>

        <el-menu-item-group>
          <el-menu-item v-for="chmenu in menu.menus" :index="'/' + chmenu.url" :key="chmenu.menuid">
            <!-- <i class="iconfont" :class="chmenu.icon"></i> -->
            <span>{{ chmenu.menuname }}</span>
          </el-menu-item>
        </el-menu-item-group>

      </el-submenu>
      <div v-else>
        <el-menu-item :index="'/' + menu.url" :key="menu.menuid" >
          <i class="iconfont" :class="menu.icon"></i>
          <span v-if="!collapsed">{{ menu.menuname }}</span>
        </el-menu-item>
      </div>
    </div>
  </el-menu>
</template>
<script>
import { menu } from '../api/userMG'
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: []
    }
  },
  created() {
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: 'li-icon-shujujiankong',
          menuname: '数据分析',
          hasThird: 'N',
          url: 'dataAnalysis/index',
          menus: null
        },
        {
          menuid: 2,
          icon: 'icon-cus-manage',
          menuname: '用户管理',
          hasThird: 'N',
          url: 'userManagement/index',
          menus: null
        },
        {
          menuid: 3,
          icon: 'icon-news-manage',
          menuname: 'VIP管理',
          hasThird: 'N',
          url: 'vipManagement/index',
          menus: null
        },
        {
          menuid: 4,
          icon: 'icon-order-manage',
          menuname: '订单管理',
          hasThird: 'N',
          url: 'orderManagement/index',
          menus: null
        },
        {
          menuid: 5,
          icon: 'icon-cms-manage',
          menuname: '运营管理',
          hasThird: 'N',
          url: 'operationManagement',
          menus: [
            {
              menuid: 51,
              icon: 'el-icon-picture',
              menuname: '轮播图管理',
              hasThird: 'N',
              url: 'operationManagement/swiper',
              menus: null
            },
            {
              menuid: 52,
              icon: 'icon-cat-skuQuery',
              menuname: '供应商管理',
              hasThird: 'N',
              url: 'operationManagement/supplier',
              menus: null
            },
            {
              menuid: 53,
              icon: 'icon-cat-skuQuery',
              menuname: '套餐管理',
              hasThird: 'N',
              url: 'operationManagement/combo',
              menus: null
            },
            {
              menuid: 54,
              icon: 'icon-cat-skuQuery',
              menuname: '客服管理',
              hasThird: 'N',
              url: 'operationManagement/customerService',
              menus: null
            },
            // {
            //   menuid: 55,
            //   icon: 'icon-cat-skuQuery',
            //   menuname: '公司信息管理',
            //   hasThird: 'N',
            //   url: 'companyInfo/about',
            //   menus: null
            // },
            {
              menuid: 56,
              icon: 'icon-cat-skuQuery',
              menuname: '关于我们',
              hasThird: 'N',
              url: 'operationManagement/about',
              menus: null
            },
            {
              menuid: 57,
              icon: 'icon-cat-skuQuery',
              menuname: '公告',
              hasThird: 'N',
              url: 'operationManagement/notice',
              menus: null
            },
            {
              menuid: 58,
              icon: 'icon-cat-skuQuery',
              menuname: '收款账号设置',
              hasThird: 'N',
              url: 'operationManagement/payment',
              menus: null
            }
          ]
        },
        {
          menuid: 6,
          icon: 'li-icon-shangchengxitongtubiaozitihuayuanwenjian91',
          menuname: '财务管理',
          hasThird: null,
          url: 'financeManagement',
          menus: [
            {
              menuid: 61,
              icon: 'icon-cat-skuQuery',
              menuname: '提现申请',
              hasThird: 'N',
              url: 'financeManagement/apply',
              menus: null
            }, {
              menuid: 62,
              icon: 'icon-cat-skuQuery',
              menuname: '历史打款记录',
              hasThird: 'N',
              url: 'financeManagement/history',
              menus: null
            }
          ]
        },
        
        {
          menuid: 7,
          icon: 'icon-cat-skuQuery',
          menuname: '分销管理',
          hasThird: 'N',
          url: 'distribution/index',
          menus: null
        },
        {
          menuid: 8,
          icon: 'li-icon-xitongguanli',
          menuname: '系统设置',
          hasThird: null,
          url: 'setting',
          menus: [
            {
              menuid: 81,
              icon: 'icon-cms-manage',
              menuname: '角色管理',
              hasThird: 'N',
              url: 'setting/role',
              menus: null
            }, {
              menuid: 82,
              icon: 'icon-news-manage',
              menuname: '用户管理',
              hasThird: 'N',
              url: 'setting/user',
              menus: null
            }
          ]
        },
      ],
      msg: 'success'
    }
    this.allmenu = res.data

    // menu(localStorage.getItem('logintoken'))
    //   .then(res => {
    //     console.log(JSON.stringify(res))
    //     if (res.success) {
    //       this.allmenu = res.data
    //     } else {
    //       this.$message.error(res.msg)
    //       return false
    //     }
    //   })
    //   .catch(err => {
    //     this.$message.error('菜单加载失败，请稍后再试！')
    //   })
    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.el-menu-item-group__title {
  padding: 0px;
}

.el-menu-bg {
  background-color: #1f2d3d !important;
}

.el-menu {
  border: none;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}

.logoimg {
  height: 40px;
}
</style>