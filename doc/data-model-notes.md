

BASIC food (as saved in food library):
 - id
 - name
 - FPC (per 100g)
 - unit = "g" (for quantity display only)
 
 - portion size = 1g (for uniformity with other kinds of food)
 - portions = 1 (for uniformity with other kinds of food)

 - components = [] (for uniformity with other kinds of food)
 - used by (to update food/meals depending on this as ingredient) (for optimisation?)
     + id
     + version

 - version (for future optimisation, allows to keep immutability of entries)
 - extra (any other info)



COMPOSITE food (as saved in food library):
 - id
 - name
 - FPC (per 100g)
 - unit = "piece(s)" (for quantity display only)

 - portion size (in grams)
 - number of portions (how many portions out of the ingredients used)

 - components (the constituents of a meal)
     + version, id, quantity (measured in the ingredient's portions)
     + note/extra
 - used by (to update food/meals depending on this as ingredient) (for optimisation?)
     + id
     + version

 - version (for future optimisation; allows to keep immutability of foods; allows updates if original changes)
 - extra (any other info)



actual_quantity  =  user_set_q * portion_size

actual_FPC  =  user_set_q * portion_size / 100g  =  actual_quantity / 100g

