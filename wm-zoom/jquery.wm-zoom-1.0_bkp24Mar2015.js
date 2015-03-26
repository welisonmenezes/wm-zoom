/*!
 * jquery.wm-zoom - v 1.0
 * desenvolvido por Welison Menezes
 * email : welisonmenezes@gmail.com
 * 
 *
 * Copyright 2014 Welison Menezes
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */

;(function ($) 
{
    'use strict';
    $.fn.extend({
        WMZoom: function (options) {
            /**
             *  default configurations
             */
            var defaults = {},

            /**
             *  merge default configurations with custom user configurations
             */
            options = $.extend(true, defaults, options),

            /**
             *  callbacks
             */
            callbacks = {},

            /**
             *  utility functions
             */
            util = {},

            /**
             *  funcitons plugin
             */
            funcs = { 
                lensPosition : function($el, $box, $img, $lens)
                {
                    var boxWidth    = $box.find('img').width(),
                        boxHeight   = $box.find('img').height(),
                        pOffset     = $box.parent().offset(),
                        lensWidth   = $lens.outerWidth(),
                        lensHeight  = $lens.outerHeight(),
                        halfLensW   = lensWidth/2,
                        halfLensH   = lensHeight/2;

                    var hightBox = $el.find('.wm-zoom-hight'),
                        hightImg = hightBox.find('img');

                    //var f_w = $el.find('.wm-zoom-hight').find('img').width();
                    //var d_w = f_w/boxWidth;

                    

                    $box.css({
                        'height' : $img.height()+'px',
                        'width'  : $img.width()+'px'
                    });

                    $box.mousemove(function(e)
                    {
                        var $t = $(this);

                        var xPosition = (e.pageX - pOffset.left),
                            yPosition = (e.pageY - pOffset.top);
                        
                        $lens.show();

                        var lensLeft = (xPosition-halfLensW);

                        if(lensLeft<0)
                        {
                            lensLeft = 0;
                        }
                        else if(lensLeft>(boxWidth-lensWidth))
                        {
                            lensLeft = (boxWidth-lensWidth);
                        }

                        var lensTop = (yPosition-halfLensH);
                        if(lensTop<0)
                        {
                            lensTop = 0;
                        }
                        else if(lensTop>(boxHeight-lensHeight))
                        {
                            lensTop = (boxHeight-lensHeight);
                        }

                        $lens.css({
                            'left' : lensLeft+'px',
                            'top'  : lensTop+'px'
                        });




                        var hightBoxWidth = hightBox.width(),
                            hightBoxHeight = hightBox.height(),
                            hightWidth = hightImg.width(),
                            hightHeight = hightImg.height();
                            
                        var dhWidth = (hightWidth-(hightBoxWidth/2))/(boxWidth),
                            dhHeight = (hightHeight-(hightBoxHeight/2))/boxHeight;
                            //dhWidth = dhWidth-(hightBoxWidth);

                        //console.log(dhWidth);
                        hightBox.show();
                        //console.log('lensLeft: '+lensLeft+' dW: '+Math.ceil((d_w*xPosition)));
                        var imgLeft = Math.ceil((dhWidth*lensLeft));
                        if(imgLeft>(hightWidth-(hightBoxWidth)))
                        {
                            imgLeft = (hightWidth-(hightBoxWidth));
                        }

                        var imgTop = Math.ceil((dhHeight*lensTop));
                        if(imgTop>(hightHeight-(hightBoxHeight)))
                        {
                            imgTop = (hightHeight-(hightBoxHeight));
                        }

                        //console.log('l: '+imgLeft+' b: '+(hightWidth-(hightBoxWidth/2)));
                        hightImg.css({
                            'left' : '-'+imgLeft+'px',
                            'top'  : '-'+imgTop+'px'
                        });

                    }).mouseout(function()
                    {
                        $lens.hide();
                        hightBox.hide();
                    });
                }
            };

            return this.each(function () 
            {
                var $el     = $(this),
                    $box    = $el.find('.wm-zoom-box'),
                    $img    = $box.find('img'),
                    $lens   = $el.find('.wm-zoom-lens');

                
                funcs.lensPosition($el, $box, $img, $lens);


            });
        }
    });
})(jQuery);