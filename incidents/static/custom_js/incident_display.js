var refresh_displays =  false;
var auto_timer_id = false
$(function () {
	function refresh_incident_display(container) {
		return function(data) {
			container.html(data);

			container.find('.relative-date').each(function() {
      			then = moment($(this).text(), 'YYYY-MM-DD HH:mm').fromNow();
      			$(this).text(then);
    		});
		};
	}
	refresh_displays = function() {
        /*
        $(".incident_table table > thead > tr > th:first-child a").each(function(){
            refresh_display($(this), false)
        })
        */
        $(".incident_table").each(function(){
            incident_table = $(this)
            order_by = incident_table.data('order-param') || 'date';
            asc = incident_table.data('asc') || false;
            if (incident_table.hasClass('incident_display')) {
                container = incident_table;
            }
            else {
                container = incident_table.closest('.incident_display');
            }
            url = container.data('url');
            $.get(url, { 'order_by': order_by, 'asc': asc, 'q': q, 'page': page }, refresh_incident_display(container));

        })
    }
    autoRefreshCheck = function(){
        if ($(this).prop("checked")) {
            auto_timer_id = setInterval(refresh_displays,5000);
        } else if (auto_timer_id!==false){
            clearInterval(auto_timer_id);
            auto_timer_id = false;
        }
    }
    $("input.autorefresh").click(autoRefreshCheck)
    $("input.autorefresh").each(autoRefreshCheck)
    
	function refresh_display(element, alternate) {
        alternate = typeof alternate !== 'undefined' ? alternate : true;
		incident_table = element.closest('.incident_table');
		if (element.hasClass('incident_display')) {
			container = element;
		}
		else {
			container = element.closest('.incident_display');
		}

		order_by = incident_table.data('order-param') || 'date';
		asc = incident_table.data('asc') || false;

		field = element.data('sort');
		if (field) {
			if (field == order_by) {
				asc = !asc;
			}
			else {
				order_by = field;
			}
		}
		
		if (!alternate) {
			asc = !asc;            
		}

		url = container.data('url');
		q = container.data('query');

		page = element.data('page') || 1;
        $.get(url, { 'order_by': order_by, 'asc': asc, 'q': q, 'page': page }, refresh_incident_display(container));
	}

	function toggle_star(link) {
		return function(data) {
			i = link.find('i.star');
    		i.toggleClass('glyphicon-star');
    		i.toggleClass('glyphicon-star-empty');

    		starred_incidents = $('#starred_incidents');
			if (starred_incidents.length > 0) {
				refresh_display(starred_incidents);
			}
		}
	}

	// Make sure each 'incident_display' comes to life
	$('.incident_display').each(function (index) {
		refresh_display($(this));
	});

	// Change sort when clicking on a column title
	$('.incident_display').on('click', 'thead a', function (event) {
		refresh_display($(this));

		event.preventDefault();
	});

	// Change page when clicking on a pagination link
	$('.incident_display').on('click', 'a.paginate', function(event) {
		refresh_display($(this));

		event.preventDefault();
	});

	// Star/Unstar incidents
	$('.incident_display').on('click', 'a.star', function(event) {
		link = $(this);
		url = link.attr('href');
		$.getJSON(url, toggle_star(link));

		event.preventDefault();
	});

});
