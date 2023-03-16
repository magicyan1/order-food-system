<template>
    <div id="home">
        <header>
            <div class="header-left">
                <h2>麦乐美后台管理系统</h2>
            </div>
            <div class="header-right">
                <div>
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
                <div>
                    <el-dropdown trigger="click" hide-on-click="false">
                        <span class="el-dropdown-link">
                            更多操作
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <div @click="backLogin">退出登录</div>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>

        </header>
        <main>
            <div class="left">
                <HomeAside></HomeAside>
            </div>
            <div class="right">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import HomeAside from "../components/HomeAside.vue";
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { onMounted } from "vue";
let router = useRouter()
const backLogin = () => {
    router.replace('/login')
}
onMounted(() => {
    let user = sessionStorage.getItem('role')
    if (!user) {
        router.replace('/login')
    }
})
</script>

<style lang="less" scoped>
.el-dropdown-menu {
    width: 200px;
    text-align: center;
    margin: 0;
    padding: 0;

    div {
        height: 40px;
        line-height: 40px;
        cursor: pointer;

        &:hover {
            background-color: #ccc;
        }
    }
}

#home {
    display: flex;
    flex-direction: column;
    height: 100%;

    header {
        box-sizing: border-box;
        border-bottom: 2px solid #999;
        height: 80px;
        min-height: 80px;
        min-width: 1300px;
        background-color: #c8d6e5;
        display: flex;
        padding: 0 50px;
        align-items: center;
        justify-content: space-between;

        .header-right {
            display: flex;
            align-items: center;

            div {
                margin-left: 10px;
            }
        }
    }

    main {
        width: 100%;
        min-width: 1300px;
        min-height: calc(100% - 80px);
        display: flex;
        overflow-y: hidden;


        .left {
            width: 260px;
            background-color: burlywood;
            min-height: 100%;
            height: 9000px;
        }

        .right {
            width: calc(100% - 260px);
            background-color: #f3f3f3;
            overflow-y: scroll;
            min-height: 100%;
        }
    }

}
</style>