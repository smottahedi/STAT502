var is_updated = false;

//-------------------------------
//Hide help menu elements and replace with PSU create ticket
//$("#topbar ul").append('<li class="ANGEL"><a href="https://cms.psu.edu/" target = "_blank">ANGEL</li>');

$('.ic-Login__body').prepend('<div class="ic-flash-warning" style="width:100%;color: #000000;">    <div class="ic-flash__icon" aria-hidden="true">      <i class="icon-warning"></i>    </div>Enter the same username and password you use in ANGEL or Webmail (ex:abc1212)</div>')


//Help Menu changes
//onElementRendered('ul#help-dialog-options', function(el,num) {
//    $('a[href="#create_ticket"]').attr('href','http://itservicedesk.psu.edu/canvassupport');
//    $(".help-dialog-pane li a span:contains('Request a Feature')").parent().attr("href","http://itservicedesk.psu.edu/canvassupport");
//  });

//Home page changes
//onPage(/^[/]{0,1}$/, function() {
onElementRendered('#right-side-wrapper', function (el, num) {
    //    $('a[href="#create_ticket"]').attr('href','http://itservicedesk.psu.edu/canvassupport');
    //
    //    $(".help-dialog-pane li a span:contains('Request a Feature')").parent().attr("href","http://itservicedesk.psu.edu/canvassupport");
    //	});

    //right nav
    onElementRendered('.coming_up', function (el, num) {

       /*  var strleftnav = '<div class="PSU_Right_nav"><h2> Request Course Spaces</h2><a class="btn button-sidebar-wide" id="PSU_course_sandbox" href = "/users/887300/external_tools/188457">Request a Course Sandbox</a><a id="PSU_Merge_course_manager" class="btn button-sidebar-wide" href = "/users/887300/external_tools/188455">Merge Course Manager</a><a id="PSU_request_master_course" class="btn button-sidebar-wide" href = "/users/887300/external_tools/194150">Request a Master or a Manually Enrolled Course</a></div>'
        $(strleftnav).appendTo('aside#right-side'); */
		
		var strleftnav = '<div class="PSU_Right_nav"><h2> Request Course Spaces</h2><a class="btn button-sidebar-wide psu-right-sidebar" id="PSU_course_sandbox" href = "/users/887300/external_tools/188457">Request a Course Sandbox</a><a id="PSU_Merge_course_manager" class="btn button-sidebar-wide psu-right-sidebar" href = "/users/887300/external_tools/188455">Merge Course Manager</a><a id="PSU_request_master_course" class="btn button-sidebar-wide psu-right-sidebar" href = "/users/887300/external_tools/194150">Request a Master or a Manually Enrolled Course</a><a class="btn button-sidebar-wide psu-right-sidebar" id="PSU_request_pride" href = "/users/887300/external_tools/194675">Request a Pride</a></div>';
		$(strleftnav).appendTo('aside#right-side')
		
		/* hasAnyRole('admin', function(hasRole) {
			if (hasRole) {
				strleftnav += '<a class="btn button-sidebar-wide psu-right-sidebar" id="PSU_request_pride" href = "/users/887300/external_tools/194730">Request a Pride</a>';
			}
		}); */

		/* strleftnav += '</div>';
		$(strleftnav).appendTo('aside#right-side') */
    });

});

//-----------------------
// Account Profile: Hide Pride, Merge, Sandbox and Manual Course links on side menu
//-----------------------
onPage(/\/profile/, function() {
    $("#section-tabs li:contains('Pride')").hide();
	$("#section-tabs li:contains('Merge Courses')").hide();
	$("#section-tabs li:contains('Sandbox')").hide();
	$("#section-tabs li:contains('Request Manual Course')").hide();
});

//add helplink to gradebook page
onPage(/\/courses\/\d+\/gradebook/, function () {
    onElementRendered('.header-buttons', function (el, num) {
        var sgradebooklink = '<div style="position: fixed;padding-left: 30px;/*! height: 38px; */line-height: 38px;/*! text-align: center; */"><img src="https://lmstools.ais.psu.edu/favicon.ico"/><a target = "_blank" href="http://canvas.psu.edu/2017/05/04/prepping-final-grades-to-pull-from-canvas-to-lionpath/">How do I import my grades into LionPath?</a></div>'
        $('.header-buttons').prepend(sgradebooklink);
    });
});

