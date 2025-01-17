/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCheckoutAddress, useStoreEvents } from '@woocommerce/base-context';
import { getSetting } from '@woocommerce/settings';
import {
	CheckboxControl,
	ValidatedTextInput,
} from '@woocommerce/blocks-checkout';
import { useDispatch, useSelect } from '@wordpress/data';
import { CHECKOUT_STORE_KEY } from '@woocommerce/block-data';
import { isEmail } from '@wordpress/url';

/**
 * Internal dependencies
 */

const Block = ( {
	allowCreateAccount,
}: {
	allowCreateAccount: boolean;
} ): JSX.Element => {
	const { customerId, shouldCreateAccount } = useSelect( ( select ) => {
		const store = select( CHECKOUT_STORE_KEY );
		return {
			customerId: store.getCustomerId(),
			shouldCreateAccount: store.getShouldCreateAccount(),
		};
	} );

	const { __internalSetShouldCreateAccount } =
		useDispatch( CHECKOUT_STORE_KEY );
	const { billingAddress, setEmail } = useCheckoutAddress();
	const { dispatchCheckoutEvent } = useStoreEvents();

	const onChangeEmail = ( value: string ) => {
		setEmail( value );
		dispatchCheckoutEvent( 'set-email-address' );
	};

	const createAccountUI = ! customerId &&
		allowCreateAccount &&
		getSetting( 'checkoutAllowsGuest', false ) &&
		getSetting( 'checkoutAllowsSignup', false ) && (
			<CheckboxControl
				className="wc-block-checkout__create-account"
				label={ __(
					'Create an account?',
					'woo-gutenberg-products-block'
				) }
				checked={ shouldCreateAccount }
				onChange={ ( value ) =>
					__internalSetShouldCreateAccount( value )
				}
			/>
		);

	return (
		<>
			<ValidatedTextInput
				id="email"
				type="email"
				autoComplete="email"
				label={ __( 'Email address', 'woo-gutenberg-products-block' ) }
				value={ billingAddress.email }
				required={ true }
				onChange={ onChangeEmail }
				requiredMessage={ __(
					'Please provide a valid email address',
					'woo-gutenberg-products-block'
				) }
				customValidation={ ( inputObject: HTMLInputElement ) => {
					if ( ! isEmail( inputObject.value ) ) {
						inputObject.setCustomValidity(
							__(
								'Please provide a valid email address',
								'woo-gutenberg-products-block'
							)
						);
						return false;
					}
					return true;
				} }
			/>
			{ createAccountUI }
		</>
	);
};

export default Block;
