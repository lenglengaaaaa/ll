const options = {
    width: 1200,
    height: 500,
    boxWidth: 65,
    boxHeight: 40
}

// 纵向树状图类
const StructureGraph = (layout) =>{
    const { width, height } = layout;

    // 布局
    this.tree = d3.layout.tree()
        .size([width, height - 200])
        .separation(function (a, b) {
            return (a.parent == b.parent ? 1 : 2);
        });

    this.diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x, d.y];
        });

    // 用来拖拽图以及扩大缩放
    let zoom = d3.behavior.zoom()
        .scaleExtent([.1, 1])
        .on('zoom',  () => {
            this.svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
        });
    
    // let tooltip = d3.select("#forceMap")
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0.0)
    //     .text(function(d)
    //     {
    //         return "test";
    //     });

    this.svg = d3.select("#forceMap").append("svg")
        .attr("width", width + 80)
        .attr("height", height)
        .call(zoom)
        .append("g")
        .attr("transform", "translate(40,40)")
        // .on("mouseover", function () {
        //     tooltip.style("left", (d3.event.pageX) + "px")
        //     .style("top", (d3.event.pageY + 20) + "px")
        //     .style("opacity", 1.0);
        // })

        
}

// 开始渲染节点与连线
StructureGraph.prototype.render = function (source) {
    this.renderLinks(source);
    this.renderNodes(source);
    return this;
}

// 渲染节点
StructureGraph.prototype.renderNodes = (source) => {
    var _this = this;
    this.node = this.svg.selectAll(".node")
        .data(this.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("strokeWidth", 100)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
    // 绘制矩形与文字
    drawRect();

    function drawRect() {
        _this.node.append("rect")
            .attr('y', 0)
            .attr('x', function (d) {
                return d.depth !== 2 ? -(options.boxWidth / 2) : -(options.boxWidth / 2)
            })
            .attr('width', function (d) {
                // return d.depth !== 2 ? options.boxWidth : options.boxHeight;
                return options.boxWidth;
            })
            .attr('height', function (d) {
                // return d.depth !== 2 ? options.boxHeight : options.boxWidth;
                return options.boxWidth;
            })
            // 矩形背景色以及边框颜色宽度
            .attr('fill', '#fff')
            .attr('stroke', 'steelblue')
            .attr('strokeWidth', '1px')
            .on('click', function (evt) {
                console.log(evt); // 显示所点击节点数据
            });

        // Draw the person's name and position it inside the box
        _this.node.append("text")
            .attr('y', function (d) {
                // return d.depth !== 2 ? options.boxHeight / 2 + 5 : 0;
                return options.boxHeight;
            })
            // .attr('rotate', function (d) { //显示竖直显示中文时rotate为0，英文-90
            //     return 0;
            // })
            .attr('style', function (d) {
                // return d.depth !== 2 ? '' : "writing-mode: tb;letter-spacing:0px";
                return "";
            })
            .attr("text-anchor", function (d) {
                // return d.depth !== 2 ? 'middle' : "start";
                return "middle";
            })
            .text(function (d) {
                return d.name;
            });
    }

}

// 渲染连线
StructureGraph.prototype.renderLinks = (source) => {
    var _this = this;
    this.nodes = this.tree.nodes(source);
    
    this.links = this.tree.links(this.nodes);

    drawLine();
    // 将曲线换为折线
    function drawLine() {
        console.log(_this,'_this');
        var link = _this.svg.selectAll("path.link")

            // The function we are passing provides d3 with an id
            // so that it can track when data is being added and removed.
            // This is not necessary if the tree will only be drawn once
            // as in the basic example.
            .data(_this.links);

        // Add new links    
        link.enter().append("path")
            .attr("class", "link");

        // Remove any links we don't need anymore
        // if part of the tree was collapsed
        link.exit().remove();

        // Update the links positions (old and new)
        link.attr("d", elbow);

        function elbow(d) {
            let sourceX = d.source.x,
                sourceY = d.source.y + options.boxHeight,
                targetX = d.target.x,
                targetY = d.target.y;

            return "M" + sourceX + "," + sourceY +
                "V" + ((targetY - sourceY) / 2 + sourceY) +
                "H" + targetX +
                "V" + targetY;
        }
    }
}

// 渲染连线
StructureGraph.prototype.update = (source) => {
    // this.svg.remove();   //删除整个SVG
    // this.svg.select('#forceMap')
    //         .selectAll('*')
    //         .remove();
}

export default StructureGraph;

