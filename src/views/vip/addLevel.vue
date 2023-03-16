<template>
    <div class="vip">
        <p class="title">会员等级管理</p>
        <div class="search">
            <div>
                <el-input v-model="levelName" class="w-50 m-2" placeholder="请输入等级名称" @keydown.enter="render"
                    :clearable="true" />
            </div>
            <el-button @mouseup="clickHandler" :icon="Search" @click="render">查询</el-button>
            <el-button @mouseup="clickHandler" :icon="CirclePlus" @click="render(), dialogVisible1 = true">新增等级
            </el-button>
        </div>
        <div class="vipTable">
            <el-table :data="currentData" :default-sort="{ prop: 'date', order: 'descending' }" style="width: 100%">
                <el-table-column prop="gradeName" label="等级名称" width="180" />
                <el-table-column prop="summarize" label="等级概述" width="180" />
                <el-table-column prop="preferential" label="权益" sortable />
                <el-table-column prop="creationTime" label="创建时间" width="110" sortable />
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
            <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :small="small"
                :disabled="total == 0 ? true : false" :background="background" layout="total, prev, pager, next"
                :total="total" @current-change="handleCurrentChange" />
        </div>

        <!-- 新增弹出框 -->
        <el-dialog v-model="dialogVisible1" title="新增会员等级" width="30%">
            <div class="dialog-box">
                <div>
                    <el-input v-model="newLevel" class="w-50 m-2" placeholder="请输入等级名称" :clearable="true" />
                </div>
                <div>
                    <el-input v-model="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                        placeholder="该等级的详细信息" />
                </div>
                <div>
                    <el-input v-model="discount" class="w-50 m-2" placeholder="例：95折" :clearable="true" />
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible1 = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogVisible1 = false, addLevel()">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog v-model="dialogVisible" title="Tips" width="30%">
            <div class="dialog-box">
                <div>
                    <el-input v-model="currentInfo.gradeName" class="w-50 m-2" placeholder="请输入等级名称"
                        :clearable="true" />
                </div>
                <div>
                    <el-input v-model="currentInfo.summarize" resize="none" :autosize="{ minRows: 2, maxRows: 4 }"
                        type="textarea" placeholder="该等级的详细信息" />
                </div>
                <div>
                    <el-input v-model="currentInfo.preferential" class="w-50 m-2" placeholder="例：95折"
                        :clearable="true" />
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogVisible = false, editLevel()">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElInput, ElButton, ElTable, ElTableColumn, ElDialog, ElPagination } from 'element-plus';
import { Search, CirclePlus } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from "../../utils/http";

let levelName = ref('');
let total = ref(0);
let levelData = ref([]);
let currentData = ref([
    {
        "id": 0,
        "gradeName": "",
        "summarize": "",
        "preferential": "",
        "creationTime": "",
        "discount": 0
    }
]);

//分页器
const currentPage = ref(1);
const pageSize = ref(5);
const small = ref(false);
const background = ref(false);

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    render();
}

//弹出框
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const currentInfo = ref({
    "id": 0,
    "gradeName": "",
    "summarize": "",
    "preferential": "",
    "creationTime": "",
    "discount": 0
});    //当前编辑用户的信息
const info = (val) => { //获取当前需要编辑的信息
    currentInfo.value = val;
    console.log(currentInfo.value);
}

//编辑对象
const editLevel = () => {
    axios({
        url: '/membershipLevel/update',
        method: 'post',
        data: {
            "creationTime": Date.now(),
            "discount": Number(currentInfo.value.preferential.slice(0, currentInfo.value.preferential.length - 1)) / getLength(currentInfo.value.preferential.slice(0, currentInfo.value.preferential.length - 1)),
            "gradeName": currentInfo.value.gradeName,
            "id": currentInfo.value.id,
            "preferential": currentInfo.value.preferential,
            "summarize": currentInfo.value.summarize
        }
    }).then((res) => {
        console.log(res);
        render();
    })
}

//新增等级
const newLevel = ref('');
const textarea = ref('');
const discount = ref('');

const getLength = (num) => {
    console.log(num.length);
    let number = '1';
    for (let i = 0; i < num.length; i++) {
        number = number + '0';
    }
    return Number(number);

}

const addLevel = () => {
    console.log(Number(discount.value.slice(0, discount.value.length - 1)) / getLength(discount.value.slice(0, discount.value.length - 1)));

    axios({
        url: '/membershipLevel/add',
        method: 'post',
        data: {
            "creationTime": Date.now(),
            "discount": Number(discount.value.slice(0, discount.value.length - 1)) / getLength(discount.value.slice(0, discount.value.length - 1)),
            "gradeName": newLevel.value,
            "preferential": discount.value,
            "summarize": textarea.value
        }
    }).then((res) => {
        console.log(res);
        render();
    })
}

//删除确认框
const open = (val) => {
    /* if(1){
    
    } */
    console.log(val,11111);
    
    ElMessageBox.confirm(
        '确认删除此会员等级？',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
            axios({
                url: '/membershipLevel/delete',
                method: 'delete',
                data: [val]
            }).then((res) => {
                console.log(res);
                render();
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
            })

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
        })
}

interface dataList {
    "id": number,
    "gradeName": string,
    "summarize": string,
    "preferential": string,
    "creationTime": string,
    "discount": number
}

let render = () => {
    currentData.value = [];
    if (levelName.value.trim() == '') {
        axios({
            url: '/membershipLevel/queryAll',
            method: 'get'
        }).then((res) => {
            console.log(res.data.data.list);

            let arr: Array<dataList> = [];
            levelData.value = res.data.data.list;
            total.value = res.data.data.list.length;
            console.log(total.value);

            if (total.value > 0) {   //防止for循环bug
                if (pageSize.value > total.value) {
                    pageSize.value = total.value;
                    for (let i = 0; i < total.value; i++) {  //每一页动态展示数据条数
                        arr.push(levelData.value[i])
                        arr[i].creationTime = formatTimestamp(arr[i].creationTime)
                    }
                } else {
                    pageSize.value = 5;   //初始每页显示数量
                    for (let i = 0; i < (total.value > pageSize.value * currentPage.value ? pageSize.value : total.value - (pageSize.value * (currentPage.value - 1))); i++) {  //每一页动态展示数据条数
                        arr.push(levelData.value[i + (currentPage.value - 1) * pageSize.value])
                        arr[i].creationTime = formatTimestamp(arr[i].creationTime)
                    }
                }
                currentData.value = arr;
            }
        })
    } else {
        axios({
            url: `/membershipLevel/queryByGradeName?gradeName=${levelName.value}`,
            method: 'get'
        }).then(({ data }) => {
            let arr: Array<dataList> = [];
            arr.push(data.data)
            arr[0].creationTime = formatTimestamp(arr[0].creationTime);
            currentData.value = arr;
        })
    }

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
        padding: 20px 60px;
        width: 520px;

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
                content: '等级名称:';
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


    .dialog-box {
        >div {
            width: 200px;
            position: relative;
            margin-left: 100px;
            margin-top: 20px;

            &::after {
                position: absolute;
                left: -70px;
                top: 4px;
                font-size: 14px;
            }

            &:nth-child(1)::after {
                content: '等级名称:';
            }

            &:nth-child(2)::after {
                content: '等级概述:';
            }

            &:nth-child(3)::after {
                content: '权益名';
            }
        }
    }
}
</style>