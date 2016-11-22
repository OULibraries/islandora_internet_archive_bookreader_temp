(function ($) {

    /**
     * Toggle the visibility of a fieldset using smooth animations.
     */
    Drupal.toggleFieldset = function (fieldset) {
        var $fieldset = $(fieldset);
        if ($fieldset.is('.collapsed')) {
            var $content = $('> .fieldset-wrapper', fieldset).hide();
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
        }
        else {
            $fieldset.trigger({ type: 'collapsed', value: true });
            $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
                $fieldset
                    .addClass('collapsed')
                    .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
                fieldset.animating = false;
            });
        }
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

                // .wrapInner() does not retain bound events.
                var $link = $('<a class="fieldset-title" href="#"></a>')
                    .prepend($legend.contents())
                    .appendTo($legend)
                    .click(function () {
                        var fieldset = $fieldset.get(0);
                        // Don't animate multiple times.
                        if (!fieldset.animating) {
                            fieldset.animating = true;
                            Drupal.toggleFieldset(fieldset);
                        }
                        return false;
                    });

                $legend.append(summary);
            });
            
            var islandora_book_metadata_div = $(".islandora-book-metadata");
            if(islandora_book_metadata_div && islandora_book_metadata_div.length === 1){
                var pid = Drupal.settings.islandoraInternetArchiveBookReader.book;
                var uuid = pid.toString().trim().split(":")[1];
                if(uuid !== null && typeof(uuid) !== undefined){
//                    alert('uuid = '+uuid);//https://repository.ou.edu/uuid/0918f030-2c26-59f4-ba72-ba495545f6a7/datastream/MODS/download
                    var mods_downlink_div = $("<div id=\"mods_downlink_div\"><ul><li><a class=\"download_link\" href=\"/uuid/"+uuid+"/datastream/MODS/download"+"\" >Download MODS metadata file here</a></li></ul></div>");
                    islandora_book_metadata_div.append(mods_downlink_div);
                }
                
            }
            
        }
    };

})(jQuery);
