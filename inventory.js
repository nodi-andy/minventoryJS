// item = integer
// pack = {type: string, n: integer, max: integer, isConst: false}
// inventory = {packs: [pack, ...], max: packSize}

// myInventory = Inventory.create(["gold", "stone", "energy", "gold", "gold", null, "stone"], 9);
// Inventory.add(myInventory, "stone", 10) // true
// Inventory.rem(myInventory, "stone", 3) // false

// myInventory = Inventory.create(["gold", "stone", "energy"], 3, true);
// Inventory.add(myInventory, "stone", 10) // true
// Inventory.rem(myInventory, "stone", 3) // false

export default class Inventory {

  static defPackSize = 10;
  static defInvSize = 10;

  static create (types, max, isConst = false) {
    const packs = types.map(type => ({
      type: type,
      n: 0,
      max: Inventory.defPackSize,
      isConst: isConst
    }));
    return {packs, max: max || this.defInvSize};
  }

  // sort out all packs which has different types except the empty ones
  // sort all empty or packs with same type: first the same types unspecific order, then all other packs
  // start filling the packs as ordered, if needed create new pack in the new empty pack slots
  // return null if done else return pack (with type and leftover number)

  static addItem(inv, type, n) {
    // Separate packs into different categories
    const sameTypePacks = inv.packs.filter(pack => pack.type === type);
    const emptyPacks = inv.packs.filter(pack => pack.type === null);

    // Combine sameTypePacks and emptyPacks (where new packs can be created)
    const usablePacks = [...sameTypePacks, ...emptyPacks];

    let leftover = n;

    // Try to fill the usable packs
    for (let pack of usablePacks) {
      if (leftover <= 0) break;
      const availableSpace = pack.max - pack.n;
      if (availableSpace > 0) {
        if (pack.type === null) {
          // Initialize the empty pack with the type
          pack.type = type;
        }
        const amountToAdd = Math.min(leftover, availableSpace);
        pack.n += amountToAdd;
        leftover -= amountToAdd;
      }
    }

    // If there's leftover, create a new pack if there's space
    if (leftover > 0 && inv.packs.length < inv.max) {
      inv.packs.push({ type: type, n: leftover, max: Inventory.defPackSize });
      leftover = 0;
    }

    // Return the remaining items if not all could be added
    if (leftover > 0) {
      return { type, n: leftover, max: Inventory.defPackSize };
    }

    return null;
  }
  
  // loop through packs and check if item (type,n) are available 
  static hasItem(inv, type, n) {
    let count = 0;

    for (let pack of inv.packs) {
      if (pack.type === type) {
        count += pack.n;
        if (count >= n) {
          return true;
        }
      }
    }

    return false;
  }

  // First check if items are available (hasItem) if yes, remove them from respective packs, if a pack is emtpy.
  // If a pack has isConst = true, do not remove the pack just set number of items on 0. 
  // If isConst false, remove the pack and set a null value.

  static remItem(inv, type, n) {
    if (!Inventory.hasItem(inv, type, n)) {
      return false;
    }
  
    let remainingToRemove = n;
  
    for (let pack of inv.packs) {
      if (pack.type === type) {
        if (pack.n >= remainingToRemove) {
          pack.n -= remainingToRemove;
          remainingToRemove = 0;
        } else {
          remainingToRemove -= pack.n;
          pack.n = 0;
        }
  
        // If the pack is empty, handle it based on isConst
        if (pack.n === 0) {
          if (pack.isConst) {
            // If isConst is true, just set n to 0 and keep the type
            pack.n = 0;
          } else {
            // If isConst is false, mark the pack as empty (null type)
            pack.type = null;
          }
        }
  
        // If all required items have been removed, stop
        if (remainingToRemove === 0) {
          break;
        }
      }
    }
  
    return true;
  }
  

  static get(inv, type) {
    let total = 0;
    for (let pack of inv.packs) {
      if (pack.type === type) {
        total += pack.n;
      }
    }
    return total;
  }
  
}
