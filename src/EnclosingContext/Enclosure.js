import PropTypes from 'prop-types';
import { LATEST } from '../Store/Store';


const REF = "REF ITEM";
const POSITION = "POSITION ITEM";

function emptyEnclosure() {
    return enclosureWith([]);
}

// helper
function enclosureWith(items) {
    const enc = {
        data: items,
    };
    enc.withFoodItem = addFoodItemToEnclosure(enc);
    enc.withPosition = addPositionToEnclosure(enc);
    enc.popItems = popEnclosureItems(enc);
    return enc;
}

// helper
function addFoodItemToEnclosure(enclosure) {
    const lastAddedElement = enclosure.data[0];

    const enclosureFoodItemAdder = function(foodId, foodVersion) {
        if (lastAddedElement && lastAddedElement.type !== POSITION) {
            console.error(`@Enclosure: @addFoodItemToEnclosure: expected last added element to be non-existing or of POSITION type`, enclosure);
        }
        const newEnclosureElement = {
            type: REF,
            id: foodId,
            ver: foodVersion,
        };
        return enclosureWith([newEnclosureElement, ...enclosure.data]);
    };

    return enclosureFoodItemAdder;
}

// helper
function addPositionToEnclosure(enclosure) {
    const lastAddedElement = enclosure.data[0];
    const enclosurePositionAdder = (position) => {
        if (lastAddedElement === undefined || lastAddedElement.type !== REF) {
            console.error(`@Enclosure: @addPositionToEnclosure: expected last added element to be of FOOD_ITEM type`, enclosure);
        }
        const newEnclosureElement = {
            type: POSITION,
            pos: position,
        };
        return enclosureWith([newEnclosureElement, ...enclosure.data]);
    };
    return enclosurePositionAdder;
}

// helper
function popEnclosureItems(enclosure) {
    const itemsPopper = (count) => {
        if (enclosure.data.length < count) {
            throw RangeError(`Cannot pop ${count} items, there are only ${enclosure.data.length}`);
        }
        const requestedItems = enclosure.data.slice(0, count);
        const remainingItems = enclosure.data.slice(count);
        return {
            items: requestedItems,
            remainingContext: enclosureWith(remainingItems)
        };
    };
    return itemsPopper;
}


/* ***** prop types ***** */

const RefItem_PropTypeDef = {
    type: PropTypes.oneOf([REF]).isRequired,
    id: PropTypes.number.isRequired,
    ver: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf([LATEST]),
    ]).isRequired,
};

const PositionItem_PropTypeDef = {
    type: PropTypes.oneOf([POSITION]).isRequired,
    pos: PropTypes.number.isRequired,
};

const EnclosingContext_PropTypeDef = PropTypes.exact({
    data: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.exact(RefItem_PropTypeDef),
            PropTypes.exact(PositionItem_PropTypeDef),
        ])
    ).isRequired,
    withFoodItem: PropTypes.func,
    withPosition: PropTypes.func,
    popItems: PropTypes.func,
});


export { EnclosingContext_PropTypeDef, emptyEnclosure };
