import axios from "../../utils/http";

// 获取员工信息
const getEmployees = (data) => {
  return axios({
    url: "/role/queryAll",
    params: data,
  });
};

//编辑
const editEmployees = (data) => {
  return axios({
    url: "/role",
    method: "put",
    data: data,
  });
};
//增加
const addEmployees = (data) => {
  return axios({
    url: "/role/save",
    method: "post",
    data: data,
  });
};
// 删除
const delEmployees = (id) => {
  return axios({
    url: `/role/delete/${id}`,
    method: "delete",
  });
};
//查询
const searchEmployees = (search) => {
  return axios({
    url: "/role/queryRole",
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
