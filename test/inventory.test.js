// test/inventory.test.js
import { expect } from 'chai';
import Inventory from '../inventory.js';

describe('Inventory', () => {

  describe('create', () => {
    it('should create an inventory with the specified slot size', () => {
      const inv = Inventory.create([], 5);
      expect(inv.packs).to.be.an('array').that.is.empty;
      expect(inv.max).to.equal(5);
    });
  });

  describe('addItem', function() {
    
    it('should add items to an existing pack of the same type', function() {
      let myInventory = Inventory.create(["gold", "stone", "energy"], 10);
      Inventory.addItem(myInventory, "gold", 5);
      expect(myInventory.packs[0].n).to.equal(5);
      expect(myInventory.packs[0].type).to.equal("gold");
    });

    it('should create a new pack if there is an empty slot', function() {
      let myInventory = Inventory.create(["gold", null, "energy"], 10);
      Inventory.addItem(myInventory, "stone", 5);
      expect(myInventory.packs[1].n).to.equal(5);
      expect(myInventory.packs[1].type).to.equal("stone");
    });

    it('should return a leftover pack if not all items fit and there are no empty slots', function() {
      let myInventory = Inventory.create(["gold", "stone", "energy"], 3);
      Inventory.addItem(myInventory, "stone", 15);
      expect(myInventory.packs[1].n).to.equal(10);
      const result = Inventory.addItem(myInventory, "stone", 5);
      expect(result).to.deep.equal({ type: "stone", n: 5, max: 10 });
    });

    it('should fill existing packs first before creating new packs', function() {
      let myInventory = Inventory.create(["gold", "stone", null, null], 10);
      Inventory.addItem(myInventory, "gold", 5);
      Inventory.addItem(myInventory, "gold", 8);
      expect(myInventory.packs[0].n).to.equal(10);
      expect(myInventory.packs[2].n).to.equal(3);
    });

    it('should handle inventory overflow when adding items beyond max inventory size', function() {
      let myInventory = Inventory.create(["gold", "stone"], 2);
      const result = Inventory.addItem(myInventory, "energy", 5);
      expect(result).to.deep.equal({ type: "energy", n: 5, max: 10 });
    });

    it('should return null if all items are added successfully', function() {
      let myInventory = Inventory.create(["gold", "stone", null], 3);
      const result = Inventory.addItem(myInventory, "energy", 7);
      expect(result).to.be.null;
      expect(myInventory.packs[2].n).to.equal(7);
      expect(myInventory.packs[2].type).to.equal("energy");
    });

    it('should handle multiple item additions correctly', function() {
      let myInventory = Inventory.create(["gold", "stone", null, null], 4);
      Inventory.addItem(myInventory, "gold", 5);
      Inventory.addItem(myInventory, "stone", 3);
      Inventory.addItem(myInventory, "gold", 4);
      expect(myInventory.packs[0].n).to.equal(9);
      expect(myInventory.packs[1].n).to.equal(3);
      expect(myInventory.packs[2].type).to.be.null;
    });
    
  });

  describe('remItem', function() {

    it('should remove items from a pack of the same type', function() {
      let myInventory = Inventory.create(["gold", "stone", "energy"], 10);
      Inventory.addItem(myInventory, "gold", 5);
      const result = Inventory.remItem(myInventory, "gold", 3);
      expect(result).to.be.true;
      expect(myInventory.packs[0].n).to.equal(2);
      expect(myInventory.packs[0].type).to.equal("gold");
    });

    it('should handle removal from multiple packs', function() {
      let myInventory = Inventory.create(["gold", "gold"], 10);
      Inventory.addItem(myInventory, "gold", 5);
      Inventory.addItem(myInventory, "gold", 7);
      const result = Inventory.remItem(myInventory, "gold", 10);
      expect(result).to.be.true;
      expect(myInventory.packs[0].n).to.equal(0);
      expect(myInventory.packs[1].n).to.equal(2);
      expect(myInventory.packs[0].type).to.be.null;  // First pack should be emptied
      expect(myInventory.packs[1].type).to.equal("gold");
    });

    it('should handle removal when pack isConst is true', function() {
      let myInventory = Inventory.create(["gold", "stone", "energy"], 10, true);
      Inventory.addItem(myInventory, "gold", 5);
      const result = Inventory.remItem(myInventory, "gold", 5);
      expect(result).to.be.true;
      expect(myInventory.packs[0].n).to.equal(0);  // Number should be set to 0
      expect(myInventory.packs[0].type).to.equal("gold");  // Type should remain the same
      expect(myInventory.packs[0].isConst).to.be.true;
    });

    it('should return false if not enough items are available', function() {
      let myInventory = Inventory.create(["gold", "stone"], 10);
      Inventory.addItem(myInventory, "gold", 5);
      const result = Inventory.remItem(myInventory, "gold", 10);
      expect(result).to.be.false;
      expect(myInventory.packs[0].n).to.equal(5);  // No items should be removed
    });

    it('should remove items from a mix of isConst and non-isConst packs', function() {
      let myInventory = Inventory.create(["gold", "gold", "gold"], 10);
      myInventory.packs[0].isConst = true;
      Inventory.addItem(myInventory, "gold", 7);
      Inventory.addItem(myInventory, "gold", 7);
      Inventory.addItem(myInventory, "gold", 9);
      
      const result = Inventory.remItem(myInventory, "gold", 21);
      expect(result).to.be.true;
      expect(myInventory.packs[0].n).to.equal(0);  // isConst pack should have n set to 0
      expect(myInventory.packs[1].n).to.equal(0);  // This slot should be set on null
      expect(myInventory.packs[2].n).to.equal(2);  // This slot should remain unchanged
      expect(myInventory.packs[0].type).to.equal("gold");  // Type should remain the same
      expect(myInventory.packs[1].type).to.equal(null);
      expect(myInventory.packs[2].type).to.equal("gold");
    });
    
    it('should empty and remove non-const packs', function() {
      let myInventory = Inventory.create(["gold", "gold"], 10);
      myInventory.packs[0].isConst = true;
      myInventory.packs[1].isConst = false;
      Inventory.addItem(myInventory, "gold", 8);
      
      const result = Inventory.remItem(myInventory, "gold", 8);
      expect(result).to.be.true;
      expect(myInventory.packs[0].n).to.equal(0);  // Const pack should be set to 0
      expect(myInventory.packs[0].type).to.equal("gold");  // Const pack should retain its type
    });
    
    

  });

  describe('Inventory.get', function() {
  
    it('should return the correct total number of items for multiple packs of the same type', function() {
      let inventory1 = Inventory.create(["gold", "gold", "gold"], 3);
      Inventory.addItem(inventory1, "gold", 25); // Adding 25 gold, should distribute across packs
      const result = Inventory.get(inventory1, "gold");
      expect(result).to.equal(25);
    });
  
    it('should return the correct count for mixed types', function() {
      let inventory2 = Inventory.create(["gold", "stone", "energy"], 3);
      Inventory.addItem(inventory2, "gold", 5);  // Adding 5 gold
      Inventory.addItem(inventory2, "stone", 8); // Adding 8 stone
      Inventory.addItem(inventory2, "energy", 3); // Adding 3 energy
  
      expect(Inventory.get(inventory2, "gold")).to.equal(5);
      expect(Inventory.get(inventory2, "stone")).to.equal(8);
      expect(Inventory.get(inventory2, "energy")).to.equal(3);
    });
  
    it('should return 0 for a type not present in the inventory', function() {
      let inventory3 = Inventory.create(["gold", "stone", "energy"], 3);
      Inventory.addItem(inventory3, "gold", 10);  // Adding 10 gold
      Inventory.addItem(inventory3, "stone", 5);  // Adding 5 stone
  
      expect(Inventory.get(inventory3, "energy")).to.equal(0); // No energy added yet
    });
  
    it('should handle an empty inventory correctly', function() {
      let inventory4 = Inventory.create([], 3);
  
      expect(Inventory.get(inventory4, "gold")).to.equal(0);
      expect(Inventory.get(inventory4, "stone")).to.equal(0);
    });
  
    it('should return 0 if the type has no items even if the pack exists', function() {
      let inventory5 = Inventory.create(["gold", "stone", "energy"], 3);
      Inventory.addItem(inventory5, "gold", 10); // Adding 10 gold
      Inventory.addItem(inventory5, "stone", 5); // Adding 5 stone
  
      expect(Inventory.get(inventory5, "energy")).to.equal(0); // Energy pack exists but has 0 items
    });
  
  });
});