//-------------------------------
//customize tools in course
$(".collaborations").hide();
//-----------------------
//Hiding Add App Button
//-----------------------
$(document).ready(function () {
    //*new angel course tab code*/

    function get_angel_courses() {
        $.ajax({
            type: "GET",
            url: "https://" + location.hostname.toLowerCase() + "/api/lti/accounts/85746/jwt_token",
            data: {
                tool_id: 188455,
            },
            cache: false,
            dataType: "json",
            beforeSend: function () {
                $("#dashtabs-2").html('<div class="loading center loadingIndicator"></div>');
            },
            success: function (data) {
                if (typeof data.jwt_token !== undefined && data.jwt_token !== "") {
                    var tokenkey = data.jwt_token;

                    $.ajax({
                        type: "POST",
                        url: ANGELBase() + "/Canvas/UserCourseAPI.aspx",
                        data: {
                            hash: tokenkey,
                            semester: "2016/17 S1"
                        },
                        dataType: "json",
                        beforeSend: function () {
                            $("#dashtabs-2").html('<div class="loading center loadingIndicator"></div>');
                        },
                        success: function (data) {
                            var htmldata = '';
                            if (typeof data.error !== "undefined") {
                                $("#dashtabs-2").html('<h3>Unable to get ANGEL courses</h3><br/><small>' + data.error + '</small>');
                            } else {
                                $.each(data, function (index, element) {
                                    element.semester = typeof element.semester === undefined ? "" : element.semester;
                                    htmldata += '<div aria-label="' + element.title + '" style="border-bottom-color:#666;" class="ic-DashboardCard" data-order="' + element.sortnum + '"> ' +
										'<div class=""><div style="background-color:#0076b8;" class="ic-DashboardCard__header_hero"></div>' +
										'<div class="ic-DashboardCard__header_content">' +
										'<h2 title="' + element.title + '" class="ic-DashboardCard__header-title ellipsis">' +
										'<a href="' + element.url + '" class="ic-DashboardCard__link" target="_blank">' + element.title + ' </a></h2>' +
										'<p title="' + element.semester + '" class="ic-DashboardCard__header-subtitle ellipsis">' + element.semester + '</p></div>' +
										'</div>' +
										'</div>' + "\n";
                                });

                                if (htmldata == "") {
                                    htmldata = "<h3>No ANGEL courses found</h3>";
                                }
                                $("#dashtabs-2").html(htmldata);
                            }
                        },
                        error: function () {
                            $("#dashtabs-2").html("<h3>Error loading. Please try again later</h3>");
                        }
                    });
                } else {
                    $("#dashtabs-2").html("<h3>Canvas Error loading. Please try again later</h3>");
                }
            },
            error: function () {
                $("#dashtabs-2").html("<h3>Canvas Error loading. Please try again later</h3>");
            }

        });

    }

    $("div#external_tools").bind("DOMNodeInserted", function () {
        if ($("span.AddExternalToolButton").is(":visible"))
            $("span.AddExternalToolButton").hide();
    });
    //Hide PSU People links on side menu
    $("#left-side #section-tabs li:contains('PSU People')").hide();

    /*new angel course tab code*/
    if ($("#dashboard").length > 0) {
        if ($("#DashboardCard_Container").length > 0) {
            $("#DashboardCard_Container").addClass("ui-tabs-minimal");
            onElementRendered("#DashboardCard_Container div.ic-DashboardCard__box[data-reactid]", function (el, num) {
                $("#DashboardCard_Container div.ic-DashboardCard__box").before('<ul><li><a href="#dashtabs-1">Canvas</a></li><li><a href="#dashtabs-2"><img src="https://lmstools.ais.psu.edu/favicon.ico"> ANGEL</a></li></ul>');
                $("#DashboardCard_Container div.ic-DashboardCard__box").attr('id', 'dashtabs-1');
                $("#DashboardCard_Container div.ic-DashboardCard__box").after('<div class="ic-DashboardCard__box" id="dashtabs-2"></div>');
                $("#DashboardCard_Container").tabs({
                    activate: function (event, ui) {
                        //1 is the Angel tab
                        if (ui.newTab.index() === 1) {
                            get_angel_courses();
                        }
                    }
                });
            });
        }
    }
})



