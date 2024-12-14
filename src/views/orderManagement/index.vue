/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="订单号">
        <el-input size="small" clearable v-model="formInline.orderNo" placeholder="输入序号"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input size="small" clearable v-model="formInline.username" placeholder="输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系人手机号">
        <el-input size="small" clearable v-model="formInline.telPhone" placeholder="输入联系人手机号"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select clearable v-model="formInline.orderState" placeholder="请选择订单状态">
          <el-option
            v-for="item in orderStateList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <!-- <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button> -->
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table ref="myTable" size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;"  :row-class-name="tableRowClassName">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column align="center"  prop="orderNo" label="订单号" width="200">
      </el-table-column>
      <el-table-column align="center"  prop="username" label="联系人" width="100">
      </el-table-column>
      <el-table-column align="center"  prop="telPhone" label="联系人手机号" width="120">
      </el-table-column>
      <el-table-column align="center"  prop="address" label="联系人地址" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="orderComment" label="备注" width="200">
      </el-table-column>
      <el-table-column align="center"  prop="comboName" label="套餐名称" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="kickback" label="佣金" width="80">
      </el-table-column>
      <el-table-column align="center" prop="orderUsername" label="下单人" width="80">
      </el-table-column>
      <el-table-column align="center" prop="" label="下单人手机号" width="120">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="200">
      </el-table-column>
      <el-table-column align="center"  prop="orderStateName" label="订单状态" width="80">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row, 1)" v-if="scope.row.orderState == 0">同意</el-button>
          <el-button size="mini"  type="danger" @click="handleEdit(scope.$index, scope.row, 0)" v-if="scope.row.orderState == 0">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="" prop="result">
          <el-input type="textarea" size="small" clearable v-model="editForm.orderComment" placeholder="请填写备注"></el-input>
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
import { getOrderList, updateOrderState} from "../../api/api"
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      imgUrl: process.env.VUE_IMG_BASE_URL,
      baseUrl: process.env.VUE_IMG_BASE_URL,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加同意备注',
      orderStateList:[
        {
          value:-1,
          label:'办理失败'
        },
        {
          value:1,
          label:'办理成功'
        },
        {
          value:0,
          label:'办理中'
        }
      ],
      editForm: {
        id:'',
        result:'',
        orderComment:''
      },
      // rules表单验证
      rules: {
        result: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
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
      
        if (row.orderState === -1) {
          return 'fail-row';
        } else if (row.orderState === 1) {
          return 'success-row';
        } else if(row.status === 0) {
          return 'warning-row';
        }
        return '';
      },
    // 获取公司列表
    getdata(parameter) {
      this.loading = true
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
       getOrderList(parameter)
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
            this.loading = false
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
      this.formInline.orderNo = ''
      this.formInline.username = ''
      this.formInline.telPhone = ''
      this.formInline.id = ''
      this.formInline.orderState = ""
    },
    //显示编辑界面
    handleEdit: function(index, row, type) {
      this.editForm.orderComment = ''
      this.editForm.result = ''
      this.editFormVisible = true
      if (type==1) {
        this.title = '请填写同意后的备注'
        this.editForm.id = row.id
        this.editForm.result='SUCCESS'
      }else{
        this.title = '请填写拒绝后的备注'
        this.editForm.id = row.id
        this.editForm.result='FAIL'
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          updateOrderState(this.editForm)
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
      this.editForm.orderNo = ''
      this.editForm.username = ''
      this.editForm.telPhone = ''
      this.editForm.id = ''
    },
    
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
  .el-table .warning-row {
    background: rgb(253, 246, 230);
  }
</style>

 
 