import React from 'react';

import { ConnectedMealWidget} from 'Widget';
import Onion from 'Onion';
import { Ingredient } from 'Model';


interface MLWProps {
    mealsAndRefs: Ingredient[];
    uiEnclosure: Onion;
}
export const MealListWidget: React.FC<MLWProps> = ({mealsAndRefs, uiEnclosure=Onion.create()}) => {
    return (
        <>
        {mealsAndRefs.map((ingredient) =>
            // TODO: MealListWidget: use a better value for 'key'
                    // because 'ingredient.ref' wil not work when same food is repeated
            <ConnectedMealWidget
                    key={ingredient.key}
                    mealRef={ingredient.ref}
                    uiEnclosure={uiEnclosure.withPositionLayer(ingredient.position)}
                    />
        )}
        </>
    );
}
