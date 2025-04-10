document.getElementById("searchButton").addEventListener("click", function() {
   show_graph([])
   // 发送 POST 请求到 Django 后端
   $.ajax({
            url: "../search_total_triplets/",  // 后端接口
            method: "GET",
            data: null,
            success: function(res_data) {
                // 解析返回的 JSON 数据
                res_data = JSON.parse(res_data);
                const triples_total_list = res_data['triples_total_list'];  // 假设返回数据中包含了 triples_txt 字段
                // 调用渲染图谱的函数
                show_graph(triples_total_list);
            },
            error: function(xhr, status, error) {
                console.error("请求失败:", error);
                alert("检索失败，请重试！");
            }
        });
});

function show_graph(triples_list) {
    d3.select("#graphContent").html("");

    const width = 600, height = 600;

    // 添加一个 g 容器用于缩放
    const svg = d3.select("#graphContent")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "transparent")
        .call(d3.zoom()  // 添加缩放事件
            .scaleExtent([0.1, 5]) // 允许缩放的范围（0.1倍到5倍）
            .on("zoom", function (event) {
                g.attr("transform", event.transform);
            })
        )
        .append("g");  // 这里是图谱的容器

    const g = svg.append("g"); // 用于放置所有元素的 `g` 组，方便整体缩放

    const nodesMap = new Map();
    const links = [];
    const edgeCounts = new Map();

    triples_list.forEach(([head, relation, tail]) => {
        if (!nodesMap.has(head)) nodesMap.set(head, { id: head, color: "#647C9C" });
        if (!nodesMap.has(tail)) nodesMap.set(tail, { id: tail, color: "#647C9C" });

        const key = head < tail ? `${head}-${tail}` : `${tail}-${head}`;
        edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
        links.push({ source: head, target: tail, relation, key });
    });

    const nodes = Array.from(nodesMap.values());

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const linkGroups = g.selectAll(".link-group")
        .data(links)
        .enter()
        .append("g")
        .attr("class", "link-group");

    const link = linkGroups.append("path")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrow)");

    g.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "black");

    const linkText = linkGroups.append("text")
        .attr("font-size", "2px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .text(d => d.relation);

    const node = g.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("fill", d => d.color)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    const nodeText = g.selectAll(".node-text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("font-size", "6px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .text(d => d.id);

    simulation.on("tick", () => {
        link.attr("d", d => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            const offset = edgeCounts.get(d.key) * 10;
            return `M ${d.source.x},${d.source.y} A ${dr + offset},${dr + offset} 0 0,1 ${d.target.x},${d.target.y}`;
        });

        linkText.attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2 - 5);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        nodeText.attr("x", d => d.x)
                .attr("y", d => d.y - 25);
    });

    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}


