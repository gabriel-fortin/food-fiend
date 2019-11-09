

BASIC food (as saved in food library):
 - id
 - name
 - FPC (per 100g)
 - unit = "g" (for quantity display only)
 
 - portion size = 1g (for uniformity with other kinds of food)
 - portions = 1 (for uniformity with other kinds of food)

 - ingredients = [] (for uniformity with other kinds of food)
 - used by (to update food/meals depending on this as ingredient) (?)

 - version (for future optimisation, allows to keep immutability of foods)
 - extra (any other info)



COMPOSITE food (as saved in food library):
 - id
 - name
 - FPC (per 100g)
 - unit = "piece(s)" (for quantity display only)

 - portion size (in grams)
 - portions (how many portions from the ingredients used)

 - ingredients
     + id, name, FPC, unit, portion size, portions, ingredients, used by, extra
     + version
     + note/extra
 - used by (to update food/meals depending on this as ingredient) (?)

 - version (for future optimisation; allows to keep immutability of foods; allows updates if original changes)
 - extra (any other info)



actual_quantity  =  user_set_q * portion_size

actual_FPC  =  user_set_q * portion_size / 100g  =  actual_quantity / 100g

