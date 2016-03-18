(function ($) {

    /**
     * Toggle the visibility of a fieldset using smooth animations.
     */
    Drupal.toggleFieldset = function (fieldset) {
        var $fieldset = $(fieldset);
//        if ($fieldset.is('.collapsed')) {
	    // Show the content of the detailes:
//          var $content = $('> .fieldset-wrapper', fieldset).hide();
	    var $content = $('> .fieldset-wrapper', fieldset);
            $fieldset
                .removeClass('collapsed')
                .trigger({ type: 'collapsed', value: false })
                .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
            $content.slideDown({
                duration: 'fast',
                easing: 'linear',
                complete: function () {
                    Drupal.collapseScrollIntoView(fieldset);
                    fieldset.animating = false;
                },
                step: function () {
                    // Scroll the fieldset into view.
                    Drupal.collapseScrollIntoView(fieldset);
                }
            });
	  // Remove the code logic that hides the content
//        }
//        else {
//            $fieldset.trigger({ type: 'collapsed', value: true });
//            $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
//                $fieldset
//                    .addClass('collapsed')
//                    .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
//                fieldset.animating = false;
//            });
//        }
    };

    /**
     * Scroll a given fieldset into view as much as possible.
     */
    Drupal.collapseScrollIntoView = function (node) {
        var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
        var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
        var posY = $(node).offset().top;
        var fudge = 55;
        if (posY + node.offsetHeight + fudge > h + offset) {
            if (node.offsetHeight > h) {
                window.scrollTo(0, posY);
            }
            else {
                window.scrollTo(0, posY + node.offsetHeight - h + fudge);
            }
        }
    };

    Drupal.behaviors.collapse = {
        attach: function (context, settings) {
            $('fieldset.collapsible', context).once('collapse', function () {
                var $fieldset = $(this);
                // Expand fieldset if there are errors inside, or if it contains an
                // element that is targeted by the URI fragment identifier.
                var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
                // Islandora adds the try catch case here.
                try {
                    if ($fieldset.find('.error' + anchor).length) {
                        $fieldset.removeClass('collapsed');
                    }
                }
                catch(err) {
                    // Ignore exception.
                }

                var summary = $('<span class="summary"></span>');
                $fieldset.
                    bind('summaryUpdated', function () {
                        var text = $.trim($fieldset.drupalGetSummary());
                        summary.html(text ? ' (' + text + ')' : '');
                    })
                    .trigger('summaryUpdated');

                // Turn the legend into a clickable link, but retain span.fieldset-legend
                // for CSS positioning.
                var $legend = $('> legend .fieldset-legend', this);

                $('<span class="fieldset-legend-prefix element-invisible"></span>')
                    .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
                    .prependTo($legend)
                    .after(' ');
		
		// remove the old text of the details div and add the new, formated text
		$legend.html('');
                var details = $('<H3>Details</H3>')
                    .prepend($legend.contents())
                    .appendTo($legend);
	
		var fieldset = $fieldset.get(0);
                Drupal.toggleFieldset(fieldset);
	
		$("[class^='dc-']dt").each(function(){
		    $(this).css('padding-right','100px');
		});
		$("[class^='dc-']dd").each(function(){
		    var textNode = $(this).first();
		    if(!textNode){
			$(this).prepend(document.createTextNode('Some text'));
		    }
		    else{
			var text = textNode.text();
			if(!text || text == '' || text == "\n                  "){
			    textNode.text('ok');			    
//$(this).prepend("<div style='visibility:hidden'><span>No information to display</span></div>");
			}
		    }
		    $(this).css('padding-right','100px');
		});
	
		$legend.append(summary);
            });
        }
    };

})(jQuery);
