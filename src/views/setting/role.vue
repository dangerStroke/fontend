/**
 * 系统管理  角色管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">

      <el-form-item label="角色代码">
        <el-input size="small" v-model="formInline.name" placeholder="输入角色代码"></el-input>
      </el-form-item>
      <el-form-item label="角色代码">
        <el-input size="small" v-model="formInline.code" placeholder="输入角色代码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" prop="name" label="角色名称" width="180">
      </el-table-column>
      <el-table-column align="center" prop="code" label="角色代码" width="180">
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注" width="180">
      </el-table-column>
      <el-table-column align="center" prop="updateTime" label="修改时间" width="180">
      </el-table-column>
      <el-table-column align="center" prop="updateUser" label="修改人" width="180">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="success" @click="menuAccess(scope.$index, scope.row)">菜单权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="120px" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="code">
          <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="请输入角色代码"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="code">
          <el-input size="small" v-model="editForm.remark" auto-complete="off" placeholder="请输入角色代码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
    <!-- 菜单权限 -->
    <el-dialog title="菜单权限" :visible.sync="menuAccessshow" width="30%" @click='closeDialog("perm")'>
      <el-tree ref="tree" default-expand-all :data="RoleRight" :props="RoleRightProps" :default-checked-keys="checkmenu" node-key="menuid" show-checkbox>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("perm")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="menuPermSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolePage,
  updateRole,
  createRole,
  updateRoleMenus
}from '../../api/api'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      menuAccessshow: false, //控制数据权限显示与隐藏
      title: '添加',
      editForm: {
        id: '',
        code: '',
        name: '',
        remark:''
      },
      // rules 表单验证
      rules: {
        code: [
          { required: true, message: '请输入角色代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
        name:'',
        code:''
      },
      // 删除
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 数据权限
      RoleRight: [
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
              parentId:5,
              menuid: 51,
              icon: 'el-icon-picture',
              menuname: '轮播图管理',
              hasThird: 'N',
              url: 'operationManagement/swiper',
              menus: null
            },
            {
              parentId:5,
              menuid: 52,
              icon: 'icon-cat-skuQuery',
              menuname: '供应商管理',
              hasThird: 'N',
              url: 'operationManagement/supplier',
              menus: null
            },
            {
              parentId:5,
              menuid: 53,
              icon: 'icon-cat-skuQuery',
              menuname: '套餐管理',
              hasThird: 'N',
              url: 'operationManagement/combo',
              menus: null
            },
            {
              parentId:5,
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
              parentId:5,
              menuid: 56,
              icon: 'icon-cat-skuQuery',
              menuname: '关于我们',
              hasThird: 'N',
              url: 'operationManagement/about',
              menus: null
            },
            {
              parentId:5,
              menuid: 57,
              icon: 'icon-cat-skuQuery',
              menuname: '公告',
              hasThird: 'N',
              url: 'operationManagement/notice',
              menus: null
            },
            {
              parentId:5,
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
              parentId:6,
              menuid: 61,
              icon: 'icon-cat-skuQuery',
              menuname: '提现申请',
              hasThird: 'N',
              url: 'financeManagement/apply',
              menus: null
            }, {
              parentId:6,
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
              parentId:8,
              menuid: 81,
              icon: 'icon-cms-manage',
              menuname: '角色管理',
              hasThird: 'N',
              url: 'setting/role',
              menus: null
            }, {
              parentId:8,
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
      RoleRightProps: {
        children: 'menus',
        label: 'menuname'
      },
      // 选中
      checkmenu: [],
      //参数role
      saveroleId: '',
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  watch: {},

  /**
   * 创建完毕
   */

  created() {
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */

  methods: {
    // 获取列表
    getdata(parameter) {
      // 模拟数据
      this.loading = false

      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
       getRolePage(parameter)
        .then(res => {
          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.listData = res.data.items
            // 分页赋值
            this.pageparm.currentPage = this.formInline.pageNo
            this.pageparm.pageSize = this.formInline.pageSize
            this.pageparm.total = res.data.totalNum
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('获取角色列表失败，请稍后再试！')
        })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.pageNo = parm.currentPage
      this.formInline.pageSize = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示页面权限编辑页面
    menuAccess: function(index,row) {
      this.menuAccessshow = true
      this.saveroleId = row.id
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.id = row.id
        this.editForm.code = row.code
        this.editForm.name = row.name
        this.editForm.remark = row.remark
      } else {
        this.title = '添加'
        this.editForm.id = ''
        this.editForm.code = ''
        this.editForm.name = ''
        this.editForm.remark = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
         if(this.editForm.id) {
          updateRole(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '角色保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('角色保存失败，请稍后再试！')
            })
         }else {
          createRole(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '角色保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('角色保存失败，请稍后再试！')
            })
         }
        } else {
          return false
        }
      })
    },
    // 删除角色
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          roleDelete(row.id)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '角色已删除！'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('角色删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 选中菜单
    changemenu(arr) {
      let change = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
          change.push(arr[i].id)
        }
      }
      this.checkmenu = change
    },
    
    buildCheckedTree(treeData, checkedKeys) {
      return treeData.reduce((acc, node) => {
        if (checkedKeys.includes(node.menuid)) {
          console.log(node)
          const newNode = {...node};
          if (node.menus) {
            console.log(node)
            // newNode.menus = this.buildCheckedTree(node.menus, checkedKeys);
          }
          acc.push(newNode);
        }
        return acc;
      }, []);
    },
    // 菜单权限-保存
    menuPermSave() {
      let param = {
        id: this.saveroleId,
        menuJson:[]
      }
      let node = this.$refs.tree.getCheckedNodes()
      const checkedKeys = node.map(node => node.menuid);
      param.menuJson = this.buildCheckedTree(this.RoleRight, checkedKeys);
      console.log(param.menuJson)
      // updateRoleMenus(param)
      //   .then(res => {
      //     if (res.success) {
      //       this.$message({
      //         type: 'success',
      //         message: '权限保存成功'
      //       })
      //       this.menuAccessshow = false
      //       this.getdata(this.formInline)
      //     } else {
      //       this.$message({
      //         type: 'info',
      //         message: res.msg
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     this.loading = false
      //     this.$message.error('权限保存失败，请稍后再试！')
      //   })
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == 'edit') {
        this.editFormVisible = false
      } else if (dialog == 'perm') {
        this.menuAccessshow = false
      }
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 