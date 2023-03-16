<template>
    <div id="loginBox">
        <div class="container">
            <div class="tit">登录</div>
            <input type="text" placeholder="账号" v-model="user">
            <input type="password" placeholder="密码" v-model="pwd">
            <button @click="login">登录</button>
        </div>
        <div class="square">
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
        <div class="circle">
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { computed, ref, onMounted } from "vue";
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore();
const router = useRouter()

const count = computed(() => store.state.count)
let user = ref('')
let pwd = ref('')
const login = () => {
    axios({
        url: '/login',
        method: 'post',
        params: {
            userName: user.value,
            pwd: pwd.value
        }
    }).then(res => {
        console.log(res);
        sessionStorage.setItem('token', res.data.data.token)
        if (res.data.code == 0) {
            sessionStorage.setItem('role', res.data.data.roleName)
            let list;
            if (res.data.data.roleName == '员工') {
                list = [
                    {
                        href: '/goods',
                        com: 'goods/goods'
                    },
                    {
                        href: '/order',
                        com: 'order/order'
                    },
                    {
                        href: '/ordermain',
                        com: 'order/ordermain'
                    },
                    {
                        href: '/queue',
                        com: 'queue/queue'
                    },
                    {
                        href: '/review',
                        com: 'review/review'
                    }
                ]
            } else {
                list = [
                    {
                        href: '/goods',
                        com: 'goods/goods'
                    },
                    {
                        href: '/order',
                        com: 'order/order'
                    },
                    {
                        href: '/ordermain',
                        com: 'order/ordermain'
                    },
                    {
                        href: '/queue',
                        com: 'queue/queue'
                    },
                    {
                        href: '/review',
                        com: 'review/review'
                    },
                    {
                        href: '/system',
                        com: 'system/system'
                    },
                    {
                        href: '/role',
                        com: 'system/role'
                    },
                    {
                        href: '/vip',
                        com: 'vip/vip'
                    },
                    {
                        href: '/addLevel',
                        com: 'order/addLevel'
                    },
                ]
            }
            list.forEach(v => {
                router.addRoute('home', {
                    path: v.href,
                    component: () => import(`@/views/${v.com}`)
                })
            });

            sessionStorage.setItem('list', list)
            router.push('/')
        }
    })
}
onMounted(() => {
    sessionStorage.clear()
})
</script>

<style lang="less" scoped>
#loginBox {
    /* 100%窗口高度 */
    height: 100vh;
    /* 弹性布局 居中 */
    display: flex;
    justify-content: center;
    align-items: center;
    /* 渐变背景 */
    background: linear-gradient(200deg, #e3c5eb, #a9c1ed);
    /* 溢出隐藏 */
    overflow: hidden;
}

.container {
    /* 相对定位 */
    position: relative;
    z-index: 1;
    background-color: #fff;
    border-radius: 15px;
    /* 弹性布局 垂直排列 */
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 350px;
    height: 500px;
    /* 阴影 */
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.container .tit {
    font-size: 26px;
    margin: 65px auto 70px auto;
}

.container input {
    width: 280px;
    height: 30px;
    text-indent: 8px;
    border: none;
    border-bottom: 1px solid #ddd;
    outline: none;
    margin: 12px auto;
}

.container button {
    width: 280px;
    height: 40px;
    margin: 35px auto 40px auto;
    border: none;
    background: linear-gradient(-200deg, #fac0e7, #aac2ee);
    color: #fff;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
    cursor: pointer;
    /* 动画过渡 */
    transition: 0.5s;
}

.container button:hover {
    background: linear-gradient(-200deg, #aac2ee, #fac0e7);
    background-position-x: -280px;
}

.container span {
    font-size: 14px;
}

.container a {
    color: plum;
    text-decoration: none;
}

ul li {
    position: absolute;
    border: 1px solid #fff;
    background-color: #fff;
    width: 30px;
    height: 30px;
    list-style: none;
    opacity: 0;
}

.square li {
    top: 40vh;
    left: 60vw;
    /* 执行动画：动画名 时长 线性的 无限次播放 */
    animation: square 10s linear infinite;
}

.square li:nth-child(2) {
    top: 80vh;
    left: 10vw;
    /* 设置动画延迟时间 */
    animation-delay: 2s;
}

.square li:nth-child(3) {
    top: 80vh;
    left: 85vw;
    /* 设置动画延迟时间 */
    animation-delay: 4s;
}

.square li:nth-child(4) {
    top: 10vh;
    left: 70vw;
    /* 设置动画延迟时间 */
    animation-delay: 6s;
}

.square li:nth-child(5) {
    top: 10vh;
    left: 10vw;
    /* 设置动画延迟时间 */
    animation-delay: 8s;
}

.circle li {
    bottom: 0;
    left: 15vw;
    /* 执行动画 */
    animation: circle 10s linear infinite;
}

.circle li:nth-child(2) {
    left: 35vw;
    /* 设置动画延迟时间 */
    animation-delay: 2s;
}

.circle li:nth-child(3) {
    left: 55vw;
    /* 设置动画延迟时间 */
    animation-delay: 6s;
}

.circle li:nth-child(4) {
    left: 75vw;
    /* 设置动画延迟时间 */
    animation-delay: 4s;
}

.circle li:nth-child(5) {
    left: 90vw;
    /* 设置动画延迟时间 */
    animation-delay: 8s;
}

/* 定义动画 */
@keyframes square {
    0% {
        transform: scale(0) rotateY(0deg);
        opacity: 1;
    }

    100% {
        transform: scale(5) rotateY(1000deg);
        opacity: 0;
    }
}

@keyframes circle {
    0% {
        transform: scale(0) rotateY(0deg);
        opacity: 1;
        bottom: 0;
        border-radius: 0;
    }

    100% {
        transform: scale(5) rotateY(1000deg);
        opacity: 0;
        bottom: 90vh;
        border-radius: 50%;
    }
}
</style>