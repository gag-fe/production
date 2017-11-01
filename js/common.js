function formatDate(date, format) {
    if (!date) return;
    if (!format) format = "yyyy-MM-dd";
    switch (typeof date) {
        case "string":
            date = new Date(date.replace(/-/, "/"));
            break;
        case "number":
            date = new Date(date);
            break;
    }
    if (!date instanceof Date) return;
    var dict = {
        "yyyy": date.getFullYear(),
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "H": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "MM": ("" + (date.getMonth() + 101)).substr(1),
        "dd": ("" + (date.getDate() + 100)).substr(1),
        "HH": ("" + (date.getHours() + 100)).substr(1),
        "mm": ("" + (date.getMinutes() + 100)).substr(1),
        "ss": ("" + (date.getSeconds() + 100)).substr(1)
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
        return dict[arguments[0]];
    });
}

document.onkeydown = function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 13) { // enter 键
        //要做的事情
        return false;
    }
};


function shadowShowText(title, content) {

    $(".pop .title").html("");
    $(".pop .text").html("");
    if (null != title && title != '') {
        $(".pop .title").html(title);
    }

    if (null != content && content != '') {
        $(".pop .text").html(content);
    }
    $(".shadow").show();

}

var funcok = null;

function showConfirm(title, content, callback) {

    $(".pop .title").html("");
    $(".pop .text").html("");
    if (null != title && title != '') {
        $(".pop .title").html(title);
    }

    if (null != content && content != '') {
        $(".pop .text").html(content);
    }
    $(".confirm").show();
    if (jQuery.isFunction(callback)) {
        funcok = callback;
    } else {
        funcok = null;
    }
}

function showModal(title, content) {

    $("#modalBasic #title").html("");
    $("#modalBasic #content").html("");
    if (null != title && title != '') {
        $("#modalBasic #title").html(title);
    }

    if (null != content && content != '') {
        $("#modalBasic #content").html(content);
    }
    $("#modalBasic").modal("show");
}

function login(parameter) {
    $.removeCookie('user_data', { path: '/' });
    $.removeCookie('com.gooagoo.passpart.sso.token.name', { path: '/', domain:window.gooagoodomain });
    if( parameter == 'out' ){
        window.location.href = 'https://passport' + window.gooagoodomain + '/index.html';
    }else{
        window.location.href = 'https://passport' + window.gooagoodomain + '/index.html?service=' + window.location.host;
    }
}

$(function() {
    $('.b-close').on('click', function() {
        $(".shadow").hide();
        $(".confirm").hide();

    });
    $('.ok').on('click', function() {
        $(".confirm").hide();
        $(".popup").hide();
        if (jQuery.isFunction(funcok)) {
            funcok();
        }
    });

    $.fn.extend({
        insertContent: function(myValue, t) {
            var $t = $(this)[0];
            if (document.selection) { // ie
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
                sel.moveStart('character', -l);
                var wee = sel.text.length;
                if (arguments.length == 2) {
                    var l = $t.value.length;
                    sel.moveEnd("character", wee + t);
                    t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
                    sel.select();
                }
            } else if ($t.selectionStart || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
                if (arguments.length == 2) {
                    $t.setSelectionRange(startPos - t,
                        $t.selectionEnd + t);
                    this.focus();
                }
            } else {
                this.value += myValue;
                this.focus();
            }
        }
    });
})

//转化2位小数
function formatCurrency(num) {
    if(num == undefined || num == null){
        num = "0";
    }
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    var cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
};

function showPopup(title, content, callback) {

    $(".pop .title").html("");
    $(".pop .text").html("");
    if (null != title && title != '') {
        $(".pop .title").html(title);
    }

    if (null != content && content != '') {
        $(".pop .text").html(content);
    }
    $(".popup").show();
    if (jQuery.isFunction(callback)) {
        funcok = callback;
    } else {
        funcok = null;
    }

}

