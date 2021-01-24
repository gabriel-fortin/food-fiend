import { AddFoodAction, AppendIngredientAction, ChangeFoodNameAction, ChangeFoodVersionAction, ChangeIngredientQuantityAction, ImportDataAction, RemoveIngredientAction, ReplaceIngredientAction }
    from "./DataActions";
import { SetRootRefAction } from "./UncategorisedActions";
import { SetMessageAction } from "UI/ShowToasts";


export type Action =
| ImportDataAction
| ChangeIngredientQuantityAction
| AddFoodAction
| ReplaceIngredientAction
| SetRootRefAction
| AppendIngredientAction
| RemoveIngredientAction
| ChangeFoodNameAction
| ChangeFoodVersionAction
| SetMessageAction
;