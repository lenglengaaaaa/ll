
<template >
    <div class="dagre-graph-container">
        <el-select v-model="value" placeholder="请选择" @change="selectCourts">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
        </el-select>
        <Dagre-Graph 
            :nodes="nodes"
            :edges="edges"
        />
    </div>
</template>
<script>
    import DagreGraph from './DagreGraph'
    import { mapActions } from 'vuex';

    export default {
        name: 'FlowDiagram',
        data() {
            return {
                nodes: [],
                edges: [],
                options: [],
                value: '',
                params:{
                    size:30,    
                    current:1 
                },
            }
        },
        components: {
            DagreGraph
        },
        mounted () {
            //初始化实例
            this.getCourtsTree(1);
            // this.init();
        },
        methods: {
            // init () {
            //     this.nodes = [
            //         {
            //             id: 'e1',
            //             state: '',
            //             value: {
            //                 label: '开始',
            //                 operator: 'BashOperator'
            //             }
            //         },
            //         {
            //             id: 'e2',
            //             state: 'success',
            //             value: {
            //                 label: '分支一',
            //                 operator: 'BranchPythonMapOperator'
            //             }
            //         },
            //         {
            //             id: 'e3',
            //             state: 'success',
            //             value: {
            //                 label: '分支二',
            //                 operator: 'BranchPythonMapOperator'
            //             }
            //         },
            //         {
            //             id: 'e4',
            //             state: 'queued',
            //             value: {
            //                 label: '节点3',
            //                 operator: 'BashOperator'
            //             }
            //         },
            //         {
            //             id: 'e5',
            //             state: 'failed',
            //             value: {
            //                 label: '节点4',
            //                 operator: 'BashOperator'
            //             }
            //         },
            //     ]
            //     this.edges = [
            //         {
            //             from: 'e1', 
            //             to: 'e2'
            //         },
            //         {
            //             from: 'e1', 
            //             to: 'e3'
            //         },
            //         {
            //             from: 'e2', 
            //             to: 'e4',
            //             label: '条件1'
            //         },
            //         {
            //             from: 'e3', 
            //             to: 'e5',
            //             label: '条件2'
            //         },
            //     ]
            // },
            ...mapActions('asset',[
                'getCourtsList', 
                "getRoomList",
                'getChestList'
            ]),

            // 根据台区信息获取台区下所有关系
            async ConnectionsForCourts(courtsId){
                let nodes = [];
                let edges = [];

                //1. 获取台区/第一层信息
                const firstFloor = this.options.filter(res=>courtsId == res.id);

                //2. 获取配电房列表
                const roomList = await this.getRoomListForCourtsId(courtsId);
                nodes = [...firstFloor,...roomList];
                edges = roomList.map(cur=>{
                    return {
                        from: courtsId, 
                        to: cur.id
                    }
                })

                //3. 获取所有配电房下配电柜列表,添加到children下.
                const chestList = await roomList.forEach(cur =>{
                    this.getChestListForCourtsId(cur.id).then(res=>{
                        nodes = [...nodes,...res];
                        res.map(cur=>{
                            edges = [
                                ...edges,
                                {
                                    from:cur.roomId,
                                    to:cur.id
                                }
                            ]
                        })
                        
                    });
                })
                
                setTimeout(()=>{
                    this.nodes = nodes;
                    this.edges = edges; 
                },600)

            },
            //根据台区ID获取该台区下配电房列表
            getRoomListForCourtsId(courtsId){
                return this.getRoomList({ ...this.params, courtsId }).then(res=>{
                    if( !res && res.data && res.data.length ) return [];
                    return res.data;
                })
            },
            //根据配电房ID获取该配电房下配电柜列表
            getChestListForCourtsId(roomId){
                return this.getChestList({ ...this.params, roomId }).then(res=>{
                    if( !res && res.data && res.data.length ) return [];
                    return res.data;
                })
            },
            //获取台区完整树结构
            async getCourtsTree(projectId){
                const id = await this.getCourtsList({ ...this.params, projectId }).then(res=>{
                    if( !res && res.data && res.data.length ) return;
                    this.options = res.data;
                    this.value = res.data[0].id;

                    return res.data[0].id;
                })
                const courts_tree = await this.ConnectionsForCourts(id);
                return courts_tree;
            },
            // 切换台区
            selectCourts(courtsId){
                this.ConnectionsForCourts(courtsId,2);
            }
        },
    }
</script>

<style lang='scss' scoped>
    .dagre-graph-container {
        width: 100%;
        height: 800px;
    }
</style>
