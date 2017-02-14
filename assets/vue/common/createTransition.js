export default function (duration = 500) {
    return {
        css: false,

        enter (el, done){
            done();
        },

        enterCancelled (el, done) {
            if(this.transitionTimer != null){
                clearTimeout(this.transitionTimer);
                this.transitionTimer = null;
            }
        },

        leave (el, done) {
            this.transitionTimer = setTimeout(() => done(), duration);
        },

        leaveCancelled (el, done) {
            if(this.transitionTimer != null){
                clearTimeout(this.transitionTimer);
                this.transitionTimer = null;
            }
        }
    };
};