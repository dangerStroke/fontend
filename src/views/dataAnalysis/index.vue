/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据分析</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="out-border">
      <el-row :gutter="20" class="custom-row">
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="countInfo.todayOrderNum"
              title="今日订单量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="countInfo.thisMonthOrderNum"
              title="本月订单量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="countInfo.totalOrderNum"
              title="总计订单数量"
            >
              <template slot="title">
                <span style="font-weight: bold">总订单量</span>
              </template></el-statistic
            >
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="countInfo.todayClueNum"
              title="今日线索数量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="countInfo.thisWeekClueNum"
              title="本周线索数量"
            ></el-statistic>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="type">
        <el-col :span="8" class="type-col">
          <div class="type-title">电信</div>
          <div class="maring-btm-8">
            今日订单数量:
            <span class="type-num">{{ countInfo.todayDxOrderNum }}</span>
          </div>
          <div class="maring-btm-8">
            本月订单数量:
            <span class="type-num">{{ countInfo.thisMonthDxOrderNum }}</span>
          </div>
          <div class="maring-btm-8">
            总计订单数量:
            <span class="type-num">{{ countInfo.totalDxOrderNum }}</span>
          </div>
        </el-col>
        <el-col :span="8" class="type-col">
          <div class="type-title">移动</div>
          <div class="maring-btm-8">
            今日订单数量:
            <span class="type-num">{{ countInfo.todayYdOrderNum }}</span>
          </div>
          <div class="maring-btm-8">
            本月订单数量:
            <span class="type-num">{{ countInfo.thisMonthYdOrderNum }}</span>
          </div>
          <div class="maring-btm-8">
            总计订单数量:
            <span class="type-num">{{ countInfo.totalYdOrderNum }}</span>
          </div>
        </el-col>
        <el-col :span="8" class="type-col">
          <div class="type-title">联通</div>
          <div class="maring-btm-8">
            今日订单数量:
            <span class="type-num">{{ countInfo.todayLtOrderNum }}</span>
          </div>
          <div class="maring-btm-8">
            本月订单数量:
            <span class="type-num">{{ countInfo.thisMonthLtOrderNum }}</span>
          </div>
          <div class="maring-btm-8">
            总计订单数量:
            <span class="type-num">{{ countInfo.totalLtOrderNum }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="out-border">
      <div style="display: flex;">
        <div>
        <span style="font-size: 12px;">搜索：</span>
      <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </div>
      <el-button size="mini" style="margin-left: 16px;" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    
      </div>
     <el-row :gutter="20" class="custom-row" style="border-bottom: unset;margin-top: 16px">
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="queryCount.clueNum"
              title="线索数量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="queryCount.dxOrderNum"
              title="电信订单数量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="queryCount.ydOrderNum"
              title="移动订单数量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="queryCount.ltOrderNum"
              title="联通订单数量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-statistic
              group-separator=","
              :precision="0"
              :value="queryCount.orderNum"
            >
              <template slot="title">
                <span style="font-weight: bold">总计订单数量</span>
              </template></el-statistic
            >
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { getAnalysisCount, getAnalysisCountQuery } from "../../api/api";
export default {
  data() {
    return {
      countInfo: {}, 
      dateRange:[],
      queryCount:{}
    };
  },
  // 注册组件
  components: {},
  created() {
    this.getQuery();
    this.getCount();
  },
  methods: {
    getCount() {
      getAnalysisCount().then((res) => {
        console.log("getAnalysisCount", res);
        this.countInfo = res.data;
      });
    },
    getQuery(){
      let data = {
        endTime:'',
        startTime:''
      }
      if(this.dateRange.length>0){
        data.startTime = this.dateRange[0]
        data.endTime = this.dateRange[1]
      }
      getAnalysisCountQuery(data).then(res=>{
        this.queryCount =res.data;
      })
    },
   

    // 搜索事件
    search() {
      this.getQuery()
    },
  },
};
</script>

<style scoped >
.out-border {
  border: 1px solid #f2f2f2;
  margin: 16px;
  padding: 16px;
  border-radius: 4px;
}
.type {
  font-size: 13px;
  color: #606266;
}
.custom-row {
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 16px;
}
.type-col {
  padding: 16px;
  padding-bottom: 0;
}
.type-num {
  color: #303133;
  font-size: 18px;
}
.type-title {
  color: #303133;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: bold;
}
.maring-btm-8 {
  margin-bottom: 8px;
}
.user-search {
  margin-top: 20px;
}
</style>

 
 