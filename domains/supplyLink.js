const SupplySlot = require('./supplySlot');

class SupplyLink {
    constructor(resource){
        this.resource = resource;
        this.head = null;
        this.tail = null;
        this.current = null;

        this.addSlot = this.addSlot.bind(this);
        this.fillTo = this.fillTo.bind(this);
        this.fill = this.fill.bind(this);

        this.count = this.count.bind(this);
    }

    addSlot(slotProperty){
        let slot = new SupplySlot(slotProperty);
        if(!this.head){
            this.head = slot;
            this.tail = slot;
            return true;
        }else{
            let currentSlot = this.head;

            if(slot.cost < currentSlot.cost){
                slot.next = currentSlot;
                currentSlot.pre = slot;
                this.head = slot;
            }

            while(!slot.pre && !slot.next){
                if(slot.cost < currentSlot.cost){
                    slot.pre = currentSlot.pre;
                    slot.next = currentSlot;
                    currentSlot.pre.next = slot;
                    currentSlot.pre = slot;
                }else if(currentSlot.next){
                    currentSlot = currentSlot.next;
                }else{
                    //slot is the tail
                    slot.pre = currentSlot;
                    currentSlot.next = slot;
                    this.tail = slot;
                }
            } 
        }
    }

    fillTo(cost){
        let currentSlot = this.tail;
        while(currentSlot && currentSlot.cost >= cost){
            currentSlot.payload = currentSlot.slots;
            currentSlot = currentSlot.pre;
        }

        if(currentSlot){
            this.current = currentSlot.next;
        }else{
            this.current = this.head;
        }
    }

    fill(num){
        let currentSlot = this.current;
        while(currentSlot && num){
            let emptySlot = currentSlot.slots - currentSlot.payload;
            if(num >= emptySlot){
                num -= emptySlot;
                currentSlot.payload = currentSlot.slots;
                this.current = currentSlot;
                currentSlot = currentSlot.pre;
            }else{
                this.current = currentSlot;
                currentSlot.payload += num;
                num = 0;
            }
        }
    }

    count(){
        let total = 0;
        let currentSlot = this.current;
        while(currentSlot){
            total += currentSlot.payload;
            currentSlot = currentSlot.next;
        }
        return total;
    }
}

module.exports = SupplyLink;