/* vertical centering function */
jQuery.fn.center = function() {
    this.css("position", "absolute");
    var newTop = (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop();
    newTop = newTop - 50;
    this.css("top", newTop + "px");
    return this;
};


function showLoadingAndDisable() {
    $("#formLoading").show();
    $("#formLoading").center();
}

function hideLoading() {
    $("#formLoading").hide();
}

$(document).ready(function () {
    $("input#submit").click(function () {
        showLoadingAndDisable();
    });
    
    if ($("select[name=group_search_type]").length > 0) {
        changeSearchGroup();
        $("select[name=group_search_type]").change(function () {
            changeSearchGroup();
        });
    }
    if ($("select[id=grouptypeDropdown]").length > 0) {
        changeGroup();
        $("select[id=grouptypeDropdown]").change(function () {
            changeGroup();
        });
    }
});

/* generate random aplhanumeric */

function generateRandomAlphaNumeric(length) {
    var alphaNumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var randomString = "";
    for (var i = 0; i < length; i++) {
        var rndm = Math.floor(Math.random() * alphaNumeric.length);
        randomString += alphaNumeric.substring(rndm, rndm + 1);
    }
    return randomString;
}

function validateMerchantForm() {
    hideLoading();
    if ($("input[id=MerchantDetail_swiff_mid]").val().length > 0) {
        var mid = $("input[id=MerchantDetail_swiff_mid]").val();
        var regex = new RegExp("^[A-Z0-9]+$");
        if (!regex.test(mid)) {
            alert("Swiff MID can only contain Capital letter and number");
            return false;
        }
        if (mid.length >= 10) {
            alert("Swiff MID is too long");
            return false;
        }
        if (mid.substr(0, 4) == "TEST") {
            alert("Swiff MID cannot start with TEST");
            return false;
        }
    }
    
    var msg = "";

//	if($.trim($("input[name=merchant_default_currency]").val()).length == 0)
//		msg += "Default Currency\n";

    if ($.trim($("input[id=MerchantDetail_merchant_name]").val()).length == 0)
        msg += "Merchant Name\n";

    if ($.trim($("input[id=MerchantDetail_email_from]").val()).length == 0)
        msg += "Email From\n";

    if ($.trim($("input[id=MerchantDetail_contact_email]").val()).length == 0) 
        msg += "Contact Email\n";

    if ($.trim($("input[id=MerchantDetail_email_template_subject]").val()).length == 0)
        msg += "Email Subject\n";

    if ($.trim($("textarea[id=MerchantDetail_email_template_body]").val()).length == 0) {
        msg += "Template Body";
    }

    

    if (msg != "") {
        msg = "Please fill in the following field(s): \n\n" + msg;
        alert(msg);

        return false;
    }

//    showLoadingAndDisable();
    return true;
}

function changeSearchGroup() {
    if ($("select[name=group_search_type] option:selected").val() == "4") {
        $("select[name=merchant_id]").show();
        $("select[name=reseller_id]").hide();
    } else if ($("select[name=group_search_type] option:selected").val() == "3") {
        $("select[name=merchant_id]").hide();
        $("select[name=reseller_id]").show();
    } else {
        $("select[name=merchant_id]").hide();
        $("select[name=reseller_id]").hide();
    }
}

function changeGroup() {
    if ($("select[id=grouptypeDropdown] option:selected").val() == "4") { // Merchant Group
        $("select[id=Account_merchant_id]").hide();
        $("select[id=Account_merchant_group_id]").show();
        $("select[id=Account_reseller_id]").hide();
        $("select[id=adminRoletypeDropdown]").hide();
        $("select[id=resellerRoletypeDropdown]").hide();
        $("select[id=merchantRoletypeDropdown]").hide();
        $("select[id=merchantGroupRoletypeDropdown]").show();
    } else if ($("select[id=grouptypeDropdown] option:selected").val() == "3") { // Merchant
        $("select[id=Account_merchant_id]").show();
        $("select[id=Account_merchant_group_id]").hide();
        $("select[id=Account_reseller_id]").hide();
        $("select[id=adminRoletypeDropdown]").hide();
        $("select[id=resellerRoletypeDropdown]").hide();
        $("select[id=merchantRoletypeDropdown]").show();
        $("select[id=merchantGroupRoletypeDropdown]").hide();
    } else if ($("select[id=grouptypeDropdown] option:selected").val() == "2") { // Reseller
        $("select[id=Account_merchant_id]").hide();
        $("select[id=Account_merchant_group_id]").hide();
        $("select[id=Account_reseller_id]").show();
        $("select[id=adminRoletypeDropdown]").hide();
        $("select[id=resellerRoletypeDropdown]").show();
        $("select[id=merchantRoletypeDropdown]").hide();
        $("select[id=merchantGroupRoletypeDropdown]").hide();
    } else { // Admin
        $("select[id=Account_merchant_id]").hide();
        $("select[id=Account_merchant_group_id]").hide();
        $("select[id=Account_reseller_id]").hide();
        $("select[id=adminRoletypeDropdown]").show();
        $("select[id=resellerRoletypeDropdown]").hide();
        $("select[id=merchantRoletypeDropdown]").hide();
        $("select[id=merchantGroupRoletypeDropdown]").hide();
    }
}