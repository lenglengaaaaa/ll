<template>
    <Management
        type="gateway"
        btnName="新增网关"
        title='网关列表'
        placeholder="搜索网关"
        :columns="columns"
        :data="data"
    />
</template>

<script>
    import Management from '@/components/Management'

    export default {
        components: {
            Management,
        },
        data() {
            return {
                columns:[
                    { prop: "name" , label: "网关名称" },
                    { prop: "number" , label: "网关编号" },
                    { prop: "card" , label: "卡号" },
                    { prop: "mac" , label: "MAC地址" },
                    { prop: "time" , label: "最后接受时间" },
                ],
                data:[
                        {
                            name:'国金源富室内网关',
                            number:'0123456789',
                            card:'0123456789',
                            mac:'8cf957ffff8012f3',
                            time: '2016-05-02',
                            status:0 //0:断开,1:连接
                        },
                        {
                            name:'云南网关433',
                            number:'31900004',
                            card:'31900004',
                            mac:'b827ebfffe2accf5',
                            time: '2016-05-02',
                            status:1 //0:断开,1:连接
                        }
                ]
            }
        },
        mounted () {
        },
    }
</script>

<style lang="scss" scoped>

</style>