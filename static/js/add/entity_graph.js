document.getElementById("searchButton").addEventListener("click", function() {
    const query = document.getElementById("queryInput").value;
    if (query) {
        // 发送 POST 请求到 Django 后端
        $.ajax({
            url: "../search_triplets/",  // 后端接口
            method: "POST",
            data: {
                "entity": query  // 将查询的实体作为数据传递
            },
            success: function(res_data) {
                // 解析返回的 JSON 数据
                res_data = JSON.parse(res_data);
                const triples_list = res_data['triples_list'];  // 假设返回数据中包含了 triples_txt 字段
                // 调用渲染图谱的函数
                show_graph(query, triples_list);
            },
            error: function(xhr, status, error) {
                console.error("请求失败:", error);
                alert("检索失败，请重试！");
            }
        });
    } else {
        alert("请输入查询的实体！");
    }
});


function show_graph(query, triples_list) {
    d3.select("#graphContainer").html("");

    const width = 800, height = 600;

    const svg = d3.select("#graphContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "transparent");

    const nodesMap = new Map();
    const links = [];

    // 统计两个实体之间的关系数量
    const edgeCounts = new Map();

    triples_list.forEach(([head, relation, tail]) => {
        if (!nodesMap.has(head)) {
            nodesMap.set(head, { id: head, color: head === query ? "#C00000" : "#647C9C" });
        }
        if (!nodesMap.has(tail)) {
            nodesMap.set(tail, { id: tail, color: tail === query ? "#C00000" : "#647C9C" });
        }

        const key = head < tail ? `${head}-${tail}` : `${tail}-${head}`;
        edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);

        links.push({ source: head, target: tail, relation, key });
    });

    const nodes = Array.from(nodesMap.values());

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const linkGroups = svg.selectAll(".link-group")
        .data(links)
        .enter()
        .append("g")
        .attr("class", "link-group");

    // 画曲线边，使用不同的偏移量
    const link = linkGroups.append("path")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrow)")
        .attr("d", d => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            const offset = edgeCounts.get(d.key) * 10; // 偏移量，避免重叠
            return `M ${d.source.x},${d.source.y} A ${dr + offset},${dr + offset} 0 0,1 ${d.target.x},${d.target.y}`;
        });

    svg.append("defs").append("marker")
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

    // 画关系文本
    const linkText = linkGroups.append("text")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("transform", (d) => {
            // 为每条关系文本添加偏移
            const dx = (d.source.x + d.target.x) / 2;
            const dy = (d.source.y + d.target.y) / 2;
            return `translate(${dx}, ${dy})`;
        })
        .text(d => d.relation);

    const node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("fill", d => d.color)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    const nodeText = svg.selectAll(".node-text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .text(d => d.id);

    // 更新位置
    simulation.on("tick", () => {
        link.attr("d", d => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            const offset = edgeCounts.get(d.key) * 10;  // 根据数量添加偏移
            return `M ${d.source.x},${d.source.y} A ${dr + offset},${dr + offset} 0 0,1 ${d.target.x},${d.target.y}`;
        });

        linkText.attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2 - 5); // 让文本稍微上移一点

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        nodeText.attr("x", d => d.x)
                .attr("y", d => d.y - 25);  // 调整y位置以避免与节点重叠
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