function convertTree(list) {
    // var tree = [];
    // if (list != null) {
    //     if (list.length == 2) {
    //         list[0]['temp'] = list[0]['id'];
    //         list[1]['temp'] = list[1]['id'];
    //         delete(list[0]['id']);
    //         delete(list[1]['id']);
    //         if (list[0]['temp'] == list[1]['parentId']) {
    //             tree.push({ "id": list[1]['temp'], "name": "　　　" + list[1]['name'], "parentId": list[1]['parentId'], "floor": 1 });
    //             tree.push({ "id": list[0]['temp'], "name": list[0]['name'], "parentId": list[0]['parentId'], "floor": 1 });
    //         } else if (list[1]['temp'] == list[0]['parentId']) {
    //             console.info("1");
    //             tree.push({ "id": list[0]['temp'], "name": "　　　" + list[0]['name'], "parentId": list[0]['parentId'], "floor": 1 });
    //             tree.push({ "id": list[1]['temp'], "name": list[1]['name'], "parentId": list[1]['parentId'], "floor": 1 });
    //         } else {
    //             tree.push({ "id": list[0]['temp'], "name": list[0]['name'], "parentId": list[0]['parentId'], "floor": 1 });
    //             tree.push({ "id": list[1]['temp'], "name": list[1]['name'], "parentId": list[1]['parentId'], "floor": 1 });
    //         }
    //     } else {
    //         $.each(list, function(i, value) {
    //             tree.push({ "id": list[i]['id'], "name": list[i]['name'], "parentId": list[i]['parentId'], "floor": 1 });
    //         });
    //         var length = tree.length;
    //         for (var i = 0; i < length; i++) { //遍历原数组保证原数组全部走到
    //             if (list[i]['parentId'] != '-1') {
    //                 for (var j = 0; j < length; j++) {
    //                     if (list[i]['parentId'] == tree[j]['id']) { //找到当前节点的父节点
    //                         var count = tree[j]['floor'];
    //                         var prefixion = "";
    //                         for (var h = 0; h < count - 1; h++) {
    //                             prefixion += "　　　";
    //                         }
    //                         for (var g = 0; g < length; g++) {
    //                             if (list[i]['id'] == tree[g]['id']) { //找到当前节点
    //                                 var array = new Array();
    //                                 array.push({ "id": tree[g]['id'], "name": "　　　" + prefixion + tree[g]['name'], "parentId": tree[g]['parentId'], "floor": tree[g]['floor'] + count });
    //                                 if (length - 1 > g) {
    //                                     for (var k = g + 1; tree[k]['floor'] < tree[g]['floor']; k++) {
    //                                         array.push({ "id": tree[k]['id'], "name": "　　　" + prefixion + tree[k]['name'], "parentId": tree[k]['parentId'], "floor": tree[k]['floor'] + count })
    //                                     }
    //                                     tree.splice(g, k - g);
    //                                 } else {
    //                                     tree.splice(g, 1);
    //                                 }
    //                                 for (var t = 0; t < length - k + g; t++) {
    //                                     if (tree[t]['id'] == list[i]['parentId']) { //找到当前节点的父节点的位置
    //                                         var index = t;
    //                                         $.each(array, function(i, value) {
    //                                             tree.splice(index++, 0, array[i]);
    //                                         });
    //                                         break;
    //                                     }
    //                                 }
    //                                 break;
    //                             }
    //                         }
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    var tree = listTree(list);
    return treeList(tree);
}

function listTree(array) {
    var tree = [];
    if (array != null) {
        var count = array.length;
        for (var i = 0; i < count; i++) {
            if (array[i].parentId == '-1') {
                tree.push(array[i]);
            } else if (array[i].parentId != '-1') {
                var nodeHasParent = false;
                for (var j = 0; j < count; j++) {
                    var item = array[j];
                    if (array[i].id == item.id) {
                        continue;
                    }
                    if (array[i].parentId == item.id) {
                        item.children = item.children == null ? [] : item.children;
                        item.children.push(array[i]);
                        nodeHasParent = true;
                        break;
                    }
                }
                if (!nodeHasParent) {
                    tree.push(array[i]);
                }
            }
        }
    }
    return tree;
}

function treeList(array) {
    var list = [];
    if (array != null) {
        var count = array.length;
        for (var i = 0; i < count; i++) {
            list.push({ "id": array[i]['id'], "name": array[i]['name'], "parentId": array[i]['parentId'], "floor": 1,  "type":  array[i]['type'] });
            if (array[i].children != null && array[i].children.length > 0) {
                childrenList(array[i].children, list, 1);
            }
        }
    }
    return list;
}