//-------------------------------
// course settings changes
//-------------------------------
//Add roster edit for admins and teachers.
onPage(/\/courses\/\d+\/settings/, function () {
    //remove reset course button
    onElementRendered('.reset_course_content_button', function (el, num) {
        $('.reset_course_content_button').hide();
    });
    // remove conclude course and end date
    onElementRendered('a:contains("Conclude this")', function (el, num) {
        $('a:contains("Conclude this")').hide();
    });
    //	onElementRendered('label[for="course_conclude_at"]', function (el, num) {
    //		$('label[for="course_conclude_at"]').parent().parent().hide()
    //	});
/*     onElementRendered('label[for="course_conclude_at"]', function (el, num) {
        var parent_target = $('label[for="course_conclude_at"]').parent().parent().hide();
        parent_target.after('<tr id="conclude_link"><td>&#160;</td><td> <a href="#" id="warnconcludeend"> View/Modify course end date</a></td></tr>');
        $("#warnconcludeend").click(function (e) {
            e.preventDefault();
            $('<div></div>').dialog({
                width: "40%",
                title: "Confirmation",
                open: function () {
                    var markup = '<b>WARNING</b> - Adding an end date will <b>REMOVE</b> the students from the roster on that date.  End dates should <b>NOT</b> be added in official courses.';
                    $(this).html(markup);
                },
                buttons: {
                    "Accept": {
                        text: "Accept",
                        click: function () {
                            $('label[for="course_conclude_at"]').parent().parent().show();
                            $("#conclude_link").hide();
                            $(this).dialog("close");
                        },
                        class: 'btn-danger'
                    },
                    'Cancel': function () {
                        $(this).dialog("close");
                    }
                }
            });

        });
    }); */

});


//-------------------------------

//-------------------------------
//Add roster edit for admins and teachers.
onPage(/\/courses\/\d+\/users/, function () {
    //replace people link.
    onElementRendered('a#addUsers', function (el, num) {
        $('a#addUsers').hide();
        //$('a#addUsers').attr('href','external_tools/111831');
    });

    onElementRendered('#group_categories_tabs div.roster-tab.tab-panel', function (el, num) {

        // Add PSU People on the everyone tab
        if (location.hostname) {
            //ENV.course.id //no longer exists;
            var psu_courseid = ENV.context_asset_string.replace("course_", "");
            //console.log("psu_courseid=" + psu_courseid + "  applied");
            if (location.hostname.toLowerCase() == "localhost") {
                // Localhost address
                $('.roster-tab.tab-panel').html('<iframe width=100% height= 800 frameBorder="0" src="https://' + location.hostname.toLowerCase() + '/courses/' + psu_courseid + '/external_tools/retrieve?url=https%3A%2F%2Flocalhost%3A44300%2FPsuLtiPages%2FPSURoster.aspx&borderless=1"></iframe>');
            } else if (location.hostname.toLowerCase() == "psu.test.instructure.com") {
                // dev server address
                $('.roster-tab.tab-panel').html('<iframe width=100% height= 800 frameBorder="0" src="https://' + location.hostname.toLowerCase() + '/courses/' + psu_courseid + '/external_tools/retrieve?url=https%3A%2F%2Flmstoolsdev.ais.psu.edu%2FPsuLtiPages%2FPSURoster.aspx&borderless=1"></iframe>');
            } else if (location.hostname.toLowerCase() == "psu.beta.instructure.com") {
                //production server address
                $('.roster-tab.tab-panel').html('<iframe width=100% height= 800 frameBorder="0" src="https://' + location.hostname.toLowerCase() + '/courses/' + psu_courseid + '/external_tools/retrieve?url=https%3a%2F%2flmstoolsaccept.ais.psu.edu%2FPsuLtiPages%2FPSURoster.aspx&borderless=1"></iframe>');
            } else if (location.hostname.toLowerCase() == "psu.instructure.com") {
                //production server address
                $('.roster-tab.tab-panel').html('<iframe width=100% height= 800 frameBorder="0" src="https://' + location.hostname.toLowerCase() + '/courses/' + psu_courseid + '/external_tools/retrieve?url=https%3a%2F%2flmstools.ais.psu.edu%2FPsuLtiPages%2FPSURoster.aspx&borderless=1"></iframe>');
            }
        }
    });


    onElementRendered('select[name="enrollment_role_id"]', function (el, num) {

        hasAnyRole('admin', function (hasRole) {
            if (hasRole || isRoleNewUI("TeacherEnrollment")) {
                //add button
                $('<a href="external_tools/126254" class="btn btn-primary pull-right icon-plus" id="PSUaddUsers" role="button" title="Add People" aria-label="Add People">People</a>').insertAfter('select[name="enrollment_role_id"]');
            }
        });
    });
});
//-------------------------------
//Add Back to ANGEL link
onElementRendered(".ic-app-header__main-navigation", function (el, num) {
    $(".ic-app-header__logomark").prepend("<a class='return-to-angel menu-item__text' style='position:absolute;font-size:10px;text-align: center;pointer-events: all;'href='https://cms.psu.edu/'>Return to ANGEL<span class='screenreader-only'>Return to ANGEL</span></a>");
});

