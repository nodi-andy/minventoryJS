// item = {type: string, n: integer}
// pack = {type: string, n: integer, max: integer, isConst: false}
// inventory = {packs: [pack, ...], max: packSize}

// myInventory = Inventory.create(["gold", "stone", "energy", "gold", "gold", null, "stone"], 9);
// Inventory.add(myInventory, "stone", 10) // true
// Inventory.rem(myInventory, "stone", 3) // false

// myInventory = Inventory.create(["gold", "stone", "energy"], 3, true);
// Inventory.add(myInventory, "stone", 10) // true
// Inventory.rem(myInventory, "stone", 3) // false
class Inventory {

  static defPackSize = 10;
  static defInvSize = 10;

  constructor(types, max, isConst = false) {
    this.packs = types.map(type => ({
      type: type,
      n: 0,
      max: Inventory.defPackSize,
      isConst: isConst
    }));
    this.max = max || Inventory.defInvSize;
  }

  // sort out all packs which has different types except the empty ones
  // sort all empty or packs with same type: first the same types unspecific order, then all other packs
  // start filling the packs as ordered, if needed create new pack in the new empty pack slots
  // return null if done else return pack (with type and leftover number)

  addItem(type, n) {
    const sameTypePacks = this.packs.filter(pack => pack.type === type);
    const emptyPacks = this.packs.filter(pack => pack.type === null);

    const usablePacks = [...sameTypePacks, ...emptyPacks];

    let leftover = n;

    for (let pack of usablePacks) {
      if (leftover <= 0) break;
      const availableSpace = pack.max - pack.n;
      if (availableSpace > 0) {
        if (pack.type === null) {
          pack.type = type;
        }
        const amountToAdd = Math.min(leftover, availableSpace);
        pack.n += amountToAdd;
        leftover -= amountToAdd;
      }
    }

    if (leftover > 0 && this.packs.length < this.max) {
      this.packs.push({ type: type, n: leftover, max: Inventory.defPackSize });
      leftover = 0;
    }

    if (leftover > 0) {
      return { type, n: leftover, max: Inventory.defPackSize };
    }

    return null;
  }
  
  hasItem(type, n) {
    let count = 0;

    for (let pack of this.packs) {
      if (pack.type === type) {
        count += pack.n;
        if (count >= n) {
          return true;
        }
      }
    }

    return false;
  }

  remItem(type, n) {
    if (!this.hasItem(type, n)) {
      return false;
    }
  
    let remainingToRemove = n;
  
    for (let pack of this.packs) {
      if (pack.type === type) {
        if (pack.n >= remainingToRemove) {
          pack.n -= remainingToRemove;
          remainingToRemove = 0;
        } else {
          remainingToRemove -= pack.n;
          pack.n = 0;
        }
  
        if (pack.n === 0) {
          if (pack.isConst) {
            pack.n = 0;
          } else {
            pack.type = null;
          }
        }
  
        if (remainingToRemove === 0) {
          break;
        }
      }
    }
  
    return true;
  }
  
  get(type) {
    let total = 0;
    for (let pack of this.packs) {
      if (pack.type === type) {
        total += pack.n;
      }
    }
    return total;
  }

  toObject() {
    return {
      packs: this.packs.map(pack => ({ ...pack })),
      max: this.max
    };
  }

  static fromObject(obj) {
    const inventory = new Inventory([], obj.max);
    inventory.packs = obj.packs.map(pack => ({ ...pack }));
    return inventory;
  }
}