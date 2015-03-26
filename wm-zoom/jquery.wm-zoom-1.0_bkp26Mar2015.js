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
            var defaults = {
                config : {
                    stageW : 500,
                    stageH : 400
                }
            },

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
                lensPosition : function($el, $box, $img, $lens, $hightBox, $loader)
                {   
                    // get dimensions to div box default image and offset element
                    var boxWidth    = $img.width(),
                        boxHeight   = $img.height(),
                        pOffset     = $el.offset();

                        

                    

                    // size div to default image
                    $box.css({
                        'height' : $img.height()+'px',
                        'width'  : $img.width()+'px'
                    });

                    // size div to hight image
                    $hightBox.css({
                        'height' : options.config.stageH+'px',
                        'width'  : options.config.stageW+'px'
                    });

                    // ajax status
                    var wmAjaxInit = false,
                        wmAjaxEnd = false;

                    $box.mouseenter(function(e)
                    {

                        // show lens and box hight image
                        $lens.stop().fadeIn(300);
                        $hightBox.stop().fadeIn(300);

                        //console.log($loader.width());
                        var loaderW = $loader.width(),
                            loaderH = $loader.height(),
                            halfLoaderW = (options.config.stageW/2)-(loaderW/2),
                            halfLoaderH = (options.config.stageH/2)-(loaderH/2)

                        $loader.css({
                            'top' : halfLoaderH+'px',
                            'left' : halfLoaderW+'px'
                        });

                    }).mousemove(function(e)
                    {
                        var $t = $(this);
                        var $hightImg = $hightBox.find('img.wm-zoom-hight-img');

                        //console.log($(this).parent().find('.wm-zoom-hight'));
                        //console.log($hightBox);

                        // if not isset image then get image
                        if($hightImg.length < 1)
                        {
                            //console.log('entra');
                            //var url = 'http://www.wmtutoriais.com.br/teste/img/big-image.jpg';
                            //var url = 'assets/img/big-image.jpg';
                            var url = $img.attr('data-hight-src'); 

                            //console.log(url);

                            // if not isset ajax request then init one
                            if(wmAjaxInit==false){

                                wmAjaxInit = true;
                                wmAjaxEnd = false;
                                var i = new Image();

                                // get image
                                $(i).addClass('wm-zoom-hight-img').attr('src', url)
                                .load(function() {  
                                    $hightImg.remove();
                                    $hightBox.append(i); 
                                    wmAjaxEnd = true;
                                });
                            }
                        }
                        else
                        {
                            wmAjaxInit = true;
                            wmAjaxEnd = true;
                        }

                        // to continue ajax statuses must be true 
                        if(wmAjaxEnd!=true && wmAjaxInit!=true) return false;

                        // get dimensions box hight image and hight image
                        var hightBoxWidth = $hightBox.width(),
                            hightBoxHeight = $hightBox.height(),
                            hightImgWidth = $hightImg.width(),
                            hightImgHeight = $hightImg.height();

                        // get dinamic dimensions lens
                        var lensWidth =  (options.config.stageW*boxWidth) / hightImgWidth,
                            lensHeight =  (options.config.stageH*boxHeight) / hightImgHeight,
                            halfLensW   = lensWidth/2,
                            halfLensH   = lensHeight/2;

                        // set limits to lesn
                        if(lensHeight>boxHeight) lensHeight = boxHeight;
                        if(lensWidth>boxWidth) lensWidth = boxWidth;

                        // set dimensions lens
                        $lens.css({
                            'width' : lensWidth,
                            'height' : lensHeight
                        });

                        // get relative pointer position
                        var xPosition = (e.pageX - pOffset.left),
                            yPosition = (e.pageY - pOffset.top);
                        
                        /* -----------------------------
                         *
                         *  dinamic lens position
                         *
                         * ----------------------------*/
                        // dinamic  position left
                        var lensLeft = (xPosition-halfLensW);
                        if(lensLeft<0)
                        {
                            lensLeft = 0;
                        }
                        else if(lensLeft>(boxWidth-lensWidth))
                        {
                            lensLeft = (boxWidth-lensWidth);
                        }

                        // dinamic position top
                        var lensTop = (yPosition-halfLensH);
                        if(lensTop<0)
                        {
                            lensTop = 0;
                        }
                        else if(lensTop>(boxHeight-lensHeight))
                        {
                            lensTop = (boxHeight-lensHeight);
                        }

                        // set dinamic position
                        $lens.css({
                            'left' : lensLeft+'px',
                            'top'  : lensTop+'px'
                        });

                        /* -----------------------------
                         *
                         *  dinamic hight img position
                         *
                         * ----------------------------*/
                        // dinamic position left
                        var dWidth = (hightImgWidth-(hightBoxWidth/2))/(boxWidth-halfLensW);
                        var imgLeft = Math.ceil((dWidth*lensLeft));
                        if(imgLeft>(hightImgWidth-(hightBoxWidth)))
                        {
                            imgLeft = (hightImgWidth-(hightBoxWidth));
                        }

                        // dinamic position top
                        var dHeight = (hightImgHeight-(hightBoxHeight/2))/(boxHeight-halfLensH);
                        var imgTop = Math.ceil((dHeight*lensTop));
                        if(imgTop>(hightImgHeight-(hightBoxHeight)))
                        {
                            imgTop = (hightImgHeight-(hightBoxHeight));
                        }

                        // set dinamic position
                        $hightImg.css({
                            'left' : '-'+imgLeft+'px',
                            'top'  : '-'+imgTop+'px'
                        });

                    }).mouseleave(function()
                    {
                        $lens.stop().fadeOut(300);
                        $hightBox.stop().fadeOut(300);
                    });
                }
            };

            return this.each(function () 
            {

                //console.log($(this));

                var $el     = $(this),
                    $box    = $el.find('.wm-zoom-box'),
                    $img    = $box.find('img'),
                    $lens   = $el.find('.wm-zoom-lens'),
                    $hightBox = $el.find('.wm-zoom-hight'),
                    $loader = $hightBox.find('img.wm-zoom-loader');
                    //$hightImg = $hightBox.find('img');
                
                //funcs.lensPosition($el, $box, $img, $lens, $hightBox);
                setTimeout(function(){
                    funcs.lensPosition($el, $box, $img, $lens, $hightBox, $loader);
                },10);

                //console.log($el);

            });
        }
    });
})(jQuery);