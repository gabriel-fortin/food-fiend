import { AddFoodAction, AppendIngredientAction, ChangeFoodNameAction, ChangeFoodVersionAction, ChangeIngredientQuantityAction, ImportDataAction, RemoveIngredientAction, ReplaceIngredientAction }
    from "./DataActions";
import { SetCurrentDayAction } from "./UncategorisedActions";
import { SetMessageAction } from "UI/ShowToasts";


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