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
        <el-input size="small" clearable v-model="formInline.phone" placeholder="输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="会员到期时间">
        <el-date-picker
          clearable
          v-model="formInline.vipExpirationTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
        clearable
          v-model="formInline.createTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">新增</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" ref="myTable" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;" :row-class-name="tableRowClassName">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column  prop="id" label="ID" width="100">
      </el-table-column>
      <el-table-column  prop="username" label="用户名称" width="100">
      </el-table-column>
      <el-table-column align="center" prop="headImage" label="用户头像" width="100">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.headImage"
            :preview-src-list="[imgUrl + scope.row.headImage]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="shareQrCode" label="用户分享码" width="100">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.shareQrCode"
            :preview-src-list="[imgUrl + scope.row.shareQrCode]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column  prop="phone" label="用户手机号" width="100">
      </el-table-column>
      <el-table-column  prop="vipFlag" label="是否是VIP" width="100">
      </el-table-column>
      <el-table-column  prop="vipExpirationTime" label="会员到期时间" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="totalOrderNum" label="总订单数量" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="successOrderNum" label="成功订单量" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="failOrderNum" label="失败订单量" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="totalRevenue" label="总收益" width="120">

      </el-table-column>
      <el-table-column align="center" sortable prop="totalRevenue" label="账户余额" width="120">
        
      </el-table-column>
      <el-table-column align="center" prop="revenueBalance" label="支付宝账户" width="120">
      </el-table-column>
      <el-table-column align="center" prop="bankName" label="银行名称" width="120">
      </el-table-column>
      <el-table-column align="center" prop="bankUsername" label="银行用户" width="120">
      </el-table-column>
      <el-table-column align="center" prop="bankNumber" label="银行卡号" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="createTime" label="创建时间" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="用户状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == -1">禁用</span>
          <span v-if="scope.row.status == 0">启用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="distributionStatus" label="分销状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.distributionStatus == 0">禁用</span>
          <span v-if="scope.row.distributionStatus == 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="400" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleActive(scope.$index, scope.row )" v-if="scope.row.status == -1">启用</el-button>
          <el-button size="mini" type="warning" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 0">禁用</el-button>
          <el-button size="mini" type="primary" @click="handleDistribution(scope.$index, scope.row)" v-if="scope.row.distributionStatus == 0">启用分销</el-button>
          <el-button size="mini" type="warning" @click="handleDistribution(scope.$index, scope.row)" v-if="scope.row.distributionStatus == 1">禁用分销</el-button>
          <el-button size="mini" @click="refreshCode(scope.$index, scope.row)">刷新用户分享码</el-button>
          <!-- <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 修改界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名称" prop="username">
          <el-input size="small" v-model="editForm.username" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" prop="phone">
          <el-input size="small" :disabled="editForm.userId != false" v-model="editForm.phone" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!editForm.userId">
          <el-input size="small" v-model="editForm.password" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="上传用户头像" prop="headImage" v-if="editForm.userId">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/broadband/common/file/uploadImage'"
            :show-file-list="false"
            :on-success="handleOnSuccess"
            :on-remove="handleRemove">
            <img v-if="editForm.headImage" :src="imgUrl+editForm.headImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="会员到期时间" prop="vipExpirationTime" v-if="editForm.userId">
          <el-date-picker
            v-model="editForm.vipExpirationTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="会员到期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserPage, userDisable, userEnable, userAdd, userUpdateVip, userInfoUpdate,userDistributionDisable,userDistributionEnable,refreshShareQrCode } from '../../api/api'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      imgUrl: process.env.VUE_IMG_BASE_URL,
      baseUrl: process.env.VUE_IMG_BASE_URL,
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        userId:'',
        headImage: '',
        username: '',
        phone: '',
        vipExpirationTime:'',
        password:''
      },
      // rules表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入用户代码', trigger: 'blur' }],
        // headImage: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        // vipExpirationTime: [{ required: true, message: '请选择会员到期时间', trigger: 'blur' }],
        password: [{ required: true, message: '请输入初始密码', trigger: 'blur' }]
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
        username: '',
        phone: '',
        vipExpirationTime:''
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
    tableRowClassName({row, rowIndex}) {
      
        if (row.status === -1) {
          return 'fail-row';
        } else if (row.status === 0) {
          return 'success-row';
        }
        return '';
      },
    // 获取公司列表
    getdata(parameter) {
      this.loading = true
      let parameters = JSON.parse(JSON.stringify(parameter))
      if(parameters.createTime) {
        parameters['joinStartTime'] = parameters.createTime[0]
        parameters['joinEndTime'] = parameters.createTime[1]
      }
      if(parameters.vipExpirationTime) {
        parameters['vipExpirationStarTime'] = parameters.vipExpirationTime[0]
        parameters['vipExpirationEndTime'] = parameters.vipExpirationTime[1]
      }
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      getUserPage(parameters)
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
        this.editForm.headImage = row.headImage
        this.editForm.username = row.username
        this.editForm.phone = row.phone
        this.editForm.vipExpirationTime = row.vipExpirationTime
        this.editForm.password = row.password
      } else {
        this.editFormVisible = true
        this.title = '添加用户信息'
        this.editForm.userId = ""
        this.editForm.headImage = ''
        this.editForm.username = ''
        this.editForm.phone = ''
        this.editForm.vipExpirationTime=""
        this.editForm.password = ""
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          if(this.editForm.userId) {
            userUpdateVip(this.editForm)
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
            userInfoUpdate(this.editForm)
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
          }else {
            userAdd(this.editForm)
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
        userEnable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = 0
            this.$message.success("启用成功")
            this.$refs.myTable.doLayout();
          }
        })
      }else{
        userDisable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.$message.success("禁用成功")
            this.listData[index].status = -1
            this.$refs.myTable.doLayout();
          }
        })
      }
    },
    refreshCode(index,row) {
      refreshShareQrCode({userId:row.id}).then(res => {
          if(res.code == 200) {
            this.$message.success("刷新成功")
            // this.listData[index].distributionStatus = 0
            // this.$refs.myTable.doLayout();
          }
        })
    },  
    //分销状态启用禁用
    handleDistribution: function(index, row) {
      //启用
      console.log(row.distributionStatus)
      if(row.distributionStatus == 1) {
        userDistributionDisable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.$message.success("禁用成功")
            this.listData[index].distributionStatus = 0
            this.$refs.myTable.doLayout();
          }
        })
      }else{
        userDistributionEnable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].distributionStatus = 1
            this.$message.success("启用成功")
            this.$refs.myTable.doLayout();
          }
        })
       
      }
    },
    // 删除公司
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deptDelete(row.headImage)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '已删除!'
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
              this.$message.error('删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    },
    //上传图片
    handleOnSuccess(e) {
      this.editForm.headImage=e.data
    },
    handleRemove() {
      this.editForm.headImage = ""
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

 