
<template>
    <div class=".dagre-graph-container">
        <svg class="dagre">
            <g class="container"></g>
        </svg>
    </div>
</template>

<script>
    /**
     * 流程图
     */
    import * as d3 from 'd3'
    import dagreD3 from 'dagre-d3'

    let container = null

    export default {
        name: 'DagreGraph',
        props: ['nodes', 'edges'],
        data() {
            return {
                id: '',
                svg:null,
                tooltip:null,
                renderer: null,
                graph: null,
                direction: 'TB',
                zoom: null,
                width: 0,
                height: 0
            }
        },
        created() {
            this.graph = new dagreD3.graphlib.Graph().setGraph({
                rankdir: this.direction, // 节点延申方向
                nodesep:100, // 相同层级 rank 中 node 的间距。默认 50
                // edgesep:10, // 即 edge 之间的间距。默认 10
               ranksep:70 // 即相邻层级之间的间距，例如 示例 1 中 A 和 B 的间距以及 B 和 C 的间距。默认 50
            }).setDefaultEdgeLabel(function () { return {} })
        },
        methods: {
            /**
             * 放大or缩小功能
             */
            // zoomCtrl (symbal) {
            //     let scale = symbal === 'out' ? 1.1 : 0.8
            //     const svg = d3.select(this.$el).select('svg.dagre')
            //     this.zoom.scaleBy(svg, scale)
            // },
            /** 
             * @description control the canvas zoom to up or down
             */
            zoomed () {
                d3.select(this.$el).select('g.container').attr('transform', d3.event.transform)
            },
            /** 
             * @description 画节点
             */
            strokeNodes () {
                // 获取之前的nodes缓存并清除
                let nodes = this.graph.nodes()
                if (nodes.length) {
                    nodes.forEach(
                        item => {
                            this.graph.removeNode(item)
                        }
                    )
                }
                
                //通过operator来画shape(BranchPythonMapOperator: 分支； JoinOperator：合流)
                this.nodes.forEach(
                    // rect方形  ellipse椭圆  circle圆形
                    (item) => {
                        let state = item.state ? item.state : 'no-status'
                        let shape = 'rect'
                        if (item.operator === 'BranchPythonMapOperator') {
                            shape = 'ellipse'
                        } else if (item.operator === 'JoinOperator') {
                            shape = 'circle'
                        }
                        
                        this.graph.setNode(item.id, {label: item.name, shape: shape, class: item.operator ||'BranchPythonMapOperator'  + ' dagre ' + state})
                    }
                )
                //画圆角
                this.graph.nodes().forEach((v) => { 
                    var node = this.graph.node(v);
                    // Round the corners of the nodes
                    node.rx = node.ry = 5;
                });

                setTimeout(()=>{
                    //鼠标悬停显示隐藏tooltip
                    this.svg.selectAll("g.node")
                        .on("mouseover", (v)=> {
                            this.tipVisible(this.graph.node(v).label);
                        })
                        .on("mouseout", (v) => {
                            this.tipHidden();
                        })
                })
                

                this.renderer(container, this.graph)   
            },
            /** 
             * @description 画线
             */
            strokeEdges () {
                //一个脚本节点时：不渲染eage
                if (this.nodes.length > 1) {
                    this.edges.forEach(
                        (item) => {
                            if (item.label) {
                                this.graph.setEdge(item.from, item.to, { label: item.label })   
                            } else {
                                this.graph.setEdge(item.from, item.to,{
                                    // style: "stroke: #0fb2cc; fill: none;",
                                    // arrowheadStyle: "fill: #0fb2cc;stroke: #0fb2cc;",
                                    // arrowhead: 'vee'
                                })   
                            }         
                        }
                    )
                    this.renderer(container, this.graph)  
                }      
            },
            //tooltip显示
            tipVisible(textContent) {
                this.tooltip.transition()
                    .duration(400)
                    .style('opacity', 0.9)
                    .style('display', 'block');
                this.tooltip.html(
                    `
                    <div class="tooltip_box">
                        <span style="color:red"> 
                            ${textContent}
                        </span>
                    </div>
                    `

                )
                    .style('left', (d3.event.pageX + 15) + 'px')
                    .style('top', (d3.event.pageY + 15) + 'px');
            },
            //tooltip隐藏
            tipHidden() {
                this.tooltip.transition()
                        .duration(400)
                        .style('opacity', 0)
                        .style('display', 'none');
            }
        },
        mounted () {
            this.width = 1000;
            this.height = 500;
            // eslint-disable-next-line
            this.renderer = new dagreD3.render()
            this.svg = d3.select(this.$el).select('svg.dagre')
                .attr('width', this.width)
                .attr('height', this.height)
            container = this.svg.select('g.container')
            // transform
            const transform = d3.zoomIdentity.translate(this.width / 3, this.height / 6).scale(1)    
            this.zoom = d3.zoom()
                .scaleExtent([1 / 2, 8])
                .on('zoom', this.zoomed)
            container.transition().duration(750).call(this.zoom.transform, transform)
            this.svg.call(this.zoom)


            //创建提示框
            function createTooltip() {
                return d3.select('body')
                        .append('div')
                        .classed('tooltip', true)
                        .style('opacity', 0)
                        .style('display', 'none');
            };
            this.tooltip = createTooltip();
            

            

            this.strokeNodes()
            this.strokeEdges()

            setTimeout(()=>{
                // this.graph.nodes().forEach((v) => {
                //     let node = this.graph.node(v);
                //     console.log(`Node ${v}: Label:${node.label},X:${node.x},Y:${node.y}`);
                // });

                // this.graph.edges().forEach((v) => {
                //     let edge = this.graph.edge(v);
                // });

                //give IDs to each of the nodes so that they can be accessed
                // svg.selectAll("g.node rect")
                //     .attr("id", function (d) {
                //         return "node" + d;
                //     });
                // svg.selectAll("g.edgePath path")
                //     .attr("id", function (e) {
                //         return e.v + "-" + e.w;
                //     });
                // svg.selectAll("g.edgeLabel g")
                //     .attr("id", function (e) {
                //         return 'label_' + e.v + "-" + e.w;
                //     });
            },1000)

            
        },
        watch: {
            nodes () {
                this.strokeNodes()              
            },
            edges () {
                this.strokeEdges()
            },
            direction () {
                this.graph.setGraph({
                    rankdir: this.direction
                })
                this.renderer(container, this.graph)
            }
        }
    }
