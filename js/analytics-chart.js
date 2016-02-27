$(document).ready(function () {
    $("#dp_start").datepicker();
    $("#dp_end").datepicker();
    // prepare chart data
    var months = {
        Jan: "January",
        Feb: "Febuary",
        Mar: "March",
        Apr: "April",
        May: "May",
        Jun: "June",
        Jul: "July",
        Aug: "August",
        Sep: "September",
        Oct: "October",
        Nov: "November",
        Dec: "December"
    };

    preparingAjax();

    $("#apply-filter").click(
        function (event) {
            $(".loader-pie").show();
            preparingAjax();
        }
    );

    $("#BasicFilter_MerchantId").change(
        function (event) {
            $(".loader").show();
            preparingAjax();
        }
        );
});

function loadAnalyticData(dtf, dtt, merchantid) {
    $.getJSON("./Dashboard/GetAnalyticData", {
        from: dtf,
        to: dtt,
        merchantid: merchantid
    }, function (data) {
        if (data.ErrorCode != 0) {
            window.location = "Home/Login";
        }
        else {
            if (data.Data != null) {
                if (data.Data.AnalyticsAccTranStatus != null)
                    setChart1(data.Data.AnalyticsAccTranStatus);
                if (data.Data.ApprovedTrans != null)
                    setChart2(data.Data.ApprovedTrans);
                if (data.Data.AnalyticsAccCardType != null)
                    setChart3(data.Data.AnalyticsAccCardType);
                if (data.Data.IncompleteTranAnalytics != null)
                    setChart4(data.Data.IncompleteTranAnalytics);
                setStatistics(data.Data);
            }
            else {
                setChart1(null);
                setChart2(null);
                setChart3(null);
                setChart4(null);
                $('#numOfStaff').text('-');
                $('#avgNumPrAcDv').text('-');
                $('#avgTranPrDv').text('-');
                $('#avgTranPrUr').text('-');
                $('#emvTranP').text('-');
                $('#msrTranP').text('-');
                $('#actSt').text('-');
                $('#inactSt').text('-');
                $('#actDv').text('-');
                $('#inactDv').text('-');
                $('#actMr').text('-');
                $('#totMr').text('-');
            }
        }

        $(".loader").fadeOut(1000);
        //$("#MerchantDetail_email_template_pdf").html(data.TemplateContent);
    });
}

function preparingAjax() {
    loadAnalyticData($('#BasicFilter_FromDateString').val(), $('#BasicFilter_ToDateString').val(), $('#BasicFilter_MerchantId').val());
    setTimeout(function () {
        $(".loader").fadeOut(1000);
    }, 5000);
}

