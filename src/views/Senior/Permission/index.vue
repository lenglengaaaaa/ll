<template>
    <div class="Permission-container">
        <div class="tree">
            <el-tree 
                :data="data" 
                :props="defaultProps"
                @node-click="handleNodeClick"
            >
            </el-tree>
        </div>
        <div class="transfer">
            <el-transfer 
                v-model="value" 
                :data="data1"
            >
            </el-transfer>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            const generateData = _ => {
                const data = [];
                for (let i = 1; i <= 15; i++) {
                    data.push({
                        key: i,
                        label: `备选项 ${ i }`  
                    });
                }
                return data;
            };
            return {
                data1: generateData(),
                value: [],
                data: [
                    {
                        label: '一级 1',
                        children: [{
                            label: '二级 1-1',
                            children: [{
                            label: '三级 1-1-1'
                            }]
                        }]
                    }, 
                    {
                        label: '一级 2',
                        children: [
                            {
                                label: '二级 2-1',
                                children: [{
                                    label: '三级 2-1-1'
                                }]
                            }, 
                            {
                                label: '二级 2-2',
                                children: [{
                                    label: '三级 2-2-1'
                                }]
                            }
                        ]
                    }, 
                    {
                        label: '一级 3',
                        children: [{
                            label: '二级 3-1',
                            children: [{
                                label: '三级 3-1-1'
                            }]
                        }, {
                            label: '二级 3-2',
                            children: [{
                                label: '三级 3-2-1'
                            }]
                        }]
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            };
        },
        methods: {
            handleNodeClick(data) {
                console.log(data);
            }
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 870px) {
        .Permission-container{
            flex-direction: column;
            .tree{
                margin-bottom: 20px;
            }
        }
    }

    .Permission-container{
        background: #fff;
        height: calc(100% - 42px);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        padding: 20px ;
        display: flex;
        overflow-y: scroll;
        .tree,.transfer{
            max-width: 100%;
            border: 1px solid #ebeef5;
            padding: 10px;
        }
        .tree{
            width: 25%;
            margin-right: 2%;
        }
        .transfer{
            width: 73%;
        }
    }
</style>