</script>
<style lang="scss">
    .edgePath path {
        stroke: #333;
        fill: #333;
        stroke-width: 1.5px;
    }
    /************ 图表变量 ***************/
    $fail: #f77d6b;
    $success: #61b2e4;
    $running: #87d86f;
    $skipped: #faec91;
    $queued: #43e3ed;
    $retry: #f8b96c;
    $no-status: #fff;
    $upstream_failed: rgb(163, 108, 108);
    /**************** dagre 节点图************************/
    g.node.dagre {
        tspan {
            fill: #fff;
            cursor: pointer;
        }
        &.no-status {
            rect {
                stroke: #333;
                fill: #fff;
            }
            ellipse {
                stroke: #333;
                fill: #fff;
            }
            circle {
                stroke: #333;
                fill: #fff;
            }
            tspan {
                fill: #333;
            }
        }
        &.success {
            rect {
                stroke: #fff;
                fill: $success;
            }
            ellipse {
                stroke: #fff;
                fill: $success;
            }
            circle {
                stroke: #fff;
                fill: $success;
            }
        }
        &.failed {
            rect {
                stroke: #fff;
                fill: $fail;
            }
            ellipse {
                stroke: #fff;
                fill: $fail;
            }
            circle {
                stroke: #fff;
                fill: $fail;
            }
        }
        &.upstream_failed {
            rect {
                stroke: #fff;
                fill: $upstream_failed;
            }
            ellipse {
                stroke: #fff;
                fill: $upstream_failed;
            }
            circle {
                stroke: #fff;
                fill: $upstream_failed;
            }
        }
        &.running {
            rect {
                stroke: #fff;
                fill: $running;
            }
            ellipse {
                stroke: #fff;
                fill: $running;
            }
            circle {
                stroke: #fff;
                fill: $running;
            }
        }
        &.skipped {
            rect {
                stroke: #fff;
                fill: $skipped;
            }
            ellipse {
                stroke: #fff;
                fill: $skipped;
            }
            circle {
                stroke: #fff;
                fill: $skipped;
            }
        }
        &.queued {
            rect {
                stroke: #fff;
                fill: $queued;
            }
            ellipse {
                stroke: #fff;
                fill: $queued;
            }
            circle {
                stroke: #fff;
                fill: $queued;
            }
        }
        &.BashOperator {
            &:hover {
                & > rect {
                    cursor: pointer;
                    fill: #7cc9fa;
                }  
            }
        }
        &.BranchPythonMapOperator {
            &:hover {
                & > ellipse {
                    cursor: pointer;
                    fill: #c52bd3;
                }  
            }
        }
        &.BranchPythonMapOperator {
            &:hover {
                & > rect {
                    cursor: pointer;
                    fill: #29b9da;
                }  
            }
        }
        &.JoinOperator {
            &:hover {
                & > circle {
                    cursor: pointer;
                    fill: #0beb8d;
                }  
            }
        }
    }
    .zoom {
        margin-left: 40px;
    }

    .tooltip {
        position: absolute;
        font-size: 12px;
        text-align: center;
        background-color: white;
        border-radius: 3px;
        box-shadow: rgb(174, 174, 174) 0px 0px 10px;
        cursor: pointer;
        display: inline-block;
        padding:10px;
        &_box{
            // width: 50px;
            // background: yellow;
        }
    }

    .tooltip>div {
        padding: 10px;
    }
</style>