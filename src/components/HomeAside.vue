<template>
  <el-menu background-color="#c8d6e5" class="el-menu-vertical-demo" default-active="2" text-color="#000"
    @open="handleOpen" @close="handleClose" router="true" unique-opened="true">
    <el-menu-item index="/goods">
      <el-icon>
        <setting />
      </el-icon>
      <span>商品管理</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>订单管理</span>
      </template>
      <el-menu-item index="/order">订单列表</el-menu-item>
      <el-menu-item index="/ordermain">退款订单</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3" v-if="isShow">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>会员中心</span>
      </template>
      <el-menu-item index="/vip">会员信息管理</el-menu-item>
      <el-menu-item index="/addLevel">会员等级管理</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/review">
      <el-icon>
        <setting />
      </el-icon>
      <span>评论中心</span>
    </el-menu-item>
    <el-menu-item index="/queue">
      <el-icon>
        <IconMenu />
      </el-icon>
      <span>排队管理</span>
    </el-menu-item>
    <el-sub-menu index="6" v-if="isShow">
      <template #title>
        <el-icon>
          <Setting />
        </el-icon>
        <span>系统设置</span>
      </template>
      <el-menu-item index="/system">员工管理</el-menu-item>
      <el-menu-item index="/role">角色管理</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ElMenu, ElSubMenu, ElIcon, ElMenuItem } from "element-plus";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
let isShow = ref(true)
onMounted(() => {
  let role = sessionStorage.getItem('role')
  console.log(role, 111);
  // role == '员工' ? isShow.value = false ? isShow.value = true
  if (role == '员工') {
    isShow.value = false
  } else {
    isShow.value = true
  }
})
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
  border: none;

  .el-menu-item {
    // text-indent: 2em;
  }
}
</style>
