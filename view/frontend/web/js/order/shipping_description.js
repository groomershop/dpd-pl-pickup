define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote'
], function ($, wrapper, quote) {
    'use strict';

    return function (setShippingInformationAction) {

        return wrapper.wrap(setShippingInformationAction, function (originalAction) {
            var shippingAddress = quote.shippingAddress();
            if (shippingAddress['extension_attributes'] === undefined) {
                shippingAddress['extension_attributes'] = {};
            }

            if(jQuery('[id="point-wrapper"]').val() != ""){
                shippingAddress['extension_attributes']['shipping_description_dpd'] = jQuery('[id="point-wrapper"]').val();
                shippingAddress['suffix'] = "[DPD_PICKUP:"+jQuery('[id="point-wrapper"]').val()+"]";
            }else{
                shippingAddress['extension_attributes']['shipping_description_dpd'] = null;
                shippingAddress['suffix'] = null;
            }

            return originalAction();
        });
    };
});