//-------------------------------
//Google analytics
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
		m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-59209286-1', 'auto');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
//-------------------------------

//-------------------------------
//Samples
/*
onPage(/\/courses\/\d+\/settings/, function() {
// do something
});
*/

/*
hasAnyRole('admin', function(hasRole) {
if (hasRole) {
// do something
} else {
// do something else
}
});
*/
/*
isUser(1, function(isRyan) {
if (isRyan) {
// do something
} else {
// so something else
}
});
*/
//-------------------------------

//-------------------------------
//Helper functions


//-------------------------------
//Check for the location of the page
function onPage(regex, fn) {
    if (location.pathname.match(regex)) fn();
}

function hasAnyRole( /*roles, cb*/) {
    var roles = [].slice.call(arguments, 0);
    var cb = roles.pop();
    for (var i = 0; i < arguments.length; i++) {
        if (ENV.current_user_roles.indexOf(arguments[i]) !== -1) {
            return cb(true);
        }
    }
    return cb(false);
}
//-------------------------------

//-------------------------------
//Check the users role in the course
function isRole(srole) {
    if (jQuery("[data-id = " + psu_courseid + "]").children().children("span.subtitle").not("span.enrollment_term").text() == "Enrolled as: " + srole) {
        return true;
    } else {
        return false;
    }
}

function isRoleNewUI(srole) {
    var canvasAPI = "https://psu.instructure.com/api/v1/courses/" + jQuery("body").attr("class").match(/\bcontext-course_(.[0-9]*)/)[1] + "/enrollments?user_id=" + ENV.current_user_id;
    var found = false;
    $.ajax({
        async: false,
        dataType: 'json',
        url: canvasAPI,
        type: 'GET',
        success: function (data) {
            for (var i in data) {
                $.each(data, function (i, item) {
                    if (item.role == srole) {
                        found = true;
                    } else { }
                });
            }
        }
    });
    return found;
}



function isUser(id, cb) {
    cb(ENV.current_user_id == id);
}
//-------------------------------


//-------------------------------
//get correct middleware
function middlewareBase() {
    var baseurl = '';
    if (location.hostname.toLowerCase() == "localhost") {
        // Localhost address
        baseurl = 'https://localhost'
    } else if (location.hostname.toLowerCase() == "psu.test.instructure.com") {
        // dev server address
        baseurl = 'https://lmstoolsdev.ais.psu.edu'
    } else if (location.hostname.toLowerCase() == "psu.beta.instructure.com") {
        //production server address
        baseurl = 'https://lmstoolsaccept.ais.psu.edu'
    } else if (location.hostname.toLowerCase() == "psu.instructure.com") {
        //production server address
        baseurl = 'https://lmstools.ais.psu.edu'
    }
    return baseurl;
}


