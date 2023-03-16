<template>
    <div class="vip">
        <p class="title">会员信息管理</p>
        <div class="search">
            <div>
                <el-select v-model="level" class="m-2" placeholder="全部" clearable @change="render">
                    <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <div>
                <el-input v-model="nameOrNickname" class="w-50 m-2" placeholder="请输入姓名" @keydown.enter="render" />
            </div>
            <div>
                <el-input v-model="lastPhoneNum" class="w-50 m-2" type="number" placeholder="请输入号码后四位"
                    @keydown.enter="render" />
            </div>
            <el-button @mouseup="clickHandler" :icon="Search" @click="render">查询</el-button>
        </div>
        <div class="vipTable">
            <el-table :data="currentData" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
                <el-table-column prop="nickname" label="会员昵称" width="180" />
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="phoneNumber" label="手机号" />
                <el-table-column prop="numberTransactions" label="成交次数" sortable />
                <el-table-column prop="integral" label="积分" sortable />
                <el-table-column prop="registrationTime" label="注册时间" width="110" sortable />
                <el-table-column prop="membershipLevel" label="会员等级" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="dialogVisible = true, info(scope.row)">编辑
                        </el-button>
                        <el-button link type="primary" size="small" @click="open(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="currentPage" :disabled="total == 0 ? true : false"
                v-model:page-size="pageSize" :page-sizes="pageSizeNum" :small="small" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <!-- 弹出框 -->
        <el-dialog v-model="dialogVisible" title="Tips" width="30%">
            <span>This is a message</span>
            <div>
                <el-input v-model="currentInfo.address" class="w-50 m-2" />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElInput, ElSelect, ElOption, ElButton, ElTable, ElTableColumn, ElDialog, ElPagination } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from "../../utils/http";

let nameOrNickname = ref('');
let lastPhoneNum = ref('');
let total = ref(0);
let vipData = ref([]);
/* [
    {
        nickName: 'jack',
        name: 'Tom',
        phone: '13942352543',
        dealTimes: 1,
        score: 1320,
        date: '2016-05-03',
        level: '钻石会员'
    },
    {
        nickName: 'jack',
        name: 'Tom',
        phone: '13942352543',
        dealTimes: 20,
        score: 1320,
        date: '2016-05-03',
        level: '白银会员'
    },
    {
        nickName: 'jack',
        name: 'Tom',
        phone: '13942352543',
        dealTimes: 233,
        score: 1320,
        date: '2016-05-03',
        level: '白银会员'
    },
    {
        nickName: 'jack',
        name: 'Tom',
        phone: '13942352543',
        dealTimes: 23,
        score: 1320,
        date: '2016-05-03',
        level: '黄金会员'
    },
    {
        nickName: 'jack',
        name: 'Tom',
        phone: '13942352543',
        dealTimes: 4,
        score: 1320,
        date: '2016-05-03',
        level: '钻石会员'
    }
] */
let currentData = ref([
    {
        address: '',
        id: 0,
        integral: 0,
        membershioLevel: '',
        name: '',
        nickname: '',
        numberTransactions: 0,
        phoneNumber: '',
        registrationTime: ''
    }
]);

const level = ref('');


const levels = ref([
    {
        value: '',
        label: ''
    }
])

//分页器
const currentPage = ref(1);
const pageSize = ref(5);
const pageSizeNum = ref([5, 10, 20, 50]);
const small = ref(false);
const background = ref(false);

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    render();
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    render();
}

//弹出框
const dialogVisible = ref(false)
const currentInfo = ref({
    address: '',
    id: 0,
    integral: 0,
    membershioLevel: '',
    name: '',
    nickname: '',
    numberTransactions: 0,
    phoneNumber: '',
    registrationTime: ''
});    //当前编辑用户的信息
const info = (val) => { //获取当前需要编辑的信息
    currentInfo.value = val;
    console.log(currentInfo);

}

