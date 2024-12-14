/**
* 头部菜单
*/ 
<template>
 <div>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
    <el-button class="buttonimg">
      <img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)">
    </el-button>
    <el-submenu index="2" class="submenu">
      <template slot="title">{{user.username}}</template>
      <!-- <el-menu-item index="2-1">设置</el-menu-item> -->
      <el-menu-item @click="editFormVisible = true" index="2-2">修改密码</el-menu-item>
      <el-menu-item @click="exit()" index="2-3">退出</el-menu-item>
    </el-submenu>
  </el-menu>
  <el-dialog title="修改密码" :visible.sync="editFormVisible" width="50%" @click="closeDialog">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input size="small" v-model="editForm.oldPassword" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword" >
              <el-input size="small" v-model="editForm.newPassword" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input size="small" v-model="editForm.confirmPassword" auto-complete="off" ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
 </div>
</template>
<script>
import { sysUserUpdatePassWord } from '../api/api'
export default {
  name: 'navcon',
  data() {
    return {
      editFormVisible:false,
      collapsed: true,
      imgshow: require('../assets/img/show.png'),
      imgsq: require('../assets/img/sq.png'),
      user: {},
      editForm:{
        confirmPassword:'',
        newPassword:'',
        oldPassword:'',
      },
      rules: {
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ],
        newPassword: [{ required: true, message: '请输入新面貌', trigger: 'blur' }],
        // headImage: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        // vipExpirationTime: [{ required: true, message: '请选择会员到期时间', trigger: 'blur' }],
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }]
      },
      loading:false
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.user = JSON.parse(localStorage.getItem('userdata'))
  },
  methods: {
    // 退出登录
    exit() {
      this.$confirm('退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setTimeout(() => {
            this.$store.commit('logout', 'false')
            this.$router.push({ path: '/login' })
            this.$message({
              type: 'success',
              message: '已退出登录!'
            })
          }, 1000)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 切换显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$root.Bus.$emit('toggle', this.collapsed)
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
        this.editFormVisible = false
        this.editForm={
        confirmPassword:'',
        newPassword:'',
        oldPassword:'',
      }
    },
    submitForm() {
      this.loading = true
      sysUserUpdatePassWord({...this.editForm,userId:this.user.id}).then(res => {
        this.loading = false
        if(res.code == 200) {
          this.closeDialog()
          this.$message({
            type: 'success',
            message: '修改成功！请重新登录。'
          })
          this.$store.commit('logout', 'false')
          this.$router.push({ path: '/login' })
        }
      }).catch(err => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.submenu {
  float: right;
}
.buttonimg {
  height: 60px;
  background-color: transparent;
  border: none;
}
.showimg {
  width: 26px;
  height: 26px;
  position: absolute;
  top: 17px;
  left: 17px;
}
.showimg:active {
  border: none;
}
</style>