function ANGELBase() {
    var baseurl = '';
    if (location.hostname.toLowerCase() == "localhost") {
        // Localhost address
        baseurl = 'https://localhost'
    } else if (location.hostname.toLowerCase() == "psu.test.instructure.com") {
        // dev server address
        baseurl = 'https://cmsdev1.ais.psu.edu'
    } else if (location.hostname.toLowerCase() == "psu.beta.instructure.com") {
        //production server address
        baseurl = 'https://angelshibaccept.ais.psu.edu'
    } else if (location.hostname.toLowerCase() == "psu.instructure.com") {
        //production server address
        baseurl = 'https://cms.psu.edu'
    }
    return baseurl;
}
//-------------------------------
//Determine when an element has finished loading
function onElementRendered(selector, cb, _attempts) {
    var el = $(selector);
    _attempts = ++_attempts || 1;
    if (el.length) return cb(el, _attempts);
    //  if (_attempts == 60) return;
    setTimeout(function () {
        onElementRendered(selector, cb, _attempts);
    }, 250);
}
//-------------------------------
//$('.roster-tab').html('<iframe width=100% height= 800 src="https://psu.test.instructure.com/courses/206969/external_tools/retrieve?url=https%3A%2F%2Flmstoolsdev.ais.psu.edu%2FPSURoster.aspx&borderless=1"></iframe>');
//---- Message Client -----
window.addEventListener('message',
	function (e) {
	    if (e.origin !== 'https://lmstoolsdev.ais.psu.edu' &&
			e.origin !== 'https://lmstools.ais.psu.edu') {
	        return;
	    }
	    // e.data contains url to change parent window location
	    window.location.assign(e.data);
	},
	false);
