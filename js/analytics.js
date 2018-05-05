var Analytics = {
    satelliteTrack: function(data) {
        try {
            _satellite.track(data);
        } catch (err) {
            console.log("DTM JS not found");
        }
    },
    trackCustomLinkClicks: function(linkname, linkgroup) {
        if (linkname && linkgroup) {
            USYD.Analytics.customLinkName = linkgroup + ":" + linkname;
        } else if (linkname) {
            USYD.Analytics.customLinkName = linkname;
        }
        this.satelliteTrack("track-custom-link-clicks");
    },
    getParameterByName: function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    getcookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    trackContactInformation: function(clickType, clickedCaption, userRole, userName) {
        USYD.Analytics.contact = {};
        if (userRole) {
            USYD.Analytics.contact.userRole = userRole.trim();
        } else if (userName) {
            USYD.Analytics.contact.userRole = userName.trim();
        }
        if (clickType) {
            USYD.Analytics.contact.userClickedType = clickType.trim();
        }
        if (clickedCaption) {
            USYD.Analytics.contact.clickedCaption = clickedCaption.trim();
        }
        this.satelliteTrack("contact-user-clicked");
    }
};

$(document).ready(function() {
    //Download tracking
    $('.js-analytics-download-file').on("click", function() {
        var fileLink = $(this).attr('href');
        var fileName = "";
        if (fileLink) {
            var filePaths = fileLink.split('/');
            fileName = filePaths[filePaths.length - 1];
        }
        USYD.Analytics.downloadedFileName = fileName;
        Analytics.satelliteTrack("track-download-file");
    });
    //For tracking form submission
    $('.js-analytics-form-track').closest('form').submit(function(event) {
        //DTM direct rule function for tracking form submission
        USYD.Analytics.formSubmissionName = $(this).attr('id');
        Analytics.satelliteTrack("form-submitted");
    });

    //for tracking contact information
    //Email Click
    $('.js-analytics-contact-email').on("click", function() {
        var clickedCaption = $(this).text();
        var role = $(this).closest('.js-analytics-contact-module').find(".js-analytics-contact-role").text();
        var name = $(this).closest('.js-analytics-contact-module').find(".js-analytics-contact-name").text();
        Analytics.trackContactInformation("email", clickedCaption, role, name);
    });
    //Phone Click
    $('.js-analytics-contact-phone-number').on("click", function() {
        var clickedCaption = $(this).text();
        var role = $(this).closest('.js-analytics-contact-module').find(".js-analytics-contact-role").text();
        var name = $(this).closest('.js-analytics-contact-module').find(".js-analytics-contact-name").text();
        Analytics.trackContactInformation("phone", clickedCaption, role, name);
    });
    //Mobile Click
    $('.js-analytics-contact-mobile-number').on("click", function() {
        var clickedCaption = $(this).text();
        var role = $(this).closest('.js-analytics-contact-module').find(".js-analytics-contact-role").text();
        var name = $(this).closest('.js-analytics-contact-module').find(".js-analytics-contact-name").text();
        Analytics.trackContactInformation("mobile", clickedCaption, role, name);
    });

    //for tracking accordian wide component
    $(".js-analytics-accordian-wide-button").on("click", function() {
        if ($(this).hasClass('collapsed')) {
            Analytics.trackCustomLinkClicks($(this).attr('title'), "accordian-wide");
        }
    });

    //for tracking search result item click
    $('.js-analytics-link-list-link').on("click", function() {
        var linkName = $(this).text();
        var linkGroupName = $(this).closest('.js-analytics-link-list-article').find(".js-analytics-link-list-heading").text().trim();
        Analytics.trackCustomLinkClicks(linkName, linkGroupName);
    });

    //for tracking search result item click
    $('.searchResultItems a').on("click", function() {
        Analytics.satelliteTrack("search-result-clickthrough");
    });

    //for fetching number of results on search page
    var results = $('.searchResultsFiltersModule .results').html();
    if (results) {
        USYD.Analytics.onsiteSearchResults = results.replace(/,/g, '');
    } else {
        USYD.Analytics.onsiteSearchResults = 0;
    }
});

//Handling of Content Navigation Section, Subsection
(function() {
    cookieVal = Analytics.getcookie('navigation');
    if (cookieVal) {
        var jsonObj = $.parseJSON(decodeURIComponent(cookieVal));
        if (jsonObj.navigationPage && jsonObj.navigationPage == window.location.pathname) {
            if (jsonObj.category) {
                USYD.Analytics.section = jsonObj.category;

            }
            if (jsonObj.topic) {
                USYD.Analytics.subSection = jsonObj.topic;
            }
        }
    }
})();
