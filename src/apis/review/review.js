import axios from "../../utils/http.js";
// 添加商家回复
export const addReview = async (shipComment)=>{
	return axios({
		url:'/comment/addShipComment',
		method:'post',
		data:{
			shipComment:{
				"comment": "",
				"date": "",
				"id": '',
				"imge": "",
				"name": "",
				"orderNumber": "",
				"userCommentId": ''
			}
		}
	})
}
// 商家条件查询评论
export const lookSelectView = (conditionDto) => {
	return axios({
		url:'/comment/queryShipComment',
		method:'post',
		data:{
			conditionDto:{
				"comment": "",
				"endDate": "",
				"name": "",
				"orderNumber": "",
				"star": '',
				"startDate": ""
			}
		}
	})
}
// 查询详情
export const lookReview = (params) => {
	return axios({
		url:'/comment/queryCommentDetail',
		method:'get',
		params
	})
}
// 商家查询所有评论（初始化渲染）
export const lookAllReview = async (page,limit) => {
	return axios({
		url:`/comment/queryShipComment/${page}/${limit}`,
		method:'get'
	})
}
