var mainCtrl = (function () {

    /*
     *  Define object.
     */
    var self                        =   {};
        self.dom                    =   {};

    /*
     *  Function to initialise module
     */
    self.init = function () {
        self.dom = $('body, html');

        if (!self.dom.length) {
            self.available = false;
            return false;
        } else {
        	self.available = true;
        	self.buildModule();
        };
    };


    self.buildModule = function () {
    	self.initModules();
    };


    self.initModules = function () {
    	menu.init();
        leader.init();
    };

    $(document).ready(function(){
        self.init();
    });
    

    /*
     *  Return object.
     */
    return self;

})();
