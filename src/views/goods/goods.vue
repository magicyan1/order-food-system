<template>
    <el-mian>
        <div class="searchBox">
            <p class="top">商品分类</p>
            <div class="bottom">
                <div class="inp"><span>商品名字：</span>
                    <el-input v-model="inquire.goodsName" placeholder="商品名字" />
                </div>
                <el-button type="primary" plain @click="Search">搜索</el-button>
                <el-button type="primary" plain @click="Reset">重置</el-button>
                <el-button type="primary" plain @click="addBox">增加</el-button>
            </div>
        </div>
        <div class="listBox">
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column fixed prop="goodsId" label="id" width="150" />
                <el-table-column prop="goodsName" label="商品名字" width="120" />
                <el-table-column prop="goodsTypes" label="商品类别" width="120" />
                <el-table-column prop="goodsDetails" label="详细信息" width="200" />
                <el-table-column prop="goodsPrice" label="商品价格" width="120" />
                <el-table-column prop="image" label="商品图片" width="120">
                <template #default="scope"><img :src="scope.row.image" class="tableImg"></template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="scoped">
                        <el-button link type="primary" size="small" @click="editBox(scoped.row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="Del(scoped.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="current" v-model:page-size="limit" :page-sizes="[5, 10, 15, 20]"
                    :small="small" :disabled="disabled" :background="background"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>
        <!-- 遮罩层 -->
        <div class="mask" v-if="isShow1"></div>
        <!-- 增加和编辑弹出框 -->
        <div class="addBox" v-if="isShow1">
            <el-header style="height: 50px;">
                <span>新增设备</span>
                <i @click="addDisappear" class="cancel">x</i>
            </el-header>
            <el-main>
                <p class="add-tip">基础信息</p>
                <div class="inp-box">
                    <div class="inp">
                        <p>
                            <span class="symbol">*</span>
                            <span>商品名字：</span>
                        </p>
                        <el-input v-model="add.goodsName" placeholder="请输入内容" :disabled="disabled" />
                    </div>
                    <div class="inp">
                        <p>
                            <span class="symbol">*</span>
                            <span>商品类别：</span>
                        </p>
                        <el-select v-model="add.goodsTypes" placeholder="请选择">
                            <el-option v-for="item in goodsTypes" 
                            :key="item.value" 
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="inp-box">
                    <div class="inp">
                        <p>
                            <span class="symbol">*</span>
                            <span>详细信息：</span>
                        </p>
                        <el-input v-model="add.goodsDetails" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="inp">
                        <p>
                            <span class="symbol">*</span>
                            <span>商品价格：</span>
                        </p>
                        <el-input v-model="add.goodsPrice" placeholder="请输入内容"></el-input>
                    </div>
                </div>
                <div class="inp-box">
                    <div class="inp">
                        <p>
                            <span class="symbol">*</span>
                            <span>商品图片：</span>
                        </p>
                        <el-upload
    class="avatar-uploader"
    action="http://120.55.97.163:8080/sys/oss/upload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
                    </div>
                </div>
                <div class="add-btn">
                    <div class="btn" @click="addDisappear">
                        <span>取消</span>
                    </div>
                    <div class="btn" @click="addSave">
                        <span>保存</span>
                    </div>
                </div>
            </el-main>
        </div>
  </el-mian>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import axios from "../../utils/http";
// import type { UploadProps, UploadUserFile } from 'element-plus'

import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

import type { UploadProps } from "element-plus";
// 上传图片
const imageUrl = ref("");

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  // console.log(response,123);

  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

interface data {
  goodsDetails: string;
  goodsId: number;
  goodsName: string;
  goodsPrice: number;
  goodsTypes: number;
  image: string | undefined;
}
let add = ref<data>({
  goodsDetails: "",
  goodsId: 0,
  goodsName: "",
  goodsPrice: 0,
  goodsTypes: 2,
  image: "",
});
const input = ref("");
// 表格部分
const tableData = ref([]);
// 分页部分
const current = ref(1);
const limit = ref(5);
const total = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  limit.value = val;
  render();
  console.log(`当前页数：${val}`);
};
const handleCurrentChange = (val: number) => {
  current.value = val;
  render();
  console.log(`第 ${val} 页`);
};

// 渲染数据
let render = () => {
    axios({
        url: `/GoodsShop/Goods`,
        method: 'get',
        params:{
            page:current.value,
            limit:limit.value
        },
    }).then((res) => {
        console.log(res.data.code);
        if (res.data.code == 0) {
            tableData.value = res.data.data.list;
            total.value=res.data.data.totalCount
            // tableData.value = table.slice((current.value - 1) * limit.value, limit.value * current.value);
            // total.value=tableData.value.length;
            // total.value = table.length;
        }
    });
}
render();
// 增加页面
const isShow1 = ref(false);
const addNum = ref();

