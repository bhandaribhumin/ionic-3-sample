import { Animation, PageTransition } from 'ionic-angular';

export class ModalScaleUpLeaveTransition extends PageTransition {

public init() {
    const ele = this.leavingView.pageRef().nativeElement;
    const wrapper = new Animation(this.plt, ele.querySelector('.modal-wrapper'));
    const contentWrapper = new Animation(this.plt, ele.querySelector('.wrapper'));

    wrapper.beforeStyles({ 'transform': 'scale(0)', 'opacity': 1 });
    wrapper.fromTo('transform', 'scale(1)', 'scale(5.0)');
    wrapper.fromTo('opacity', 1, 1);
    contentWrapper.fromTo('opacity', 1, 0);

    this
        .element(this.leavingView.pageRef())
        .duration(100)
        .easing('cubic-bezier(2, 2, 1, 1)')
        .add(contentWrapper)
        .add(wrapper);
}
}