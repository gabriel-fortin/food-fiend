import { Ref, Food } from 'Model';

export interface DataItem {
    id: typeof Ref.prototype.id,
    name: typeof Food.prototype.name,
}
