<template>
    <div class="vip">
        <p class="title">角色管理</p>
        <div class="search">
            <div>
                <el-input v-model="roleName" class="w-50 m-2" placeholder="请输入名称" />
            </div>
            <el-button class="Btn" @mouseup="clickHandler" :icon="Plus" @click="dialogVisible = true">增加</el-button>
            <el-button class="Btn" @mouseup="clickHandler" :icon="Search" @click="search">查询</el-button>
            <el-button class="Btn" @mouseup="clickHandler" :icon="Search" @click="render">重置</el-button>
        </div>
        <div class="vipTable">
            <el-table :data="Employees" style="width: 100%">
                <el-table-column prop="roleNumber" label="编号" width="180" />
                <el-table-column prop="roleName" label="名称" width="180" />
                <el-table-column label="职责描述">
                    <template #default="scope">
                        <span>{{ scope.row.des === '' ? '暂无描述' : scope.row.des }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editDialogVisible = true, info(scope.row)">
                            编辑
                        </el-button>
                        <el-button link type="primary" size="small" @click="open(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="page" :disabled="total == 0 ? true : false"
                v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]" :small="false" :background="false"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <!-- 增加弹出框 -->
        <el-dialog v-model="dialogVisible" title="新增员工" width="30%">
            <div class="dialog">
                <el-input v-model="addData.id" placeholder="输入编号">
                    <template #prepend>&nbsp;ID&nbsp; </template>
                </el-input>
                <el-input v-model="addData.roleNumber" placeholder="输入编号">
                    <template #prepend>编号</template>
                </el-input>
                <el-input v-model="addData.roleName" placeholder="输入名称">
                    <template #prepend>名称</template>
                </el-input>
                <el-input v-model="addData.des" placeholder="输入职责描述">
                    <template #prepend>职责</template>
                </el-input>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addSure">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog v-model="editDialogVisible" title="编辑员工" width="30%">
            <div class="dialog">
                <el-input v-model="editData.roleNumber" placeholder="输入账号">
                    <template #prepend>编号</template>
                </el-input>
                <el-input v-model="editData.roleName" placeholder="输入密码">
                    <template #prepend>名称</template>
                </el-input>
                <el-input v-model="editData.des" placeholder="输入手机">
                    <template #prepend>描述</template>
                </el-input>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="editSure">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElInput, ElSelect, ElOption, ElButton, ElTable, ElTableColumn, ElDialog, ElPagination } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEmployees, editEmployees, addEmployees, delEmployees, searchEmployees } from "../../apis/system/role";

//员工列表
let Employees = ref([])
//当前页数
let page = ref(1)
//一页显示个数
let pageSize = ref(5)
//数据总数
let total = ref(10)
//查询条件
//员工角色
let roleName = ref('')


//查询
const search = () => {
    let search = {
        page: page.value,
        pageSize: pageSize.value,
        roleName: roleName.value
    }
    console.log(search);

    searchEmployees(search).then(res => {
        console.log(res.data.data);
        Employees.value = res.data.data.records

    })
}
//增加
let addData = ref({
    id: null,
    des: '',
    roleName: '',
    roleNumber: ''
})
//增加员工
const addSure = () => {
    addEmployees(addData.value).then(res => {
        console.log(res);
        if (res.data.code == 0) {
            ElMessage.success('添加信息成功!')
            dialogVisible.value = false
        } else {
            ElMessage.error('添加信息失败')
        }
    })
}
//增加弹出框
const dialogVisible = ref(false)
//编辑
interface data {
    id: number,
    userName: string,
    pwd: string,
    phone: string,
    roleName: string,
}
let _editData = ref({
})
let editData = ref([])
const info = (val) => { //获取当前需要编辑的信息
    _editData.value = val
    editData.value = JSON.parse(JSON.stringify(_editData.value))
    console.log(editData.value, 111);
}
//编辑弹出框
const editDialogVisible = ref(false)
const editSure = () => {
    console.log(editData.value);

    editEmployees(editData.value).then(res => {
        if (res.data.code == 0) {
            editDialogVisible.value = false
            ElMessage.success('修改成功!')
            render()
        } else {
            ElMessage.error('修改失败')
        }
    })

}
//渲染界面
const render = () => {
    let data = {
        page: page.value,
        pageSize: pageSize.value
    }
    getEmployees(data).then(res => {
        Employees.value = res.data.data.records
        total.value = res.data.data.total
        console.log(Employees.value, 123);

    })
}

//分页
//数量改变
const handleSizeChange = (res) => {
    pageSize.value = res
    render()
}
//当前页数改变
const handleCurrentChange = (res) => {
    page.value = res
    render()

}

//删除
//消息确认框
const open = (val) => {

    ElMessageBox.confirm(
        '此操作会删除本店的员工信息，请谨慎删除. 是否继续?',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {

            delEmployees(val).then(res => {
                if (res.data.code == 0) {
                    ElMessage({
                        type: 'success',
                        message: '删除成功',
                    })
                    render()
                } else {
                    ElMessage.error('删除失败')
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消',
            })
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
    render()
})


</script>

<style scoped lang="less">
.dialog {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .el-input {
        text-align: center;
        width: 100%;
        margin: 10px auto;
        display: block;
    }
}

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

    // .Btn {
    //     margin: 10px 0px 30px 20px;
    // }

    .search {
        margin-left: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px 40px;
        width: 500px;

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
                content: '角色名称:';
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