//-------------------------------
/* Chart change Grades */
onPage(/\/courses\/\d+\/grades/, function() {
    onElementRendered("div.student_assignment span.grade", function (el, num) {

	    const update_donut_millis = 450;

		setTimeout(function() {

			var updateinterval;
		    var running_total = $("div.student_assignment span.grade").text();
		    var points_info = getPointsInfo(running_total);

			function updateDonut() {
				var percent_string = $("div.student_assignment span.grade").text();
				var current_letter_grade = $.trim($("div.student_assignment span.final_letter_grade").text());
				var $ppc = $('#running_total');
				$ppc.css('background', '#E5E5E5');
				$ppc.find('.ppc-progress .ppc-progress-fill').first().css('background', '#E5E5E5');
				$ppc.data('percent', percent_string);
				$ppc.data('grade', current_letter_grade);
				fillDonut();
			}

			function fillDonut() {
				$('.progress-donut-chart').each(function() {
					var chart_colors = {
						danger: "#A21F1F",
						waring: "#824700",
						average: "#695800",
						good: "#465D17",
						success: "#175D17"
					};

					var $ppc = $(this);
					var percent_string = $ppc.data('percent');
					var points_info = getPointsInfo(percent_string);

					var percent_num = points_info.is_points_view
                        ? (points_info.current_points / points_info.total_points) * 100
                        : parseFloat(percent_string);

					var spantarget = $ppc.find(".ppc-percents span").first();
					var colorchange = "";
					var deg = (360 * percent_num / 100) > 360 ? 360 : (360 * percent_num / 100);
					var gradetext = $ppc.data('grade');
					var grade = gradetext.replace(/[^a-zA-Z]+/g, '');
					if (isNaN(percent_num)) {
						//Do nothing
					} else if (grade == "F" || (grade.length === 0 && percent_num < 60)) {
						colorchange = chart_colors.danger;
					} else if (grade == "D" || (grade.length === 0 && percent_num < 70)) {
						colorchange = chart_colors.waring;
					} else if (grade == "C" || (grade.length === 0 && percent_num < 80)) {
						colorchange = chart_colors.average;
					} else if (grade == "B" || (grade.length === 0 && percent_num < 90)) {
						colorchange = chart_colors.good;
					} else if (grade == "A" || (grade.length === 0 && percent_num > 89)) {
						colorchange = chart_colors.success;
					}
					if (grade.length > 0) {
						grade = "<br/>" + gradetext;
					}
					if (percent_num > 50) {
						$ppc.find('.ppc-progress').first().css('clip', 'rect(0, 50px, 100px, 0)');
						$ppc.find('.ppc-progress .ppc-progress-fill').first().css('clip', 'rect(0, 100px, 100px, 50px)');
						$ppc.css('background', colorchange);
					} else {
						$ppc.find('.ppc-progress').first().css('clip', 'rect(0, 100px, 100px, 50px)');
						$ppc.find('.ppc-progress .ppc-progress-fill').first().css('clip', 'rect(0, 50px, 100px, 0)');
						$ppc.find('.ppc-progress .ppc-progress-fill').first().css('background', colorchange);
					}
					spantarget.css('color', colorchange);
				    
					var grade_string = formatGradeDisplay(percent_num, points_info, 2, true);

					$ppc.find('.ppc-progress-fill').first().css('transform', 'rotate(' + deg + 'deg)');					
					$ppc.find('.ppc-percents span').first().html(grade_string + grade);
				});
			}

			function formatGradeDisplay(grade_percent_string, points_info, digits_num, is_donut) {
			    var grade_string = "N/A";
			    if (isNaN(digits_num)) {
			        digits_num = 2;
			    }
			    var grade_percent_num = parseFloat(grade_percent_string);
			    if (points_info.is_points_view && !isNaN(points_info.current_points)) {
			        grade_string = parseFloat(Math.round(points_info.current_points * 100) / 100).toFixed(digits_num);
			        if (is_donut === false) {
			            grade_string = grade_string + " / " + parseFloat(Math.round(points_info.total_points * 100) / 100).toFixed(digits_num);
			        }
			    } else if (!isNaN(grade_percent_num)) {
			        grade_string = parseFloat(Math.round(grade_percent_num * 100) / 100).toFixed(digits_num) + "%";
			    }

			    return grade_string;
			}

			function getPointsInfo(grade_string) {
			    // grade_string is like "5.6 / 10 (C)" or "15% (D)"
			    var points_regex = /^\s*([0-9\.,]+)\s*\/\s*([0-9\.,]+).*$/;
			    var points_array = points_regex.exec(grade_string);
			    var is_points_view = points_array != null && points_array.length === 3;
			    var current_points = is_points_view ? parseFloat(points_array[1].replace(",", "")) : 0; // .replace is used to remove commas from string before parsing
			    var total_points = is_points_view ? parseFloat(points_array[2].replace(",", "")) : 1;
			    return {
			        "is_points_view": is_points_view,
			        "current_points": current_points,
			        "total_points": total_points
			    }
			}

			const total_score_txt = "The total score calculates any assignment, quizzes, etc, that have not yet been submitted or graded as a zero. This is the grade provided at the end of the class to LionPATH.";
			const completed_score_txt = "The completed score does not include any assignment, quizzes, etc, that have not yet been submitted or graded.";

			var grade_checked = $('input#only_consider_graded_assignments').prop('checked') === true;
			var current_grade_percent_string = "";
			var current_letter_grade = "";
			if (grade_checked === true) {
				current_letter_grade = $.trim($("div.student_assignment span.final_letter_grade").text());
				current_grade_percent_string = $("div.student_assignment span.grade").text();
				$('input#only_consider_graded_assignments').click();
			} else {
				$('input#only_consider_graded_assignments').click(); //click to turn on current grade
				current_letter_grade = $.trim($("div.student_assignment span.final_letter_grade").text());
				current_grade_percent_string = $("div.student_assignment span.grade").text();
			}
			if (grade_checked !== $('input#only_consider_graded_assignments').prop('checked')) {
				$('input#only_consider_graded_assignments').click();
			}
			var grade_string = formatGradeDisplay(current_grade_percent_string, points_info, 2, false);

			var chartoutput =
				'<div id="running_total" class="progress-donut-chart grading" data-percent="0" style="margin: 10px auto;">' +
				'		<div class="ppc-progress">' +
				'			<div class="ppc-progress-fill"></div>' +
				'		</div>' +
				'		<div class="ppc-percents">' +
				'			<div class="pcc-percents-wrapper" style="display: table-cell;vertical-align: middle;">' +
				'				<span style="font-weight: bold;font-size: 1em;" aria-hidden="true"></span>' +
				'			</div>' +
				'		</div>' +
				'</div>';
			/*data-tooltip='{"tooltipClass":"popover popover-padded","position":"bottom"}'*/
			var chartoutput2 =
				'<div id="current_grade_chart" style="width:49%;min-width:200px;display:inline-block" data-tooltip=\'{"tooltipClass":"popover popover-padded","position":"bottom"}\' title="' + completed_score_txt + '">' +
				'	<div class="progress-donut-chart grading" aria-hidden="true" data-grade="' + current_letter_grade + '" data-percent="' + current_grade_percent_string + '"  style="margin: 10px auto;">' +
				'		<div class="ppc-progress">' +
				'			<div class="ppc-progress-fill"></div>' +
				'		</div>' +
				'		<div class="ppc-percents">' +
				'			<div class="pcc-percents-wrapper" style="display: table-cell;vertical-align: middle;">' +
				'				<span style="font-weight: bold;font-size: 1em;" aria-hidden="true"></span>' +
				'			</div>' +
				'		</div>' +
				'	</div>' +				
				'	<div id="current_grade_cont" tabindex="0">' +
                '       <span class="current_grade" style="font-size: 1.2em;">Completed: ' + grade_string + ' ' + current_letter_grade +
                '           <span class="screenreader-only"> ' + completed_score_txt + '</span>' +
                '       </span>' +
				'	</div>' +
				'</div><p></p>';            

			$('#only_consider_graded_assignments_wrapper').hide();
			$(chartoutput2).insertAfter($("#student-grades-right-content div.student_assignment").first());
			$("#student-grades-right-content div.student_assignment").first().attr("tabindex", "0");
			if ($("#extra_total_grade_txt").length === 0) {
				$("#student-grades-right-content div.student_assignment").first().append(' <span id="extra_total_grade_txt" class="screenreader-only"> ' + total_score_txt + '</span>');
			}
			$("#student-grades-right-content div.student_assignment").first().wrap('<div style="width:49%;min-width:200px;display:inline-block" data-tooltip=\'{"tooltipClass":"popover popover-padded","position":"bottom"}\' title="' + total_score_txt + '">');

			$(chartoutput).insertBefore($("#student-grades-right-content div.student_assignment").first());
			/*Binding functions */
			$("#grades_summary").delegate(".revert_score_link", "click", function() {
				if ($("#revert-all-to-actual-score").is(":hidden")) {
					$("#current_grade_chart").css('opacity', 1);
				}
				clearTimeout(updateinterval);
				updateinterval = setTimeout(updateDonut, update_donut_millis);
			});
			$("#revert-all-to-actual-score").click(function() {
				$("#current_grade_chart").css('opacity', 1);
				clearTimeout(updateinterval);
				updateinterval = setTimeout(updateDonut, update_donut_millis);
			});
			$("#only_consider_graded_assignments").click(function() {
				clearTimeout(updateinterval);
				updateinterval = setTimeout(updateDonut, update_donut_millis);
			});

			$("#grades_summary .student_assignment").bind("score_change", function() {
				$("#current_grade_chart").css('opacity', 0.5);
				clearTimeout(updateinterval);
				updateinterval = setTimeout(updateDonut, update_donut_millis);
			});

			$("#student-grades-right-content").addClass("text-center");
			$("button.show_guess_grades_link").hide();
			$("#student-grades-whatif").hide();

			updateDonut(); //render donut
		}, update_donut_millis);
	});
});

