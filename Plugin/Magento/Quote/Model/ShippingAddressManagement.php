<?php


namespace DpdPoland\Dpdshippingpickup\Plugin\Magento\Quote\Model;

class ShippingAddressManagement
{
    
    protected $logger;

    public function __construct(\Psr\Log\LoggerInterface $logger
    ) {
        $this->logger = $logger;
    }

    public function beforeAssign(
        \Magento\Quote\Model\ShippingAddressManagement $subject,
        $cartId,
        \Magento\Quote\Api\Data\AddressInterface $address
    ) {
        $extAttributes = $address->getExtensionAttributes();
        if (!empty($extAttributes) && !empty($extAttributes->getShippingDescriptionDpd())) {
            $address["suffix"] = "[DPD_PICKUP:".$extAttributes->getShippingDescriptionDpd()."]";
        }
    }
}