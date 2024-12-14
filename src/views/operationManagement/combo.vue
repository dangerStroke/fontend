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
      <el-form-item label="套餐状态：">
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
      <el-table-column align="center" prop="comboDescr" label="套餐描述" width="100">
      </el-table-column>
      <el-table-column align="center" prop="sellingPoint" label="套餐买点" width="100">
      </el-table-column>
      <el-table-column align="center" prop="supplierName" label="供应商名称" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="kickback" label="佣金" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="vipKickback" label="VIP佣金" width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="shareKickback" label="分佣" width="100">
      </el-table-column>
      <el-table-column align="center"  prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">启用</span>
          <span v-if="scope.row.status == 0">草稿</span>
          <span v-if="scope.row.status == -1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 0 || scope.row.status == -1">启用</el-button>
          <el-button size="mini" type="warning" @click="handleActive(scope.$index, scope.row)" v-if="scope.row.status == 1 ">禁用</el-button>
          <!-- <el-button size="mini" type="warning" @click="handleDraft(scope.$index, scope.row)" v-if="scope.row.status == -1 ">存为草稿</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="60%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
            <el-form-item label="套餐名称" prop="comboName">
              <el-input size="small" v-model="editForm.comboName" auto-complete="off" placeholder="请输入套餐名称"></el-input>
            </el-form-item>
            <el-form-item label="套餐图片" prop="comboUrl">
              <el-upload
                class="avatar-uploader"
                :action="baseUrl+'/broadband/common/file/uploadImage'"
                :show-file-list="false"
                :on-success="handleOnSuccess"
                :on-remove="handleRemove">
                <img v-if="editForm.comboUrl" :src="imgUrl+editForm.comboUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="套餐详情介绍" prop="comboDescr">
              <el-input size="small" v-model="editForm.comboDescr" auto-complete="off" placeholder="请输入套餐详情介绍"></el-input>
            </el-form-item>
            <el-form-item label="套餐买点" prop="sellingPoint">
              <el-input size="small" v-model="editForm.sellingPoint" auto-complete="off" placeholder="请输入套餐买点"></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="supplierCode">
            <el-select clearable v-model="editForm.supplierCode" placeholder="请选择供应商">
                <el-option
                  v-for="item in supplierOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="佣金" prop="kickback">
              <el-input size="small" v-model="editForm.kickback" auto-complete="off" placeholder="请输入佣金"></el-input>
            </el-form-item>
            <el-form-item label="vip佣金" prop="vipKickback">
              <el-input size="small" v-model="editForm.vipKickback" auto-complete="off" placeholder="请输入一级分销金额"></el-input>
            </el-form-item>
            <el-form-item label="一级分销金额" prop="shareKickback">
              <el-input size="small" v-model="editForm.shareKickback" auto-complete="off" placeholder="请输入一级分销金额"></el-input>
            </el-form-item>
            <el-form-item label="套餐类型：" prop="comboType">
              <el-select clearable v-model="editForm.comboType" placeholder="请选择套餐类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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

