/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="用户名称">
        <el-input size="small" clearable v-model="formInline.username" placeholder="输入用户名称"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input size="small" clearable v-model="formInline.phone" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select clearable v-model="formInline.status" placeholder="请选择订单状态">
          <el-option
            v-for="item in statusOptione"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">新增</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table ref="myTable" size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;" :row-class-name="tableRowClassName">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column align="center" prop="id" label="ID" width="200">
      </el-table-column>
      <el-table-column align="center" prop="username" label="用户名称" width="100">
      </el-table-column>
      <el-table-column align="center" prop="userCode" label="用户账号" width="150">
      </el-table-column>
      <el-table-column align="center" prop="phone" label="用户手机号" width="150">
      </el-table-column>
      <!-- <el-table-column align="center" prop="" label="密码" width="150">
      </el-table-column> -->
      <el-table-column align="center" prop="ruleName" label="角色" width="120">
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">启用</span>
          <span v-if="scope.row.status == -1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="100">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="warning" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 0">禁用</el-button>
          <el-button size="mini" type="primary" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == -1">启用</el-button>
          <el-button size="mini" type="danger" @click="refreshPassword(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 修改界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @close="closeDialog">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
            <el-form-item label="用户名称" prop="username">
              <el-input size="small" :disabled="editForm.userId != ''" v-model="editForm.username" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="用户账号" prop="userCode">
              <el-input size="small" :disabled="editForm.userId != ''" v-model="editForm.userCode" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="用户手机号" prop="phone">
              <el-input size="small" :disabled="editForm.userId != ''" v-model="editForm.phone" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="editForm.userId == ''">
              <el-input size="small" v-model="editForm.password" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="用户角色" prop="roleCode" v-if="editForm.userId != ''">
              <el-select clearable v-model="editForm.roleCode" placeholder="请选择用户角色">
                <el-option
                  v-for="item in roleListOption"
                  :key="item.value"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageSysUserPage, sysUserDisable, sysUserEnable, sysUserAddd, sysUserRefreshPassword, sysUserUpdatePassWord, sysRoleList, updateUserRoles } from '../../api/api'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      imgUrl: process.env.VUE_IMG_BASE_URL,
      baseUrl: process.env.VUE_IMG_BASE_URL,
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      statusOptione:[
        {
          label:'启用',
          value:0
        },
        {
          label:'禁用',
          value:-1
        }
      ],
      editForm: {
        password:'',
        username:'',
        userCode:'',
        phone:'',
        userId:'',
        roleCode:''
      },
      // rules表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        userCode: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入用户手机号', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请选择角色', trigger: 'blur' }],
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
        username: '',
        phone: '',
        status:''
      },
      // 删除部门
      seletedata: {
        ids: '',
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      roleListOption:[]
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
    this.getRoleList()
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    tableRowClassName({row, rowIndex}) {
      
        if (row.status === -1) {
          return 'fail-row';
        } else if (row.status === 0) {
          return 'success-row';
        }
        return '';
      },
    getRoleList() {
      this.loading = true
      sysRoleList({name:''})
        .then(res => {
          this.loading = false
          if (res.code == 200) {
            this.roleListOption = res.data
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('菜单加载失败，请稍后再试！')
        })
    },
    // 获取列表
    getdata(parameter) {
      this.loading = true
      let parameters = JSON.parse(JSON.stringify(parameter))
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      pageSysUserPage(parameters)
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
          this.$message.error('菜单加载失败，请稍后再试！')
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
    refresh() {
      this.formInline.userCode = ''
      this.formInline.phone = ''
      this.formInline.userId = ''
    },
    //显示编辑界面
    handleEdit: function(index, row) {

      if (row != undefined && row != 'undefined') {
      if(row.status == 0) {
        this.$message.info("启用状态下不可编辑")
        return
      }
      this.editFormVisible = true
        
        this.title = '修改用户信息'
        this.editForm.userId = row.id,
        this.editForm.password = row.password
        this.editForm.userCode = row.userCode
        this.editForm.username = row.username
        this.editForm.phone = row.phone
        this.editForm.roleCode = row.ruleCode
      } else {
      this.editFormVisible = true
        this.title = '添加用户信息'
        this.editForm.userId = ""
        this.editForm.password = ''
        this.editForm.userCode = ''
        this.editForm.username = ''
        this.editForm.phone = ''
        this.editForm.roleCode = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          if(!this.editForm.userId) {
            sysUserAddd({...this.editForm,password:this.editForm.password})
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '保存成功！'
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
              this.$message.error('保存失败，请稍后再试！')
            })
          }else{
            updateUserRoles({
              userId:this.editForm.userId,
              roleCode:this.editForm.roleCode
            })
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
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
              this.$message.error('保存失败，请稍后再试！')
            })
          }
          
        } else {
          return false
        }
      })
    },
    //启用禁用
    handleActive: function(index, row) {
      //启用
      if(row.status == -1) {
        console.log(row)
        if(row.ruleCode == '') {
          this.$message.error('请先编辑用户权限')
          return
        }
        sysUserEnable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.$message({
              type: 'success',
              message: '启用成功'
            })
            this.listData[index].status = 0
            this.$refs.myTable.doLayout();
            
          }
        })
      }else{
        sysUserDisable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.$message({
              type: 'success',
              message: '禁用成功'
            })
            this.listData[index].status = -1
            this.$refs.myTable.doLayout();
            
          }
        })
      }
    },

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    },
    //重置密码
    refreshPassword(index,row) {
      sysUserRefreshPassword({
        id:row.id
      }).then(res=>{
        if(res.code == 200) {
          this.$message({
            type: 'success',
            message: '重置密码成功！初始密码为：000000'
          })
        }else{
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.editFormVisible = false
        this.loading = false
        this.$message.error('重置失败，请稍后再试！')
      })
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

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-table .fail-row {
    background: rgb(253, 237, 230);
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

 