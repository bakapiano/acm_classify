$("#query-btn").click(function () {
    $.get("/api/supported", function (data, status) {
        supported = JSON.parse(data);
        // console.log(supported);
        query = [];
        for (var i = 0; i < supported.length; i++) {
            workers = $("." + supported[i]);
            for (var j = 0; j < workers.length; j++)
                query.push([supported[i], workers[j].value]);
        }
        // console.log(query)
        $.post("/frontend/save", {"data": query}, function (data,) {
            $.get("/frontend/query", function (data, status) {
                // console.log(data)
                window.location.replace("/statistics/");
            });
        });
    });
});

$("#set-all")[0].onchange = function () {
    $.get("/api/supported", function (data, status) {
        supported = JSON.parse(data);
        query = [];
        for (var i = 0; i < supported.length; i++) {
            workers = $("." + supported[i]);
            for (var j = 0; j < workers.length; j++)
                workers[j].value = $("#set-all")[0].value;
        }
    });
};

function worker_close() {
    oj_name = this.parentNode.parentNode.getElementsByTagName("a")[0].text.toLocaleLowerCase();
    if ($("." + oj_name).length == 1) {
        return;
    }

    workers = document.getElementsByClassName("worker");
    for (var i = 0; i < workers.length; i++) {
        worker = workers[i];
        if (worker.getElementsByClassName("close-worker")[0] === this) {
            // console.log(worker)
            worker.remove();
        }
    }
}

function worker_clone() {
    workers = document.getElementsByClassName("worker");
    for (var i = 0; i < workers.length; i++) {
        worker = workers[i];
        if (worker.getElementsByClassName("clone-worker")[0] === this) {
            target = worker;
            // console.log(target);
        }
    }
    // console.log(target);
    new_worker = target.cloneNode(100);
    main = document.getElementById("main");
    main.appendChild(new_worker);

    new_worker.getElementsByClassName("clone-worker")[0].onclick = worker_clone;
    new_worker.getElementsByClassName("close-worker")[0].onclick = worker_close;
}

$(".close-worker").click(worker_close);
$(".clone-worker").click(worker_clone);

$("#save-btn").click(function () {
    $.get("/api/supported", function (data, status) {
        supported = JSON.parse(data);
        // console.log(supported);
        query = [];
        for (var i = 0; i < supported.length; i++) {
            workers = $("." + supported[i]);
            for (var j = 0; j < workers.length; j++)
                query.push([supported[i], workers[j].value]);
        }
        // console.log(query)
        $.post("/frontend/save", {"data": query}, function (data,) {
            $.get("/frontend/query", function (data, status) {
                // console.log(data)
            });
        });
    });
});

$("#load-btn").click(function () {
    $("#reset-btn").click();
    $.get("/frontend/load", function () {
        $.get("/frontend/query", function (data, status) {
            query = JSON.parse(data);
            if (query === null) return;
            for (var i = 0; i < query.length; i++) {
                record = query[i];

                workers = document.getElementsByClassName("worker");
                for (j = 0; j < workers.length; j++) {
                    worker = workers[j];
                    // console.log(worker);
                    if (worker.getElementsByClassName(record[0]).length !== 0)
                        if (worker.getElementsByClassName(record[0])[0].value === "")
                            break;
                }

                if (j === workers.length) {
                    // console.log(document.getElementsByClassName(record[0])[0])
                    document.getElementsByClassName(record[0])[0].parentNode.parentNode.parentNode.getElementsByClassName("clone-worker")[0].click()
                }
                workers = document.getElementsByClassName("worker");

                workers[j].getElementsByClassName(record[0])[0].value = record[1];
            }
        });
    });
});

$("#reset-btn").click(function () {
    inputs = $("input");
    for (j = 0; j < inputs.length; j++)
        inputs[j].value = "";
    workers = document.getElementsByClassName("worker");
    for (j = 0; j < workers.length; j++) {
        workers[j].getElementsByClassName("close-worker")[0].click();
    }
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

$("#load-btn").click();

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