
/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分销管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="会员名称">
        <el-input size="small" clearable v-model="formInline.username" placeholder="输入会员名称"></el-input>
      </el-form-item>
      <el-form-item label="会员手机号">
        <el-input size="small" clearable  v-model="formInline.phone" placeholder="输入会员手机号"></el-input>
      </el-form-item>
      <el-form-item label="加入时间">
        <el-date-picker
          clearable
          v-model="formInline.joinTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;margin-top: 30px;">
      <el-table-column align="center" prop="username" label="会员名" width="120">
      </el-table-column>
      <el-table-column align="center" prop="phone" label="手机号" width="200">
      </el-table-column>
      <el-table-column align="center" prop="promotionUsername" label="推荐人姓名" width="120">
      </el-table-column>
      <el-table-column align="center" prop="promotionPhone" label="推荐人手机号" width="150">
      </el-table-column>
      <el-table-column sortable align="center" prop="shareNum" label="分销团队人数" width="150">
      </el-table-column>
      <el-table-column sortable align="center" prop="shareTotalOrderNum" label="分销团队总订单数" width="150">
      </el-table-column>
      <el-table-column sortable align="center" prop="shareSuccessOrderNum" label="分销团队成功订单数" width="180">
      </el-table-column>
      <el-table-column sortable align="center" prop="shareTotalRevenue" label="分销团队总收益" width="150">
      </el-table-column>
      <el-table-column  sortable align="center" prop="createTime" label="加入时间" width="200">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">查看分销信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="editFormVisible" width="60%" @close="closeDialog">
      <el-form :inline="true" :model="detailformInline" class="user-search">
      <el-form-item label="会员名称">
        <el-input size="small" clearable v-model="detailformInline.username" placeholder="输入会员名称"></el-input>
      </el-form-item>
      <el-form-item label="会员手机号">
        <el-input size="small" clearable v-model="detailformInline.phone" placeholder="输入会员手机号"></el-input>
      </el-form-item>
      <el-form-item label="加入时间">
        <el-date-picker
          clearable
          v-model="detailformInline.joinTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchDetail">搜索</el-button>
      </el-form-item>
    </el-form>
        <el-table size="small" :data="dateDetail" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;margin-top: 30px;">
            <el-table-column align="center" prop="username" label="会员名" width="200">
        </el-table-column>
        <el-table-column align="center" prop="phone" label="手机号" width="200">
        </el-table-column>
        <el-table-column align="center" prop="promotionUsername" label="推荐人姓名" width="120">
        </el-table-column>
        <el-table-column align="center" prop="promotionPhone" label="推荐人手机号" width="150">
        </el-table-column>
        <el-table-column sortable align="center" prop="shareNum" label="分销团队人数" width="200">
        </el-table-column>
        <el-table-column sortable align="center" prop="shareTotalOrderNum" label="分销团队总订单数" width="200">
        </el-table-column>
        <el-table-column sortable align="center" prop="shareSuccessOrderNum" label="分销团队成功订单数" width="200">
        </el-table-column>
        <el-table-column sortable align="center" prop="shareTotalRevenue" label="分销团队总收益" width="200">
        </el-table-column>
        <el-table-column  sortable align="center" prop="createTime" label="加入时间" width="200">
        </el-table-column>
        </el-table>
        <Pagination v-bind:child-msg="detailpageparm" @callFather="calldetailFather"></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>

    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
  </div>
</template>

<script>
import { pageTeamUser } from '../../api/api'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title:'',
      editForm: {
        deptId: '',
        username: '',
        phone: '',
        token: localStorage.getItem('logintoken')
      },
      formInline: {
        pageNo: 1,
        pageSize: 10,
        phone: '',
        username: '',
        joinTime:[]
      },
      detailformInline: {
        pageNo: 1,
        pageSize: 10,
        phone: '',
        username: '',
        joinTime:[]
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      dateDetail:[],
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      detailpageparm: {
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
      let parameters = JSON.parse(JSON.stringify(parameter))
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
       parameters['joinStartTime'] = parameters.joinTime[0]
       parameters['joinEndTime'] = parameters.joinTime[1]
       pageTeamUser(parameters)
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
    calldetailFather(parm) {
      this.detailformInline.pageNo = parm.currentPage
      this.detailformInline.pageSize = parm.pageSize
      this.getdetaildata(this.detailformInline)
    },
    getdetaildata(parameter) {
      this.loading = true
      let parameters = JSON.parse(JSON.stringify(parameter))
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
       parameters['joinStartTime'] = parameters.joinTime[0]
       parameters['joinEndTime'] = parameters.joinTime[1]
       pageTeamUser(parameters)
        .then(res => {
          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.dateDetail = res.data.items
            // 分页赋值
            this.detailpageparm.currentPage = this.detailformInline.pageNo
            this.detailpageparm.pageSize = this.detailformInline.pageSize
            this.detailpageparm.total = res.data.totalNum
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('加载失败，请稍后再试！')
        })
    },
    handleEdit: function(index, row) {
      this.detailformInline.shareUserId = row.shareUserId
      this.title = row.username+'的分销详情'
      this.editFormVisible = true
      this.detailformInline.shareUserId = row.id
      this.getdetaildata(this.detailformInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    searchDetail() {
      this.getdetaildata(this.detailformInline)
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

 
 