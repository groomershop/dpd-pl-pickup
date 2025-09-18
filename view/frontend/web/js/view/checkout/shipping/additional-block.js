define([
    'jquery',
    'uiComponent',
    'Magento_Checkout/js/model/quote',
    'ko'
], function ($, Component, quote, ko) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'DpdPoland_Dpdshippingpickup/checkout/shipping/additional-block'
        },
        initialize: function () {
            this._super();

            this.onAfterRender = this.onAfterRender.bind(this);

            ko.computed(function () {
                this.updateIframe(quote.shippingAddress());
            }, this);

            if (document.readyState === 'complete') {
                this.onAfterRender();
            } else {
                $(window).on('load', this.onAfterRender);
            }

            return this;
        },
        onAfterRender: function () {
            setTimeout(this.attachEventListeners.bind(this), 1000)
            setTimeout(this.updateIframe.bind(this), 1000)
        },
        updateIframe: function (shippingAddress) {
            if (!shippingAddress) {
                shippingAddress = quote.shippingAddress();
            }

            let countryCode = (shippingAddress && shippingAddress.countryId) ? shippingAddress.countryId : 'PL';

            let baseUrl = '//pudofinder.dpd.com.pl/widget?key=1ae3418e27627ab52bebdcc1a958fa04';
            let newSrc = baseUrl + '&query=' + countryCode + '&_=' + new Date().getTime();

            let widgetContainer = document.getElementById('dpd-widget');
            if (widgetContainer) {
                widgetContainer.innerHTML = '';
                let newIframe = document.createElement('iframe');
                newIframe.id = 'dpd-widget-iframe';
                newIframe.src = newSrc;
                newIframe.style.width = '100%';
                newIframe.style.border = 'none';
                newIframe.style.minHeight = '750px';
                widgetContainer.appendChild(newIframe);
            }
        },
        attachEventListeners: function () {
            let eventListener = window[window.addEventListener ? 'addEventListener' : 'attachEvent'];
            let messageEvent = (window.addEventListener ? 'message' : 'onmessage');
            eventListener(messageEvent, function (a) {
                if (a.data.point_id) {
                    let pointWrapper = document.getElementById('point-wrapper');
                    if (pointWrapper) {
                        pointWrapper.value = a.data.point_id;
                    }

                    const keyUpEvent = new KeyboardEvent('keyup');
                    const shippingPointIdInput = document.querySelector(
                        '[name=\'swissup_checkout_field[shipping_point_id]\']'
                    );
                    if (shippingPointIdInput !== null) {
                        shippingPointIdInput.value = a.data.point_id;
                        shippingPointIdInput.dispatchEvent(keyUpEvent);
                    }
                    
                    const shippingPointNameInput = document.querySelector(
                        '[name=\'swissup_checkout_field[shipping_point_name]\']'
                    );
                    if (shippingPointNameInput !== null) {
                        shippingPointNameInput.value = 'DPD Pickup ' + a.data.point_id;
                        shippingPointNameInput.dispatchEvent(keyUpEvent);
                    }

                }
            }, false);

            function toggleWidgetVisibility() {
                let radio = document.querySelector('input[type="radio"][value="dpdshippingpickup_dpdshippingpickup"]');
                let widgetSelect = document.getElementById('dpd-widget-select');
                let widget = document.getElementById('dpd-widget');
                if (radio && radio.checked) {
                    if (widgetSelect) {
                        widgetSelect.style.display = 'block';
                    }
                    if (widget) {
                        widget.style.display = 'block';
                    }
                } else {
                    if (widgetSelect) {
                        widgetSelect.style.display = 'none';
                    }
                    if (widget) {
                        widget.style.display = 'none';
                    }
                }
            }

            let shippingMethodLoad = document.getElementById('checkout-shipping-method-load');
            if (shippingMethodLoad) {
                shippingMethodLoad.addEventListener('click', toggleWidgetVisibility);
            }

            toggleWidgetVisibility();
        },
    });
});
