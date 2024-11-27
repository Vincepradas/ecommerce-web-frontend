import { createConfirmation } from 'react-confirm';
import Confirm from './Confirmation';

// create confirm function
export const confirm = createConfirmation(Confirm);

// This is optional. But wrapping function makes it easy to use.
export function confirmWrapper(confirmation, options = {}) {
    return confirm({ confirmation, options });
}