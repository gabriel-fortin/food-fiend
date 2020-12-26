import { AddFoodAction, AppendIngredientAction, ChangeFoodNameAction, ChangeFoodVersionAction, ChangeIngredientQuantityAction, ImportDataAction, RemoveIngredientAction, ReplaceIngredientAction }
    from "./DataActions";
import { SetCurrentDayAction, SetMessageAction } from "./UncategorisedActions";


export type Action =
| ImportDataAction
| ChangeIngredientQuantityAction
| AddFoodAction
| ReplaceIngredientAction
| SetCurrentDayAction
| AppendIngredientAction
| RemoveIngredientAction
| ChangeFoodNameAction
| ChangeFoodVersionAction
| SetMessageAction
;