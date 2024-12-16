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
                shippingAddress['extension_attributes']['shipping_dpd_pickup'] = jQuery('[id="point-wrapper"]').val();
                shippingAddress['suffix'] = "[DPD_PICKUP:"+jQuery('[id="point-wrapper"]').val()+"]";
                
                const shippingPointIdInput = jQuery(
                    '[name="swissup_checkout_field[shipping_point_id]"]'
                );
                if (shippingPointIdInput !== null) {
                    shippingPointIdInput.val( jQuery('[id="point-wrapper"]').val() );
                }
            }else{
                shippingAddress['extension_attributes']['shipping_dpd_pickup'] = null;
                shippingAddress['suffix'] = null;
            }
            
            return originalAction();
        });
    };
});
