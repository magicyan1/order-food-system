import axios from "../../utils/http";

// 获取员工信息
const getEmployees = (data) => {
  return axios({
    url: "/order/user/page",
    params: data,
  });
};

//编辑
const editEmployees = (data) => {
  return axios({
    url: "/order/user",
    method: "put",
    data: data,
  });
};
//增加
const addEmployees = (data) => {
  return axios({
    url: "/order/user/add",
    method: "post",
    data: data,
  });
};
// 删除
const delEmployees = (id) => {
  return axios({
    url: `/order/user/delete/${id}`,
    method: "delete",
  });
};
//查询
const searchEmployees = (search) => {
  return axios({
    url: "/order/user/getneed",
    params: search,
  });
};

export {
  getEmployees,
  editEmployees,
  addEmployees,
  delEmployees,
  searchEmployees,
};
