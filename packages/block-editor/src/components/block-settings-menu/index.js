/**
 * WordPress dependencies
 */
import { ToolbarGroup, ToolbarItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockSettingsDropdown from './block-settings-dropdown';

export function BlockSettingsMenu( { clientIds, clientId, ...props } ) {
	return (
		<ToolbarGroup>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<BlockSettingsDropdown
						clientId={ clientId }
						clientIds={ clientIds }
						toggleProps={ toggleProps }
						{ ...props }
					/>
				) }
			</ToolbarItem>
		</ToolbarGroup>
	);
}

export default BlockSettingsMenu;
