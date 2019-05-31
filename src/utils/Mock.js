import Mock from 'mockjs'

export const data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    "code":200,
    "data|1-10":[
        {
            "id|+1":1
        }
    ],
    "msg":'请求成功!'
})

