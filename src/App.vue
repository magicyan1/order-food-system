<template>
  <!-- element-plus组件内部默认使用英语，如果需要其他语言则需要进行多语言设置。 -->
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>

</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'


let locale= zhCn;

</script>

<style lang="less" scoped>

</style>