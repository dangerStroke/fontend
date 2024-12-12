/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>套餐管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="套餐名称：">
        <el-input size="small" clearable v-model="formInline.comboName" placeholder="套餐名称"></el-input>
      </el-form-item>
      <el-form-item label="套餐类型：">
        <el-select clearable v-model="formInline.comboType" placeholder="请选择订单状态">
          <el-option
            v-for="item in typeList"
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
    <el-table ref="myTable" size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column align="center" prop="comboName" label="套餐名称" width="100">
      </el-table-column>
      <el-table-column align="center" prop="comboType" label="套餐类型" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.comboType == 1">单宽带</span>
          <span v-if="scope.row.comboType == 0">融合套餐</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="comboUrl" label="图片" width="100">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px"
            :src="imgUrl + scope.row.comboUrl"
            :preview-src-list="[imgUrl + scope.row.comboUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createUser" label="创建人" width="100">
      </el-table-column>
      <el-table-column align="center" prop="supplierName" label="供应商名称" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="kickback" label="佣金" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="vipKickback" label="VIP佣金" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="shareKickback" label="分佣" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="vipKickback" label="会员佣金" width="100">
      </el-table-column>
      <el-table-column align="center"  prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">启用</span>
          <span v-if="scope.row.status == -1">草稿</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleActive(scope.$index, scope.row, )" v-if="scope.row.status == -1">启用</el-button>
          <el-button size="mini" type="warning" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 1">禁用</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="60%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
            <el-form-item label="部门名称" prop="deptName">
              <el-input size="small" v-model="editForm.deptName" auto-complete="off" placeholder="请输入部门名称"></el-input>
            </el-form-item>
            <el-form-item label="部门代码" prop="deptNo">
              <el-input size="small" v-model="editForm.deptNo" auto-complete="off" placeholder="请输入部门代码"></el-input>
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

import { deptList, deptSave, deptDelete } from '../../api/userMG'
import { getComboList, handleDisable, handleEnable } from '../../api/api'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      imgUrl: process.env.VUE_IMG_BASE_URL,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        deptId: '',
        deptName: '',
        deptNo: '',
      },
      // rules表单验证
      rules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        deptNo: [{ required: true, message: '请输入部门代码', trigger: 'blur' }]
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
        comboType: '',
        comboName: '',
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
      typeList:[
        {
          label:'单宽带',
          value:'-1',
        },
        {
          label:'融合套餐',
          value:'1',
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
    // 获取列表
    getdata(parameter) {
      this.loading = true
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      getComboList(parameter)
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
      this.formInline.comboType =  ''
      this.formInline.comboName =  ''
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.deptId = row.deptId
        this.editForm.deptName = row.deptName
        this.editForm.deptNo = row.deptNo
      } else {
        this.title = '添加'
        this.editForm.deptId = ''
        this.editForm.deptName = ''
        this.editForm.deptNo = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          deptSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '公司保存成功！'
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
              this.$message.error('公司保存失败，请稍后再试！')
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
    },
    //启用禁用
    handleActive: function(index, row) {
      //启用
      if(row.status == -1) {
        handleEnable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = 1
            this.$refs.myTable.doLayout();
          }
        })
      }else{
        handleDisable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = -1
            this.$refs.myTable.doLayout();
          }
        })
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

 
 