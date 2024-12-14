/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <!-- <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="名称">
        <el-input size="small" clearable v-model="formInline.title" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form> -->
    <!--列表-->
    <el-table ref="myTable" size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;margin-top: 30px;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column align="center" sortable prop="orderNum" label="排序" width="200">
      </el-table-column>
      <el-table-column align="center" prop="supplierName" label="供应商名称" width="200">
      </el-table-column>
      <el-table-column align="center" prop="supplierCode" label="供应商Code" width="200">
      </el-table-column>
      <el-table-column align="center" prop="supplierUrl" label="供应商图片" width="200">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.supplierUrl"
            :preview-src-list="[imgUrl + scope.row.supplierUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="statusName" label="状态" width="120">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button size="mini" type="primary" @click="handleActive(scope.$index, scope.row, )" v-if="scope.row.status == -1">启用</el-button>
          <el-button size="mini" type="warning" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 1">禁用</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="排序" prop="orderNum">
          <el-input size="small" v-model="editForm.orderNum" auto-complete="off" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input size="small" v-model="editForm.supplierName" auto-complete="off" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="供应商CODE" prop="supplierCode">
          <el-input size="small" v-model="editForm.supplierCode" auto-complete="off" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="上传供应商图片" prop="supplierUrl">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/broadband/common/file/uploadImage'"
            :show-file-list="false"
            :on-success="handleOnSuccess"
            :on-remove="handleRemove">
            <img v-if="editForm.supplierUrl" :src="imgUrl+editForm.supplierUrl" class="avatar">
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
import { getSupplierList, supplierDisable, supplierEnable, supplierUpdate } from "../../api/api"
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
      title: '添加轮播图',
      editForm: {
        id:'',
        orderNum: '',
        supplierName:'',
        supplierUrl:'',
        supplierName:'',
        supplierCode:'',
        status:0,
      },
      // rules表单验证
      rules: {
        orderNum: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        supplierCode: [{ required: true, message: '请输入供应商Code', trigger: 'blur' }],
        supplierUrl: [{ required: true, message: '请上传供应商图片', trigger: 'blur' }]
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
    // 获取公司列表
    getdata(parameter) {
      this.loading = true
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
       getSupplierList(parameter)
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
      this.formInline.orderNum = Number(this.formInline.orderNum)
      this.getdata(this.formInline)
    },
    refresh() {
      this.formInline.supplierName = ""
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改供应商资料'
        this.editForm.orderNum = row.orderNum
        this.editForm.supplierName = row.supplierName
        this.editForm.supplierCode = row.supplierCode
        this.editForm.supplierUrl = row.supplierUrl
        this.editForm.id = row.id
      } else {
        this.title = '添加轮播图'
        this.editForm.orderNum = ''
        this.editForm.supplierName = ''
        this.editForm.supplierUrl = ''
        this.editForm.id = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          supplierUpdate(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '修改成功！'
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
    // 删除公司
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          bannerDelete({id:row.id})
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
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
      this.editForm.orderNum = ''
      this.editForm.supplierName = ''
      this.editForm.supplierUrl = ''
      this.editForm.id = ''
    },
    //启用禁用
    handleActive: function(index, row) {
      //启用
      if(row.status == -1) {
        supplierEnable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = 1
            this.$refs.myTable.doLayout();
          }
        })
      }else{
        supplierDisable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = -1
            this.$refs.myTable.doLayout();
          }
        })
      }
    },
    //上传图片
    handleOnSuccess(e) {
      this.editForm.supplierUrl=e.data
    },
    handleRemove() {
      this.editForm.supplierUrl = ""
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

 
 