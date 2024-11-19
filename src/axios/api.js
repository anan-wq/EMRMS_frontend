import Request from './request'
import qs from 'qs'
import axios from "axios";

const POST = 'post';
const GET = 'get';
const PUT = 'put';
const DELETE = 'delete';
const FILE = 'file';

//Base请求
function R(url, method, data) {
    if(method===POST){
        return Request.service({
            url:url,
            method: method,
            data
        });
    }
    if (method === DELETE) {
        return Request.service({
            url: url+`/${data}` ,//+ "/" + data.id, // 假设 data 中包含要删除的资源的 ID
            method: method,
            // data // 空的请求体
        });
    }
    // if (method === POST || method === DELETE) {
    //     // 将资源 ID 添加到 URL Medium
    //     const requestUrl = method === DELETE ? `${url}/${data.id}` : url;
    //     return Request.service({
    //         url: requestUrl,
    //         method: method,
    //         data: method === POST ? data : undefined // 只有 POST 请求需要传递请求体
    //     });
    // }
    if(method===GET || method===PUT){
        return Request.service({
            url:url + "?"+ qs.stringify(data),
            method: method
        });
    }
    if (method === FILE) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return Request.rawService({
            url:url,
            method: 'post',
            data : formData
        });
    }
}

//登录
export const toLogin = (data) => { return R("/verify/login", POST, data)};

//突发事件
export const eventApi = {
    newEvent: (data) => {
        return R('/event', POST, data);
    },
    listEvent: (data) => {
        return R('/event/list', GET, data);
    },
    deleteEvent : (data)=>{
        return R('/event', DELETE,data);
    }
};

export const materialApi = {
    newMaterialCategory:(data)=>{
        return R("/material/category", POST, data);
    },
    listMaterialCategory: (data)=>{
        return R("/material/category/list", GET, data);
    },
    deleteMaterialCategory: (data)=>{
        return R("/material/category", DELETE, data);
    },
    newMaterial: (data)=>{
        return R("/material", POST, data);
    },
    listMaterial: (data)=>{
        return R("/material/list", GET, data);
    },
    deleteMaterial: (data)=>{
        return R("/material", DELETE, data);
    }
};


export const approvalApi = {
    newApproval: (data)=>{
        return R("/approval", POST, data);
    },
    deleteApproval: (data)=>{
        return R("/approval", DELETE, data);
    },
    updateApproval : (data)=>{
        return R("/approval", PUT, data);
    },
    listApproval: (data)=>{
        return R("/approval/list", GET, data);
    }
};

export const transportApi = {
    newTransport: (data)=>{
        return R("/transport", POST, data);
    },
    listTransport: (data)=>{
        return R("/transport/list", GET, data);
    },
    updateTransport: (data)=>{
        return R("/transport", PUT, data);
    }
};

export const ossApi = {
    upload : (data)=>{
        return R("/qiniu/upload", FILE, data);
    }
};

export const userApi = {
   listUser: (data)=>{
       return R("/user/list", GET, data);
   }
};

export const chatApi = {
    getChatList: (data)=>{
        return R("/chat/getChatList", GET, data);
    },
    sendChat: (data)=>{
        return R("/chat/sendChat", POST, data);
    }
 };

