/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>收款账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;margin-top: 30px;">
      <el-table-column align="center" prop="alipayUsername" label="支付宝收款人姓名" width="150">
      </el-table-column>
      <el-table-column align="center" prop="alipayAccount" label="支付宝收款账号" width="200">
      </el-table-column>
      <el-table-column align="center" prop="alipayPaymentCode" label="支付宝收款码" width="200">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.alipayPaymentCode"
            :preview-src-list="[imgUrl + scope.row.alipayPaymentCode]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="weChatUsername" label="微信收款人姓名" width="150">
      </el-table-column>
      <el-table-column align="center" prop="weChatAccount" label="微信收款账号" width="200">
      </el-table-column>
      <el-table-column align="center" prop="weChatPaymentCode" label="微信收款码" width="200">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.weChatPaymentCode"
            :preview-src-list="[imgUrl + scope.row.weChatPaymentCode]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination> -->
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @close="closeDialog">
      <el-form label-width="150px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="支付宝收款人姓名" prop="alipayUsername">
          <el-input size="small" v-model="editForm.alipayUsername" auto-complete="off" placeholder="请输入支付宝收款人姓名"></el-input>
        </el-form-item>
        <el-form-item label="支付宝收款账号" prop="alipayAccount">
          <el-input size="small" v-model="editForm.alipayAccount" auto-complete="off" placeholder="请输入支付宝收款账号"></el-input>
        </el-form-item>
        <el-form-item label="支付宝收款码" prop="alipayPaymentCode">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/broadband/common/file/uploadImage'"
            :show-file-list="false"
            :on-success="apHandleOnSuccess"
            :on-remove="apHandleRemove">
            <img v-if="editForm.alipayPaymentCode" :src="imgUrl+editForm.alipayPaymentCode" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="微信收款人姓名" prop="weChatUsername">
          <el-input size="small" v-model="editForm.weChatUsername" auto-complete="off" placeholder="请输入微信收款人姓名"></el-input>
        </el-form-item>
        <el-form-item label="微信收款账号" prop="weChatAccount">
          <el-input size="small" v-model="editForm.weChatAccount" auto-complete="off" placeholder="请输入微信收款账号"></el-input>
        </el-form-item>
        <el-form-item label="微信收款码" prop="weChatPaymentCode">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/broadband/common/file/uploadImage'"
            :show-file-list="false"
            :on-success="wxHandleOnSuccess"
            :on-remove="wxHandleRemove">
            <img v-if="editForm.weChatPaymentCode" :src="imgUrl+editForm.weChatPaymentCode" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { getPayment, updatePayment } from '../../api/api'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      imgUrl: process.env.VUE_IMG_BASE_URL,
      baseUrl: process.env.VUE_IMG_BASE_URL,
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '修改收款账户',
      editForm: {
        alipayAccount: '',
        alipayPaymentCode: '',
        alipayUsername: '',
        weChatAccount: '',
        weChatPaymentCode: '',
        weChatUsername: '',
      },
      // rules表单验证
      rules: {
        alipayAccount: [{ required: true, message: '请输入支付宝账户', trigger: 'blur' }],
        alipayPaymentCode: [{ required: true, message: '请上传支付宝收款码地址', trigger: 'blur' }],
        alipayUsername: [{ required: true, message: '请输入支付宝姓名', trigger: 'blur' }],
        weChatAccount: [{ required: true, message: '请输入微信帐号', trigger: 'blur' }],
        weChatPaymentCode: [{ required: true, message: '请上传微信收款码地址', trigger: 'blur' }],
        weChatUsername: [{ required: true, message: '请输入微信用户名', trigger: 'blur' }],
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
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
    // 获取公司列表
    getdata(parameter) {
      this.loading = true

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
       getPayment(parameter)
        .then(res => {
          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.listData = [res.data]
            // 分页赋值
            this.pageparm.currentPage = this.formInline.pageNo
            this.pageparm.pageSize = this.formInline.pageSize
            this.pageparm.total = 1
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
      this.editFormVisible = true
      this.editForm.alipayAccount = row.alipayAccount
      this.editForm.alipayUsername = row.alipayUsername
      this.editForm.alipayPaymentCode = row.alipayPaymentCode
      
      this.editForm.weChatAccount = row.weChatAccount
      this.editForm.weChatPaymentCode = row.weChatPaymentCode
      this.editForm.weChatUsername = row.weChatUsername
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          updatePayment(this.editForm)
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
        } else {
          return false
        }
      })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editFormVisible = false
    },
     //上传图片
    apHandleOnSuccess(e) {
      this.editForm.alipayPaymentCode = e.data
    },
    apHandleRemove() {
      this.editForm.alipayPaymentCode = ""
    },
    //上传图片
    wxHandleOnSuccess(e) {
      this.editForm.weChatPaymentCode = e.data
    },
    wxHandleRemove() {
      this.editForm.weChatPaymentCode = ""
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
</style>
 