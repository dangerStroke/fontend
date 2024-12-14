/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>客服管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="客服状态">
        <el-select clearable v-model="formInline.status" placeholder="请选择订单状态">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table ref="myTable" size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;" :row-class-name="tableRowClassName">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column align="center" prop="username" label="客服名称" width="200">
      </el-table-column>
      <el-table-column align="center" prop="phone" label="客服手机号" width="200">
      </el-table-column>
      <el-table-column align="center" prop="weChatQrCode" label="客服微信二维码" width="200">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.weChatQrCode"
            :preview-src-list="[imgUrl + scope.row.weChatQrCode]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="statusName" label="状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">启用</span>
          <span v-if="scope.row.status == 0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 0">启用</el-button>
          <el-button size="mini" type="warning" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 1">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="名称" prop="username">
          <el-input size="small" v-model="editForm.username" auto-complete="off" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input size="small" v-model="editForm.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-select clearable v-model="editForm.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item> -->
        <el-form-item label="上传微信二维码" prop="weChatQrCode">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/broadband/common/file/uploadImage'"
            :show-file-list="false"
            :on-success="handleOnSuccess"
            :on-remove="handleRemove">
            <img v-if="editForm.weChatQrCode" :src="imgUrl+editForm.weChatQrCode" class="avatar">
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
import { getWaiterPage, waiterAdd, waiterDisable, waiterEnable, waiterUpdate } from "../../api/api"
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      imgUrl: process.env.VUE_IMG_BASE_URL,
      baseUrl: process.env.VUE_IMG_BASE_URL,
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加轮播图',
      editForm: {
        id:'',
        phone: '',
        username:'',
        weChatQrCode:'',
        status: 0,
      },
      statusOption:[
        {
          value: 1,
          label:'启用'
        },
        {
          value:0,
          label:'禁用'
        }
      ],
      // rules表单验证
      rules: {
        phone: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        username: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        weChatQrCode: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
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
      
        if (row.status === 0) {
          return 'fail-row';
        } else if (row.status === 1) {
          return 'success-row';
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
       getWaiterPage(parameter)
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
      this.formInline.phone = Number(this.formInline.phone)
      this.getdata(this.formInline)
    },
    refresh() {
      this.formInline.status = ""
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      if (row != undefined && row != 'undefined') {
        if(row.status == 1) {
          this.$message.info("启用状态下不可编辑")
          return
        }
        this.editFormVisible = true
        this.title = '修改客服资料'
        this.editForm.phone = row.phone
        this.editForm.username = row.username
        this.editForm.weChatQrCode = row.weChatQrCode
        this.editForm.id = row.id
        this.editForm.status = row.status
        
      } else {
        if(row.status == 1) {
          this.$message.info("只有草稿和禁用状态下可编辑")
          return
        }
        this.title = '添加客服'
        this.editForm.phone = ''
        this.editForm.username = ''
        this.editForm.weChatQrCode = ''
        this.editForm.id = ''
        this.editForm.status = 0
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          if(!this.editForm.id) {
            waiterAdd(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '上传成功！'
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
            waiterUpdate(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '上传成功！'
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
      this.editForm.phone = ''
      this.editForm.username = ''
      this.editForm.weChatQrCode = ''
      this.editForm.id = ''
    },
    //启用禁用
    handleActive: function(index, row) {
      //启用
      if(row.status == 0) {
        waiterEnable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = 1
            this.$refs.myTable.doLayout();
            this.$message.success("启用成功")
          }
        })
      }else{
        waiterDisable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = 0
            this.$refs.myTable.doLayout();
            this.$message.success("禁用成功")
          }
        })
      }
    },
    //上传图片
    handleOnSuccess(e) {
      this.editForm.weChatQrCode=e.data
    },
    handleRemove() {
      this.editForm.weChatQrCode = ""
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

 
 