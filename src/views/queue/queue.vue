<template>
    <div class="container">
        <!-- 排队的显示，首先是获取人数 -->
        <div class="queue-container">
            <h1>排队订单：</h1>
        </div>
        <!-- 还在排队的订单 -->
        <div class="queue-list">
            <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column prop="queueNum" label="排队位置" sortable width="180" />
                <el-table-column prop="getNumberTime" label="下单时间" width="180" />
                <el-table-column prop="tableNum" label="桌号" width="180" />
                <el-table-column prop="tableName" label="桌子类型" width="180" />
                <el-table-column prop="status" label="就餐状态" width="180" />
                <el-table-column prop="phone" label="电话号码" width="180" />
            </el-table>
        </div>
        <!-- 推送文章的添加弹窗 -->
        <el-dialog v-model="centerDialogVisible" title="Warning" width="50%" align-center>
            <el-form :model="message" label-width="120px">
                <el-form-item label="推送内容" class="text">
                    <el-input v-model="message.content" :rows="5" type="textarea" placeholder="请输入推送的消息" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false, handleCancel()">取消</el-button>
                    <el-button type="primary" @click="centerDialogVisible = false, handlePush()">
                        推送
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <el-button @click="pushMessage">
            推送文章
        </el-button>
    </div>

</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import axios from "../../utils/http";
let { proxy } = getCurrentInstance()
const tableData = ref([])
let message = ref({
    content:''
})
let input = ref('')
let centerDialogVisible = ref(false)//推送文章弹窗是否显示
//推送按钮
let pushMessage = function () {
    centerDialogVisible.value = true
    // axios({
    //     url: '/msg/deleteMsg',
    //     method: 'delete',
    //     params: {
    //         id:9

    //     }
    // })
}
let handleCancel = function () {
   message.content = ''

}
let handlePush = function () { 
    if (message.value.content==null||message.value.content==''){
        alert('请输入要推送的消息');
        message.content = ''
    }else{
  axios({
        url: '/msg/addMsg',
        method: 'post',
        params: {
            content: message.value.content

        }
    })
    }
  
    message.value.content = ''

}

let getList = function () {
    axios({
        url: '/order/queue/queueDesc',
        method: 'get'
    }).then((res) => {
        proxy.tableData = res.data.data.list
        console.log(res.data.data.list)
        console.log(tableData.value)
    })
}
onMounted(() => {
    //在挂载完成的时候就发起请求获取数据
    getList()
})
</script>
<style lang="less" scoped>
* {
    padding: 0;
    margin: 0;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

h1 {
    margin: 20% 0;
    display: inline-block;
}

.queue-list {
    margin: 5%;
    min-height: 48%;
}

.el-dialog {
    .title {
        margin: 15px 0 35px;
    }
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>