// 增加框出现
let addBox = () => {
  isShow1.value = true;
  addNum.value = 1;
};
// 编辑框出现
let editBox = (v) => {
  console.log(v);
  isShow1.value = true;
  addNum.value = 2;
  imageUrl.value = v.image;
  add.value = {
    goodsDetails: v.goodsDetails,
    goodsId: v.goodsId,
    goodsName: v.goodsName,
    goodsPrice: v.goodsPrice,
    goodsTypes: v.goodsTypes,
    image: v.image,
  };
  console.log(add.value);
};
// 增加框消失
const goodsTypes = [
  { value: 1, label: "炸鸡" },
  { value: 2, label: "炸鸡" },
  { value: 3, label: "炸鸡" },
];
const addDisappear = () => {
  isShow1.value = false;
  clean();
};
// 增加和编辑确认
let addSave = () => {
  // console.log(fileList.value[0].url);
  add.value.image = imageUrl.value;
  if (addNum.value == 1) {
    axios({
      url: "/GoodsShop/add/Goods",
      method: "post",
      data: add.value,
    }).then((res) => {
      // 查看搜索框内容
      console.log(res.data.code);
      if (res.data.code == 0) {
        console.log(200);
        clean();
        addDisappear();
        render();
      }
    });
  } else if (addNum.value == 2) {
    axios({
      url: "/GoodsShop/update/Goods",
      method: "PUT",
      data: add.value,
    }).then((res) => {
      console.log(res.data.code);
      if (res.data.code == 0) {
        clean();
        addDisappear();
        render();
      }
    });
  }
};
// 清除数据
let clean = () => {
  add.value = {
    goodsDetails: "",
    goodsId: 0,
    goodsName: "",
    goodsPrice: 0,
    goodsTypes: 0,
    image: "",
  };
};
// 搜索框
const inquire = ref({
  goodsName: "",
});
let Search = () => {
  axios({
    url: `/Goods/Goods/GoodsName`,
    method: "get",
    params: inquire.value,
  }).then((res) => {
    console.log(res.data);
    if (res.data.code == 0) {
      tableData.value = res.data.data;
      // total.value=res.data.data.totalCount
    }
  });
};
// 重置部分
let Reset = () => {
  inquire.value = {
    goodsName: "",
  };
  current.value = 1;
  render();
};
// 删除部分
let Del = (v) => {
  console.log(v.goodsId);
  console.log(typeof v.goodsId);
  axios({
    url: "/GoodsShop/delete/Goods",
    method: "DELETE",
    data: v.goodsId,
  }).then((res) => {
    console.log(res.data.code);
    if (res.data.code == 0) {
      render();
    }
  });
};
</script>

<style scoped lang="less">
.el-mian {
  // background-color: #f3f3f3;
  // padding-left: 30px;
  position: relative;
}

// 搜索框内容
.searchBox {
  width: 1200px;
  height: 160px;
  background-color: #ffffff;
  padding: 0 20px;
}

.top {
  width: 1150px;
  height: 50px;
  border-bottom: 1px solid #f3f3f3;
  line-height: 50px;
  font-weight: 700;
}

.bottom {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;

  .inp {
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-right: 50px;

    span {
      white-space: nowrap;
    }
  }
}

// 表格部分
.listBox {
  width: 1200px;
  height: calc(100% - 160px);
  background-color: #ffffff;
  margin-top: 20px;
  padding: 0 20px;
}
.tableImg {
  width: 40px;
  height: 40px;
}
// 分页
.pagination {
  width: 1200px;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

// 遮罩层
.mask {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  filter: opacity(60%);
  opacity: 60%;
  z-index: 3;
}

// 弹出框
.addBox {
  width: 600px;
  height: 450px;
  background: #fff;
  position: absolute;
  top: 100px;
  left: 500px;
  z-index: 4;

  .el-header {
    height: 30px;
    line-height: 30px;
    background: #f2f2f2;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-main {
    background: #fff;
    height: 420px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    line-height: 50px;
    padding: 0px 20px;
    position: relative;

    .add-tip {
      font-weight: 700;
    }

    .inp-box {
      width: 100%;
      height: 70px;
      display: flex;
      font-size: 14px;
      display: flex;
      justify-content: space-between;

      .inp {
        width: 250px;
        height: 70px;
        line-height: 35px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .symbol {
          color: red;
        }
      }

      .el-select {
        width: 250px;
      }
    }
  }
  .avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}

.cancel {
  cursor: pointer;
}

.add-btn {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  bottom: 0px;
  right: 0px;

  .btn {
    width: 80px;
    height: 35px;
    border: 1px solid #f2f2f2;
    border-radius: 3px;
    line-height: 35px;
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    margin-right: 20px;

    &:hover {
      cursor: pointer;
      color: #fff;
      background: #1890ff;

      .iconfont {
        color: #fff;
      }
    }

    .iconfont {
      color: #1890ff;
    }
  }
}
</style>

<!-- 


    {
	"diningMethod": "堂食",
	"orderDisheDto2s": [
		{flavor: "", goodsId: 17, number: "2", totalPrice: "22"},
 {flavor: "", goodsId: 1, number: "1", totalPrice: "23"},
 {flavor: "", goodsId: 2, number: "2", totalPrice: "24"}
	],
	"orderTime": "1668651391345",
	"userId": 1
}
 -->
