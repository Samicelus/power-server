class SupplySlot {
    constructor(property){
        this.cost = property.cost;
        this.slots = property.slots;
        this.payload = 0;
        this.next = null;
        this.pre = null;
    }
}

module.exports = SupplySlot;