<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-position="left"  label-width="120px">
      <el-form-item prop="password" label="原密码">
        <el-input name="password" type="password" v-model="form.original_password"placeholder="原密码"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input name="password" type="password" v-model="form.password" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item prop="password_confirmation" label="新密码">
        <el-input name="password" type="password" v-model="form.password_confirmation" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleSubmit">
          确认
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reset } from '@/api/password'

export default {
  name: 'password',
  data() {
    return {
      form: {
        original_password: '',
        password: '',
        password_confirmation: ''
      },
      loading: false
    }
  },
  methods: {
    handleSubmit() {
      this.loading = true
      reset(this.form).then(() => {
        this.$message.success('修改成功')
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
