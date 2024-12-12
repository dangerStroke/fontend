/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>VIP申请管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <!-- <el-form-item label="姓名">
        <el-input size="small" clearable v-model="formInline.username" placeholder="输入姓名"></el-input>
      </el-form-item> -->
      <el-form-item label="手机号码">
        <el-input size="small" clearable v-model="formInline.phone" placeholder="输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select clearable v-model="formInline.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          clearable
          v-model="formInline.applyTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column align="center" prop="username" label="申请人" width="200">
      </el-table-column>
      <el-table-column align="center" prop="phone" label="手机号" width="150">
      </el-table-column>
      <el-table-column align="center" prop="amount" label="金额" width="100">
      </el-table-column>
      <el-table-column align="center" prop="applyCmnt" label="备注" width="200">
      </el-table-column>
      <el-table-column align="center" prop="transferUrl" label="付款截图" width="200">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.transferUrl"
            :preview-src-list="[imgUrl + scope.row.transferUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态" width="300">
        <template slot-scope="scope">
          <span>{{ getStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="申请时间" width="300">
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row, 1)" v-if="scope.row.status == 0">同意</el-button>
          <el-button size="mini"  type="danger" @click="handleEdit(scope.$index, scope.row, 0)" v-if="scope.row.status == 0">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="理由" prop="operationCmnt">
          <el-input type="textarea" size="small" v-model="editForm.operationCmnt" auto-complete="off" placeholder="请输入理由"></el-input>
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
import { getVipList, vipApprove, vipReject } from '../../api/api'
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
      title: '添加',
      editForm: {
        id:'',
        operationCmnt:''
      },
      // rules表单验证
      rules: {
        username: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入部门代码', trigger: 'blur' }]
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
        status: '',
        applyTime: '',
        phone: '',
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
      statusList:[
        {
          label:'拒绝',
          value:-1
        },
        {
          label:'申请中',
          value:0
        },
        {
          label:'同意',
          value:1
        }
      ]
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
    getStatus(id) {
      console.log(id)
      let text = ""
      this.statusList.forEach(res => {
        if(res.value == id) {
          text = res.label
        }
      })
      return text
    },
    // 获取公司列表
    getdata(parameter) {
      this.loading = true

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
       parameter.startTime = parameter.applyTime[0]
       parameter.endTime = parameter.applyTime[1]
       getVipList(parameter)
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
      this.formInline.applyTime = ''
      this.formInline.phone =  ''
      this.formInline.status = ""
    },  
    //显示编辑界面
    handleEdit: function(index, row, type) {
       this.editForm.id = ""
        this.editForm.type = ""
        this.editForm.operationCmnt = ''
      this.editFormVisible = true
      if (type == 1) {
        this.title = '同意申请'
        this.editForm.id = row.id
        this.editForm.type = type
      } else {
        this.title = '拒绝申请'
        this.editForm.id = row.id
        this.editForm.type = type
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          if(this.editForm.type == 1) {
            vipApprove(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '修改保存成功！'
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
            vipReject(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '修改保存成功！'
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
          deptDelete(row.deptId)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '公司已删除!'
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
              this.$message.error('公司删除失败，请稍后再试！')
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

 
 