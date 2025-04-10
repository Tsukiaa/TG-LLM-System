$(document).ready(function() {
    $('#searchBtn').click(function() {
        const entity = document.getElementById("startEntity").value;

        if (entity === '') {
            alert('请输入一个实体');
            return;
        }

        console.log("正在发送请求，实体:", entity);

        $.ajax({
            url: '../retrieveFragments/',
            method: 'POST',
            data: { "entity": entity },
            success: function(res_data) {
                res_data = JSON.parse(res_data);
                fragments = res_data["fragments"];
                displayFragments(fragments);
            },
            error: function() {
                alert('请求失败，请稍后再试');
            }
        });
    });

    function displayFragments(fragments) {
        $('#fragmentsContainer').empty();

        if (fragments.length === 0) {
            $('#fragmentsContainer').append('<p>没有找到相关片段</p>');
            return;
        }

        let fragmentOptions = '';

        fragments.forEach(function(fragmentGroup) {
            let fragmentText = fragmentGroup.map(frag => `[${frag[0]}, ${frag[1]}, ${frag[2]}, ${frag[3]}]`).join(' ');

            fragmentOptions += `<div class="option" data-value='${fragmentText}'>${fragmentText}</div>`;
        });

        let dropdownHtml = `
            <div class="custom-dropdown">
                <div class="selected-option" data-value="">请选择一个片段</div>
                <div class="options-container">${fragmentOptions}</div>
            </div>
        `;

        $('#fragmentsContainer').append(dropdownHtml);

        $('.selected-option').click(function () {
            $('.options-container').toggle();
        });

        $('.option').click(function () {
            let selectedText = $(this).html();
            let selectedValue = $(this).data('value');
            $('.selected-option').html(selectedText);
            $('.selected-option').attr('data-value', selectedValue);
            $('.options-container').hide();
            console.log("选中的片段字符串:", selectedValue);
        });

        $('#generateBtn').prop('disabled', false);
    }

    $('#generateBtn').click(function() {
        let selectedFragment = $('.selected-option').attr('data-value');

        if (!selectedFragment) {
            alert('请选择一个片段');
            return;
        }

        try {
            var fragmentData = parseFragmentString(selectedFragment);
        } catch (error) {
            console.error("解析片段失败:", error);
            alert('选中的片段数据有误，请重试');
            return;
        }

        console.log("转换后的片段数据:", fragmentData);

        $.ajax({
            url: "../text_gen/",
            method: "POST",
            contentType: "application/json",  // 关键：指定 JSON 格式
            data: JSON.stringify({ "fragment": fragmentData }),  // 关键：转换为 JSON 字符串
            success: function(res_data) {
                // 解析返回的 JSON 数据
                const text_result = res_data['result'];
                $('#generatedText').text(text_result);
                $('#generatedTextContainer').removeClass('hidden');

            },
            error: function() {
                alert('请求失败，请稍后再试');
            }
        });
    });

    function parseFragmentString(fragmentString) {
        // 使用正则表达式匹配所有形如 [xxx, xxx, xxx, xxx] 的子串
        let matches = fragmentString.match(/\[.*?\]/g);

        if (!matches) {
            throw new Error("未找到有效片段");
        }

        // 解析为二维数组
        return matches.map(item => {
            return item.slice(1, -1)  // 去掉开头和结尾的 `[]`
                .split(', ')          // 按 `, ` 分割
                .map(value => value.trim()); // 去掉多余空格
        });
    }
});
