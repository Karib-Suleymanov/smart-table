import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
 
    Object.keys(indexes).forEach((elementName) => {
    
        elements[elementName].append(
            ...Object.values(indexes[elementName])
                     .map(name => { 
                         
                         const option = document.createElement('option');

                         option.value = name;
                         option.textContent = name;

                         return option;
                     })
        );
     });

    return (data, state, action) => {
        if (action === 'clear') {
            const parent = action.closest('.table-column'); 
            const input = parent.querySelector('input, select'); 

            if (input) {
                input.value = '';
            }

            const fieldToClear = action.dataset.field;
            if (fieldToClear) {
                state[fieldToClear] = '';
            }
        }

        return data.filter(row => compare(row, state));
    }
}