import PropTypes from 'prop-types';
import { LATEST } from '../Store/Store';


const REF = "REF ITEM";
const POSITION = "POSITION ITEM";

function emptyEnclosure() {
    return enclosureWith([]);
}

// helper
function enclosureWith(data) {
    const enc = {
        data,
    };
    enc.withFoodItem = addFoodItemToEnclosure(enc);
    enc.withPosition = addPositionToEnclosure(enc);
    enc.items = getEnclosureItems(enc);
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
            version: foodVersion,
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
            position,
        };
        return enclosureWith([newEnclosureElement, ...enclosure.data]);
    };
    return enclosurePositionAdder;
}

// helper
function getEnclosureItems(enclosure) {
    const itemsGetter = () => enclosure.data;
    return itemsGetter;
}


/* ***** prop types ***** */

const RefItem_PropTypeDef = {
    type: PropTypes.oneOf([REF]).isRequired,
    id: PropTypes.number.isRequired,
    version: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf([LATEST]),
    ]).isRequired,
};

const PositionItem_PropTypeDef = {
    type: PropTypes.oneOf([POSITION]).isRequired,
    position: PropTypes.number.isRequired,
};

const EnclosingContext_PropTypeDef = PropTypes.exact({
    data: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.exact(RefItem_PropTypeDef),
            PropTypes.exact(PositionItem_PropTypeDef),
        ]),
    ),
    withFoodItem: PropTypes.func,
    withPosition: PropTypes.func,
    items: PropTypes.func,
});


export { EnclosingContext_PropTypeDef, emptyEnclosure };