//Course Search: Expand iframe to fill full window width
onPage(/\/accounts\/\d+\/external_tools/, function() {
	if($('#tool_form').attr('data-tool-id') === 'course_search') {
		$('.ic-Layout-wrapper').css('max-width', 'none');
	}
});

//-------------------------------
// Dashboard Card Sorter
// https://community.canvaslms.com/docs/DOC-8328-sorting-dashboard-course-cards
//-------------------------------
(function() {
  if (window.location.pathname !== '/') {
    return;
  }
  var scope = '/dashboard/order';
  var namespace = 'canvancement';
  var cardOrder;
  var hasLoaded = false;

  try {
    loadCardOrder();
    checkCards();
  } catch (e) {
    console.log(e);
  }

  function makeSortable() {
    hasLoaded = true;
    if (typeof cardOrder !== 'undefined' && cardOrder.length > 0) {
      sortCards();
    }
    var box = document.querySelector('div#DashboardCard_Container > div.ic-DashboardCard__box');
    var cards = box.childNodes;
    if (cards.length < 2) {
      return;
    }
    $('div.ic-DashboardCard__box').sortable({
      'containment' : 'parent',
      'items' : '> div',
      'update' : saveCardOrder
    });
    return;
  }

  function checkCards() {
    var el = document.querySelector('div#DashboardCard_Container > div.ic-DashboardCard__box a.ic-DashboardCard__link');
    if (el) {
      makeSortable();
    } else {
      var src = document.querySelector('div#DashboardCard_Container');
      var observer = new MutationObserver(function(mutations) {
        observer.disconnect();
        makeSortable();
      });
      var config = {
        childList : true,
      };
      observer.observe(src, config);
    }
  }

  function getCardOrder() {
    var order = [];
    var links = document.querySelectorAll('div#DashboardCard_Container > div.ic-DashboardCard__box a.ic-DashboardCard__link');
    if (links.length === 0) {
      return;
    }
    var courseRegex = new RegExp('/courses/([0-9]+)$');
    for (var i = 0; i < links.length; i++) {
      var matches = courseRegex.exec(links[i].href);
      if (matches) {
        order.push(matches[1]);
      }
    }
    return order;
  }

  function sortCards() {
    var box = document.querySelector('div#DashboardCard_Container > div.ic-DashboardCard__box');
    var cards = box.childNodes;
    if (cards.length < 2) {
      deleteCardOrder();
      return;
    }
    var order = getCardOrder();
    // New cards
    var pos = 0;
    var needsUpdated = false;
    var j;
    var k;
    var id;
    var el;
    for (k = 0; k < order.length; k++) {
      id = cardOrder[k];
      j = cardOrder.indexOf(id);
      if (j === -1) {
        el = cards[k];
        box.insertBefore(el, cards[pos]);
        order.splice(k, 1);
        order.splice(pos, 0, id);
        pos++;
      }
    }
    // Existing cards
    for (j = 0; j < cardOrder.length; j++) {
      id = cardOrder[j];
      k = order.indexOf(id);
      if (k === -1) {
        needsUpdated = true;
        continue;
      }
      if (k === pos) {
        pos++;
        continue;
      }
      el = cards[k];
      box.insertBefore(el, cards[pos]);
      order.splice(k, 1);
      order.splice(pos, 0, id);
      pos++;
    }
    if (needsUpdated) {
      saveCardOrder();
    }
    return;
  }

  function saveCardOrder(event, ui) {
    var currentOrder = getCardOrder();
    var url = '/api/v1/users/self/custom_data' + scope;
    var parms = {
      'ns' : namespace,
      'data' : currentOrder.join(',')
    };
    $.ajax({
      'url' : url,
      'type' : 'PUT',
      'data' : parms
    });
  }

  function loadCardOrder() {
    var url = '/api/v1/users/self/custom_data' + scope;
    var parms = {
      'ns' : namespace
    };
    $.getJSON(url, parms, function(data) {
      cardOrder = data.data.split(',');
      if (hasLoaded) {
        sortCards();
      }
    });
    return;
  }

  function deleteCardOrder() {
    var url = '/api/v1/users/self/custom_data' + scope;
    var parms = {
      'ns' : namespace
    };
    $.ajax({
      'url' : url,
      'type' : 'DELETE',
      'data' : parms
    });
    cardOrder = undefined;
    return;
  }

})();


