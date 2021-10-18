import { SelectItemGroup } from 'primeng/api';
import { SelectItem } from 'primeng/api';

export class DropdownItemGroup implements SelectItemGroup {
  label = '';
  items: SelectItem[] = [];
}

export class DropdownSelectItem implements SelectItem {
  label = '';
  value: any = null;
}