function childrenList(children, list, floor) {
    if (children != null && list != null) {
        var count = children.length;
        var childrenfloor = floor + 1;
        for (var j = 0; j < count; j++) {
            var prefixion = "";
            for (var k = 0; k < floor; k++) {
                prefixion += "　　　";
            }
            list.push({ "id": children[j]['id'], "name": prefixion + children[j]['name'], "parentId": children[j]['parentId'], "floor": childrenfloor, "type":  children[j]['type']});
            if (children[j].children != null && children[j].children.length > 0) {
                childrenList(children[j].children, list, childrenfloor);
            }
        }

    }
}

function obj2str(o) {
    var r = [];
    if (typeof o == "string" || o == null) {
        return "\"" + o + "\"";
    }
    if (typeof o == "object") {
        if (!o.sort) {
            r[0] = "{"
            for (var i in o) {
                r[r.length]="\"" + i + "\"";
                r[r.length] = ":";
                r[r.length] = obj2str(o[i]);
                r[r.length] = ",";
            }
            r[r.length - 1] = "}"
        } else {
            r[0] = "["
            for (var i = 0; i < o.length; i++) {
                r[r.length] = obj2str(o[i]);
                r[r.length] = ",";
            }
            r[r.length - 1] = "]"
        }
        return r.join("");
    }
    return o.toString();
}

var weekF = "weekF";
var weekP = "weekP"

function weekend() {
    var monday = $("#" + weekF).val();
    $("#" + weekP).val(formatDate(new Date(parseInt(monday.substr(0, 4)), parseInt(monday.substr(5, 2)) - 1, parseInt(monday.substr(8, 2)) + 6), 'yyyy-MM-dd'));
}

var yearOne = "dayFirst";
var yearTwo = "daySecond";
var yearThree = "dayThird";
var yearFour = "dayFourth";

function yearFirstFunction() {
    // yearOne = yearFirst;
    // yearTwo = yearSecond;
    // yearThree = yearThird;
    // yearFour = yearFourth;
    $("#" + yearTwo).prop("disabled", false);
    $("#" + yearTwo).val("");
    $("#" + yearThree).val("");
    $("#" + yearFour).val("");
    $("#" + yearTwo).focus();
    $dp.$(yearTwo).click();
}

function yearSecondFunction() {
    // yearOne = yearFirst;
    // yearTwo = yearSecond;
    // yearThree = yearThird;
    // yearFour = yearFourth;
    $("#" + yearThree).prop("disabled", false);
    $("#" + yearThree).val("");
    $("#" + yearFour).val("");
    $("#" + yearThree).focus();
    $dp.$(yearThree).click();
}

function dayRange() {
    var array = [];
    var dateFirst = $("#" + yearOne).val();
    var dateSecond = $("#" + yearTwo).val();
    var dateOne = new Date(parseInt(dateFirst.substr(0, 4)), parseInt(dateFirst.substr(5, 2)) - 1, parseInt(dateFirst.substr(8, 2))).getTime();
    var dateTwo = new Date(parseInt(dateSecond.substr(0, 4)), parseInt(dateSecond.substr(5, 2)) - 1, parseInt(dateSecond.substr(8, 2))).getTime();
    dateOne = dateOne - (dateTwo - dateOne);
    while (dateOne <= dateTwo) {
        array.push(formatDate(new Date(dateOne), 'yyyy-MM-dd'));
        dateOne += 86400000;
    }
    return array;
}

function dayThirdFunction() {
    var dateFirst = $("#" + yearOne).val();
    var dateSecond = $("#" + yearTwo).val();
    var dataThird = new Date($dp.cal.newdate['y'], $dp.cal.newdate['M'] - 1, $dp.cal.newdate['d']);
    var timeRange = new Date(parseInt(dateSecond.substr(0, 4)), parseInt(dateSecond.substr(5, 2)) - 1, parseInt(dateSecond.substr(8, 2))) - new Date(parseInt(dateFirst.substr(0, 4)), parseInt(dateFirst.substr(5, 2)) - 1, parseInt(dateFirst.substr(8, 2)));
    $("#" + yearFour).val(formatDate(new Date(dataThird.getTime() + timeRange)));
}