//消息确认框
const open = (val) => {

    ElMessageBox.confirm(
        '此操作会删除用户在本店的个人信息，请谨慎删除. 是否继续?',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            axios({
                url: '/membershipDetails/delete',
                method: 'delete',
                data: [val]
            }).then((res) => {
                console.log(res);
                render();
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}

interface elOption {
    "value": string,
    "label": string
}
let getLevel = () => {
    axios({
        url: '/membershipLevel/queryAll',
        method: 'get'
    }).then((res) => {
        let list = res.data.data.list;
        let arr: Array<elOption> = [];
        for (const key in list) {
            arr.push({
                "value": list[key].gradeName,
                "label": list[key].gradeName
            })
        }
        levels.value = arr;
    })
}

interface dataList {
    address: string,
    id: number,
    integral: number,
    membershioLevel: string,
    name: string,
    nickname: string,
    numberTransactions: number,
    phoneNumber: string,
    registrationTime: string
}

let render = () => {
    currentData.value = [];
    axios({
        url: `/membershipDetails/queryByConditions?membershipLevel=${level.value}&&name=${nameOrNickname.value}&&phoneNumber=${lastPhoneNum.value}`,
        method: 'get'
    }).then((res) => {
        let arr: Array<dataList> = [];
        vipData.value = res.data.data;
        total.value = res.data.data.length;
        pageSizeNum.value = [5, 10, 20, 50];   //初始化分页器
        if (total.value > 0) {   //防止for循环bug
            if (pageSize.value > total.value) {
                pageSize.value = total.value;
                pageSizeNum.value.push(total.value);
                pageSizeNum.value.sort(function (a, b) {
                    return a - b;
                })
                for (let i = 0; i < total.value; i++) {  //每一页动态展示数据条数
                    arr.push(vipData.value[i])
                    arr[i].registrationTime = formatTimestamp(arr[i].registrationTime)
                }
            } else {
                pageSize.value = 5;   //初始每页显示数量
                for (let i = 0; i < (total.value > pageSize.value * currentPage.value ? pageSize.value : total.value - (pageSize.value * (currentPage.value - 1))); i++) {  //每一页动态展示数据条数
                    arr.push(vipData.value[i + (currentPage.value - 1) * pageSize.value])
                    arr[i].registrationTime = formatTimestamp(arr[i].registrationTime)
                }
            }
            currentData.value = arr;
            console.log(currentData.value[0].registrationTime);
        }
    })
}


const clickHandler = (e) => { //强制失去焦点
    let target = e.target;
    switch (target.nodeName) {
        case "BUTTON":
            target = e.target;
            target.blur();
            break;
        case "SPAN":
            target = e.target.parentNode;
            target.blur();
            break;
        case "svg":
            target = e.target.parentNode.parentNode;
            target.blur();
            break;
        case "path":
            target = e.target.parentNode.parentNode.parentNode;
            target.blur();
            break;
    }
}

// 对时间格式优化
const timestampPadStart = str => {
    // 必须转为字符串数字padStart方法
    str = String(str)
    return str.padStart(2, '0')
}

// 处理时间
const formatTimestamp = ts => {
    const date = new Date(Number(ts))

    const YYYY = timestampPadStart(date.getFullYear())
    const MM = timestampPadStart(date.getMonth() + 1)
    const DD = timestampPadStart(date.getDate())

    const hh = timestampPadStart(date.getHours())
    const mm = timestampPadStart(date.getMinutes())
    const ss = timestampPadStart(date.getSeconds())

    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}



onMounted(() => {
    render();
    getLevel();
})


</script>

<style scoped lang="less">
* {
    margin: 0;
}

.vip {
    background-color: #fff;
    margin: 20px;
    width: calc(100% - 20px * 2);

    .title {
        font-size: 26px;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .search {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px 40px;
        width: 900px;

        >div {
            width: 140px;
            position: relative;

            &::after {
                position: absolute;
                left: -70px;
                top: 4px;
                font-size: 14px;
            }

            &:nth-child(1)::after {
                content: '会员等级:';
            }

            &:nth-child(2)::after {
                content: '会员姓名:';
            }

            &:nth-child(3)::after {
                content: '手机尾号:';
            }

            /deep/ input[type=number]::-webkit-inner-spin-button,
            /deep/ input[type=number]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            /deep/ input[type=number] {
                -moz-appearance: textfield;
            }
        }


    }

    .vipTable {
        margin: 0px 20px;

        /deep/ .cell {
            text-align: center;
        }
    }

    .demo-pagination-block {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        padding-bottom: 10px;

        .demo-pagination-block+.demo-pagination-block {
            margin-top: 10px;
        }

        .demo-pagination-block .demonstration {
            margin-bottom: 16px;
        }
    }


}
</style>