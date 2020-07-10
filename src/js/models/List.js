import uniqid from 'uniqid';
export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        // Check whether item already exists in items array, if it does, store index in variable
        const index = this.items.findIndex(el => el.ingredient === item.ingredient);

        // If there is an index, then item is already present, therefore just update item with new count value
        if (index !== -1) {
            const updatedItem = {
                id: this.items[index].id,
                count: this.items[index].count * 2
            }
            this.persistData();
            return updatedItem;

        // If item was not in array, push new item into array
        } else {
            this.items.push(item);
            this.persistData();
            return item;
        }
    };


    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        this.items.splice(index, 1);
        this.persistData();
    };


   deleteAllItems () {
      this.items.splice(0, this.items.length);
      this.persistData();
   };

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        this.persistData();
    }

    persistData() {
        localStorage.setItem('list', JSON.stringify(this.items));
    };




    readStorage() {
        // Get local storage and convert into object
        const storage = JSON.parse(localStorage.getItem('list'));

        // Restore items from the local storage by adding back to items array
        if (storage) this.items = storage;
    };
}
