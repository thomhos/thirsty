var leader = (function () {

    /*
     *  Define object.
     */
    var self                        =   {};
        self.dom                    =   {};
        self.targetGroups 			= 	['studenten', 'barmannen', 'hipsters', 'barvrouwen', 'koorlui', 'jongens', 'ondernemers', 'meisjes', 'hockey-meisjes', 'de jeugd', 'jullie'];

    /*
     *  Function to initialise module
     */
    self.init = function () {
        self.dom = $('.js-leader');

        if (!self.dom.length) {
            self.available = false;
            return false;
        } else {
            self.available = true;
            self.buildModule();    
        };
    };


    self.buildModule = function () {
        self.setTargetGroupRotation();

        self.setTriggers();
    };

    self.setTriggers = function () {
        self.dom.find('.js-leader-cta').off('click').on('click', function(e){
            e.preventDefault();

            var target  = $(this).attr('href');
            var top     = $(target).offset().top-40;

            $('body').animate({
                scrollTop: top
            });
        });
    }

    self.setTargetGroupRotation = function () {
    	var leaderRotation 		= 	setInterval(setNewTargetGroup, 2500);
    	var targetGroup 		= 	0;

    	function setNewTargetGroup () {
    		var label = $('.js-target-groups');

    		label.fadeOut(200, function () {
    			label.html(self.targetGroups[targetGroup]);
    		}).fadeIn(200);

    		if(targetGroup < self.targetGroups.length-1) {
    			targetGroup++;
    		} else {
    			targetGroup = 0;
    		};
    	};
    };


    /*
     *  Return object.
     */
    return self;

})();