function monthRange() {
    var array = [];
    var dateFirst = $("#" + yearOne).val();
    var dateSecond = $("#" + yearTwo).val();
    var dateOne = (parseInt(dateFirst.substr(0, 4)) * 12) + parseInt(dateFirst.substr(5, 2));
    var dateTwo = (parseInt(dateSecond.substr(0, 4)) * 12) + parseInt(dateSecond.substr(5, 2));
    dateOne = dateOne - (dateTwo - dateOne);
    while (dateOne <= dateTwo) {
        var year = parseInt(dateOne / 12);
        array.push(formatDate(new Date(year, (dateOne - year * 12 - 1), 1), 'yyyy-MM'));
        dateOne += 1;
    }
    return array;
}

function monthThirdFunction() {
    var dateFirst = $("#" + yearOne).val();
    var dateSecond = $("#" + yearTwo).val();
    var timeRange = ((parseInt(dateSecond.substr(0, 4)) * 12) + parseInt(dateSecond.substr(5, 2))) - ((parseInt(dateFirst.substr(0, 4)) * 12) + parseInt(dateFirst.substr(5, 2)));
    $("#" + yearFour).val(formatDate(new Date($dp.cal.newdate['y'], $dp.cal.newdate['M'] - 1 + timeRange, $dp.cal.newdate['d']), 'yyyy-MM'));
}

function yearRange() {
    var array = [];
    var dateFirst = $("#" + yearOne).val();
    var dateSecond = $("#" + yearTwo).val();
    var dateOne = parseInt(dateFirst.substr(0, 4));
    var dateTwo = parseInt(dateSecond.substr(0, 4));
    dateOne = dateOne - (dateTwo - dateOne);
    while (dateOne <= dateTwo) {
        array.push(formatDate(new Date(dateOne, 1, 1), 'yyyy'));
        dateOne += 1;
    }
    return array;
}

function yearThirdFunction() {
    var dateFirst = $("#" + yearOne).val();
    var dateSecond = $("#" + yearTwo).val();
    var timeRange = (parseInt(dateSecond.substr(0, 4))) - (parseInt(dateFirst.substr(0, 4)));
    $("#" + yearFour).val(formatDate(new Date($dp.cal.newdate['y'] + timeRange, $dp.cal.newdate['M'] - 1, $dp.cal.newdate['d']), 'yyyy'));
}

function left(select, id) {
    var date = $("#" + id).val();
    if (select == 'day') {
        $("#" + id).val(formatDate(new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)) - 1, parseInt(date.substr(8, 2)) - 1), 'yyyy-MM-dd'));
    } else if (select == 'week') {
        var weekF = $("#" + id + "F").val(); //当前日期
        var now = new Date(parseInt(weekF.substr(0, 4)), parseInt(weekF.substr(5, 2)) - 1, parseInt(weekF.substr(8, 2)));
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getFullYear(); //当前年
        $("#" + id + "F").val(formatDate(new Date(nowYear, nowMonth, nowDay - 7), 'yyyy-MM-dd'));
        $("#" + id + "P").val(formatDate(new Date(nowYear, nowMonth, nowDay - 1), 'yyyy-MM-dd'));
    } else if (select == 'month') {
        $("#" + id).val(formatDate(new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)) - 2, 1), 'yyyy-MM'));
    } else if (select == 'year') {
        $("#" + id).val(formatDate(new Date(parseInt(date.substr(0, 4)) - 1, 1, 1), 'yyyy'));
    }
}

function right(select, id) {
    var date = $("#" + id).val();
    if (select == 'day') {
        $("#" + id).val(formatDate(new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)) - 1, parseInt(date.substr(8, 2)) + 1), 'yyyy-MM-dd'));
    } else if (select == 'week') {
        var weekF = $("#" + id + "F").val(); //当前日期
        var now = new Date(parseInt(weekF.substr(0, 4)), parseInt(weekF.substr(5, 2)) - 1, parseInt(weekF.substr(8, 2)));
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getFullYear(); //当前年
        $("#" + id + "F").val(formatDate(new Date(nowYear, nowMonth, nowDay + 7), 'yyyy-MM-dd'));
        $("#" + id + "P").val(formatDate(new Date(nowYear, nowMonth, nowDay + 13), 'yyyy-MM-dd'));
    } else if (select == 'month') {
        $("#" + id).val(formatDate(new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)), 1), 'yyyy-MM'));
    } else if (select == 'year') {
        $("#" + id).val(formatDate(new Date(parseInt(date.substr(0, 4)) + 1, 1, 1), 'yyyy'));
    }
}