function ChangeDateFormat(jsondate) {
    if (!jsondate)
        return;
    jsondate = jsondate.replace("/Date(", "").replace(")/", "");
    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    }
    else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }

    var date = new Date(parseInt(jsondate, 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate;
}

function sortDate(a, b) {
    return a.To - b.To
}

function sortStatus(a, b) {
    return a.Status - b.Status
}

function CalculateIntervalFromMaxValue(maxValue) {
    // Return values so that the intervals have a minimum of 3 ticks, and a maximum of 10,
    // so that it will be pleasant to view at any value. Example:
    // Value            Interval
    // -------          --------
    // 0 - 10           1
    // 11 - 50          5
    // 51 - 100         10
    // 101 - 500        50
    // 501 - 1000       100
    // 1001 - 5000      500
    // 5001 - 10000     1000
    // 10001 - 50000    5000
    // etc.

    // E.g. Value 10-99 = floor 10
    var floorPowerOfTen = Math.pow(10, maxValue.toString().length - 1);

    // E.g. Value 10-99 = halfway 50
    var halfwayToNextPowerOfTen = Math.pow(10, maxValue.toString().length) / 2;

    // E.g. Value 10-99 = ceiling 100
    var ceilingPowerOfTen = Math.pow(10, maxValue.toString().length);

    var interval = floorPowerOfTen;

    if (maxValue > floorPowerOfTen) {
        if (maxValue <= halfwayToNextPowerOfTen)
            interval = ceilingPowerOfTen / 2;
        else // maxValue > halfwayToNextPowerOfTen
            interval = ceilingPowerOfTen;
    }

    interval = Math.max(interval / 10, 1);
    return interval;
}


function ChangeDateFormatLabel(datestring) {
    // #7223 - Date displayed as Nan...
    //d = new Date(datestring);
    d = new Date(datestring.replace(/-/g, '/'));
    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
}

function setChart1(data) {
    // fixed console.log not supported by IE 8 and below #7915 [Support legacy browsers ie8] by R. Javier on 7/22/2014
    if (!(typeof console === "undefined" || typeof console.log === "undefined")) {
        console.log(data);
    }
    var tmp = data.sort(sortDate);
    var showData = new Array(data.length);

    for (var t in tmp) {
        // IE 8 will have error if null
        if (!tmp[t].AnalyticsAccTranStatus)
            continue;

        var statTmp = tmp[t].AnalyticsAccTranStatus.sort(sortStatus);
        showData[t] = { value: ChangeDateFormatLabel(ChangeDateFormat(tmp[t].To)), Pending: statTmp[0].Trans, Complete: statTmp[1].Trans, Voided: statTmp[2].Trans, Reversed: statTmp[3].Trans, Error: statTmp[4].Trans };
    }

    $('#chart1').empty();
    new Morris.Bar({
        element: 'chart1',
        data: showData,
        xkey: 'value',
        ykeys: ['Pending', 'Complete', 'Voided', 'Reversed', 'Error'],
        labels: [Pending_localized, Complete_localized, Voided_localized, Reversed_localized, Error_localized],
        resize: true
    });
}


function setChart2(data) {
    var tmp = data.sort(sortDate);
    var showData = new Array(data.length);
    for (var t in tmp) {
        // IE 8 will have error if null
        if (!tmp[t].Analytic)
            continue;

        showData[t] = { value: ChangeDateFormat(tmp[t].To), Declined: tmp[t].Analytic.DeclinedTrans, Approved: tmp[t].Analytic.ApprovedTrans };
    }

    $('#chart2').empty();
    new Morris.Area({
        element: 'chart2',
        data: showData,
        xkey: 'value',
        ykeys: ['Declined', 'Approved'],
        labels: [Declined_localized, Approved_localized],
        xLabels: 'day',
        xLabelFormat: function (d) {
            return [d.getMonth() + 1] + '/' + d.getDate() + '/' + d.getFullYear();
        },
        resize: true,
        smooth: false,
        pointSize: 0,
        dateFormat: function (date) {
            d = new Date(date);
            return [d.getMonth() + 1] + '/' + d.getDate() + '/' + d.getFullYear();
        },
    });
}

function setChart3(data) {

    var cardTypes = {
        0: Unknown_localized,
        1: "Visa",
        2: "Mastercard",
        3: "American Express",
        4: "Discover",
        5: "Diners",
        6: "JCB",
        7: "GIM",
        8: "Maestro",
        9: "CUP"
    };

    var sum = 0;
    var showData = new Array(data.length);
    if (data.length > 0) {
        for (var t in data) {
            // IE 8 will have error if null
            if (!data[t].Trans)
                continue;

            sum += data[t].Trans;
        }
        for (var t in data) {
            // IE 8 will have error if null
            if (!data[t].Trans)
                continue;

            showData[t] = { value: ((data[t].Trans * 100) / sum).toFixed(1), label: cardTypes[data[t].CardType] };
        }
    }
    else {
        showData = [{ value: 0, label: "-" }];
    }

    $('#chart3').empty();
    new Morris.Donut({
        element: 'chart3',
        data: showData,
        resize: true,
        colors: ['#b88505', '#bf8505', '#c88505', '#cf8505', '#d88505', '#df8505', '#e88505', '#ef8505', '#f88505', '#ff8505'],
        formatter: function (x, data) {
            if (x == 0) {
                return '';
            }
            else return x;
        }
    });
}

function setChart4(data) {

    var transStatus = {
        1: Pending_localized,
        2: Complete_localized,
        3: Voided_localized,
        4: Reversed_localized,
        5: Error_localized
    };

    var sum = 0;
    var showData = new Array(data.length);
    for (var t in data) {
        // IE 8 will have error if null
        if (!data[t].Trans)
            continue;

        sum += data[t].Trans;
    }
    if (sum > 0) {
        for (var t in data) {
            var chartvalue = data[t].Trans == '0' ? 0 : ((data[t].Trans * 100) / sum).toFixed(1); // set as 0 so it doesn't show in the chart
            showData[t] = { value: chartvalue, label: transStatus[data[t].Status] };
        }
    }
    else {
        showData = [{ label: "-", value: 0.0 }];
    }

    $('#chart4').empty();
    new Morris.Donut({
        element: 'chart4',
        data: showData,
        resize: true,
        colors: ['#a0312a', '#b0312a', '#c0312a', '#d0312a', '#e0312a'],
        formatter: function (x, data) {
            if (x == 0) {
                return '';
            }
            else return x;
        }
    });
}

function setStatistics(data) {
    $('#numOfStaff').text(data.NumberOfStaff);
    $('#avgNumPrAcDv').text(data.AvgTransNumPerActiveDevice);
    $('#avgTranPrDv').text(data.AvgTransAmountPerDevice);
    $('#avgTranPrUr').text(data.AvgTransVolumePerUser);
    $('#emvTranP').text(data.PercentageOfEmvTrans);
    $('#msrTranP').text(data.PercentageOfMsrTrans);
    $('#actSt').text(data.ActiveStaffs);
    $('#inactSt').text(data.InactiveStaffs);
    $('#actDv').text(data.ActiveDevices);
    $('#inactDv').text(data.InActiveDevices);
    $('#actMr').text(data.ActiveMerchant);
    $('#totMr').text(data.TotalMerchant);
}