import { getComboList, handleDisable, handleEnable, comboAdd, comboUpdate } from '../../api/api'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      supplierOption:[
        {
          value:'CUCC',
          label:'中国联通'
        },
        {
          value:'CMCC',
          label:'中国移动'
        },
        {
          value:'CTCC',
          label:'中国电信'
        },
      ],
      imgUrl: process.env.VUE_IMG_BASE_URL,
      baseUrl: process.env.VUE_IMG_BASE_URL,
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      editForm: {
        comboName: '',
        comboUrl: '',
        comboDescr:'',
        sellingPoint:'',
        kickback:'',
        shareKickback:'',
        comboType:'',
        status:-1,
        supplierCode:'',
        vipKickback:''
      },
      // rules表单验证
      rules: {
        comboName: [
          { required: true, message: '请输入套餐名称', trigger: 'blur' }
        ],
        comboUrl: [{ required: true, message: '请上传套餐图片', trigger: 'blur' }],
        comboDescr: [{ required: true, message: '请输入套餐描述', trigger: 'blur' }],
        sellingPoint: [{ required: true, message: '请输入套餐买点', trigger: 'blur' }],
        kickback: [{ required: true, message: '请输入套餐佣金', trigger: 'blur' }],
        shareKickback: [{ required: true, message: '请输入一级分销金额', trigger: 'blur' }],
        vipKickback: [{ required: true, message: '请输入vip佣金', trigger: 'blur' }],
        comboType: [{ required: true, message: '请选择套餐类型', trigger: 'blur' }],
        supplierCode: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
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
          value: 1,
        },
        {
          label:'融合套餐',
          value:0,
        }
      ],
      statusOption:[
        {
          label:'启用',
          value: 1,
        },
        {
          label:'草稿',
          value:0,
        },
        {
          label:'禁用',
          value: -1,
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
    tableRowClassName({row, rowIndex}) {
      
        if (row.status === -1) {
          return 'fail-row';
        } else if (row.status === 1) {
          return 'success-row';
        } else if(row.status == 0) {
          return 'warning-row'
        }
        return '';
      },
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
      if (row != undefined && row != 'undefined') {
        if(row.status == 1) {
          this.$message.info("只有草稿和禁用状态下可编辑")
          return
        }
        
        this.editFormVisible = true
        this.title = '修改套餐'
        this.editForm.id = row.id
        this.editForm.comboName = row.comboName
        this.editForm.comboUrl = row.comboUrl
        this.editForm.comboDescr = row.comboDescr
        this.editForm.sellingPoint = row.sellingPoint
        this.editForm.kickback = row.kickback
        this.editForm.shareKickback = row.shareKickback
        this.editForm.comboType = row.comboType
        this.editForm.vipKickback = row.vipKickback
        this.editForm.supplierCode = row.supplierCode
        
      } else {
        this.editFormVisible = true
        this.title = '添加套餐'
        this.editForm.comboName = ''
        this.editForm.comboUrl = ''
        this.editForm.comboDescr = ''
        this.editForm.sellingPoint = ''
        this.editForm.kickback = ''
        this.editForm.shareKickback = ''
        this.editForm.comboType = ''
        this.editForm.vipKickback = ''
        this.editForm.supplierCode = ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          this.supplierOption.map(res => {
            if(res.value == this.editForm.supplierCode) {
              this.editForm.supplierName = res.label
            }
          })
         if(this.editForm.id) {
          
          comboUpdate(this.editForm)
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
          comboAdd(this.editForm)
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

    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editForm.id = ''
      this.editForm.comboName = ''
      this.editForm.comboUrl = ''
      this.editForm.comboDescr = ''
      this.editForm.sellingPoint = ''
      this.editForm.kickback = ''
      this.editForm.shareKickback = ''
      this.editFormVisible = false
    },
    //启用禁用
    handleActive: function(index, row) {
      //启用
      if(row.status == -1 || row.status == 0) {
        handleEnable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = 1
            this.$refs.myTable.doLayout();
          }
        })
      }else if(row.status == 1){
        handleDisable({id:row.id}).then(res => {
          if(res.code == 200) {
            this.listData[index].status = -1
            this.$refs.myTable.doLayout();
          }
        })
      }
    },
    //存为草稿
    handleDraft(index, row) {
      this.editForm.id = row.id
      this.editForm.comboName = row.comboName
      this.editForm.comboUrl = row.comboUrl
      this.editForm.comboDescr = row.comboDescr
      this.editForm.sellingPoint = row.sellingPoint
      this.editForm.kickback = row.kickback
      this.editForm.shareKickback = row.shareKickback
      this.editForm.comboType = row.comboType
      this.editForm.vipKickback = row.vipKickback
      this.editForm.supplierCode = row.supplierCode
      this.editForm.status = 0
      comboUpdate(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.listData[index].status = 0
                this.$refs.myTable.doLayout();
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
    },
    //上传图片
    handleOnSuccess(e) {
      this.editForm.comboUrl=e.data
    },
    handleRemove() {
      this.editForm.comboUrl = ""
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
  .el-table .warning-row {
    background: rgb(253, 246, 230);
  }
</style>
 
 