    // $('#loading').modal('show');

    function create_table(counter) {
        new_row = $(".row")[$(".row").length - 1].cloneNode(true);
        // console.log(new_row);
        $(".container")[1].appendChild(new_row);

        // console.log(counter);
        var dataAxis = Object.keys(counter);
        var data = Object.values(counter);
        var yMax = 500;
        var temp_list = document.getElementsByClassName("table");
        var Chart = echarts.init(temp_list[temp_list.length - 2]);
        option = {
            title: {
                text: "TOTAL",
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: dataAxis,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '解题量',
                    type: 'bar',
                    barWidth: '60%',
                    data: data
                }
            ]
        };
        Chart.setOption(option);
    }

    function create_pie(counter, title) {
        new_row = $(".row")[$(".row").length - 1].cloneNode(true);
        // console.log(new_row);
        $(".container")[1].appendChild(new_row);
        tables = document.getElementsByClassName("table");
        var Chart = echarts.init(tables[tables.length - 2]);
        var mydata = []
        var len = Object.keys(counter).length;
        for (var i = 0; i < len; i++) {
            mydata.push({
                name: Object.keys(counter)[i],
                value: Object.values(counter)[i]
            });
        }
        mydata.sort(function (a, b) {
            return b.value - a.value;
        });

        var other = 0;
        while (mydata.length > 30)
            other += mydata.pop().value;
        mydata.push({
            name: "其他",
            value: other,
        })

        // console.log(mydata);
        var option = {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
                {
                    name: '标签',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: mydata,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        Chart.setOption(option);
    }

    var total_counter = {};
    var oj_counter = {};

    var res;
    $.ajax({
        url: "/frontend/query",
        type: "get",
        async: false,
        data: "",
        success: function (data) {
            res = data;
        }
    });

    // console.log(res);
    var records = JSON.parse(res);
    var ajax_list = []
    // console.log(records);

    if (records === null)
        window.location.replace("/query");

    for (var i = 0; i < records.length; i++) {
        oj_name = records[i][0]
        username = records[i][1]
        // console.log(oj_name, username)
        ajax_list.push($.ajax({
            url: "/api/user/" + oj_name + "/" + username,
            type: "get",
            async: true,
            data: "",
            success: function (data) {
                var counter = {};
                var tags = Object.values(JSON.parse(data).data.solved);

                for (var i = 0; i < tags.length; i++) {
                    for (var j = 0; j < tags[i].length; j++) {
                        var tag = tags[i][j];
                        if (counter[tag] === undefined)
                            counter[tag] = 0;
                        counter[tag]++;
                        if (total_counter[tag] === undefined)
                            total_counter[tag] = 0;
                        total_counter[tag]++;
                    }
                }
                var temp_list = this.url.split("/");
                var username = temp_list.pop();
                var oj_name = temp_list.pop();
                create_pie(
                    counter,
                    username + " on " + oj_name,
                );

                if (oj_counter[oj_name] === undefined)
                    oj_counter[oj_name] = 0;
                oj_counter[oj_name] += tags.length;

            }
        }));
    }

    // var temp;
    // temp.length;

    const p = Promise.all(ajax_list);
    p.then(res => {
        create_table(total_counter);
        create_table(oj_counter);
        temp_list = document.getElementsByClassName("row");
        temp_list[temp_list.length-1].remove();
    })

    $.get("/frontend/current", function (data, status) {
        if (data.error == true) {
            $("#navbar-logout")[0].remove();
            $("#navbar-login")[0].style.visibility = "visible";
        } else {
            $("#navbar-login")[0].remove();
            $("#navbar-logout")[0].getElementsByTagName("i")[0].textContent = " " + data.data
            $("#navbar-logout")[0].style.visibility = "visible";
        }
        // console.log(data);
    });
    // console.log(total_counter)
