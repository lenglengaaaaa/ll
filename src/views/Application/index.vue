<template>
    <Management
        type="application"
        btnName="新增项目"
        title='我的项目'
        placeholder="搜索项目"
        :data="data"
        :columns="columns"
    />
</template>

<script>
    // import {All} from '@/components/Management'
    import {Management} from '../../components/Management'



    export default {
        components: {
            Management,
        },
        data() {
            return {
                columns:[
                    // { prop: "id" , label: "应用ID" },
                    // { prop: "name" , label: "应用名称" },
                    // { prop: "description" , label: "应用描述" }
                ],
                data:[
                    {
                        id:'22',
                        name:'清华信息港魔戒演示平台',
                        description:'清华信息港魔戒演示平台',
                        type:'1'
                    },
                    {
                        id:'12',
                        name:'低压配电应用',
                        description:'低压配电应用',
                        type:'0'
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