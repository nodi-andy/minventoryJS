
# Inventory Management Library

This JavaScript library provides a simple and flexible way to manage an inventory system. It allows users to create inventories with different types of items, add and remove items, and handle constraints on packs within the inventory. This library is ideal for games or applications that require an inventory management system.

## Features

- **Create Inventory**: Initialize an inventory with specific item types, maximum capacity, and configurable pack constraints.
- **Add Items**: Add items to the inventory, filling available packs or creating new ones as needed.
- **Remove Items**: Remove items from the inventory, respecting constraints and pack availability.
- **Check Item Availability**: Verify if a certain quantity of an item is available in the inventory.
- **Get Item Count**: Retrieve the total count of a specific item type in the inventory.

## Installation

You can include this library in your project by copying the source code directly or by adding it as a module in your JavaScript/TypeScript project.

## Usage

### 1. Creating an Inventory

```javascript
import Inventory from './Inventory';

const myInventory = new Inventory(["gold", "stone", "energy"], 9);
```

This creates an inventory with 3 types of items (\`gold\`, \`stone\`, and \`energy\`), and a maximum capacity of 9 packs.

### 2. Adding Items

```javascript
const result = myInventory.addItem("stone", 10);
console.log(result); // Outputs null if all items are added, or the leftover pack if not
```

This adds 10 units of \`stone\` to the inventory. If there's leftover after filling all available packs, it will return a pack with the remaining quantity.

### 3. Removing Items

```javascript
const removed = myInventory.remItem("stone", 3);
console.log(removed); // Outputs true if items are successfully removed, false otherwise
```

This removes 3 units of \`stone\` from the inventory, respecting the pack constraints.

### 4. Checking Item Availability

```javascript
const hasEnoughStone = myInventory.hasItem("stone", 5);
console.log(hasEnoughStone); // Outputs true if at least 5 units of stone are available
```

This checks if there are at least 5 units of \`stone\` in the inventory.

### 5. Getting Item Count

```javascript
const totalGold = myInventory.get("gold");
console.log(totalGold); // Outputs the total number of gold units in the inventory
```

This retrieves the total number of \`gold\` units present in the inventory.

## API Reference

### \`new Inventory(types, max, isConst = false)\`

- \`types\`: An array of item types to initialize in the inventory.
- \`max\`: The maximum number of packs the inventory can hold.
- \`isConst\`: A boolean indicating if the packs should be constant (default: \`false\`).

### \`inventory.addItem(type, n)\`

- \`type\`: The type of item to add.
- \`n\`: The number of items to add.
- **Returns**: \`null\` if all items are added, or a pack with the remaining quantity if there are leftovers.

### \`inventory.remItem(type, n)\`

- \`type\`: The type of item to remove.
- \`n\`: The number of items to remove.
- **Returns**: \`true\` if the items were successfully removed, \`false\` otherwise.

### \`inventory.hasItem(type, n)\`

- \`type\`: The type of item to check.
- \`n\`: The number of items to check for availability.
- **Returns**: \`true\` if the inventory has at least \`n\` units of the item, \`false\` otherwise.

### \`inventory.get(type)\`

- \`type\`: The type of item to count.
- **Returns**: The total number of units of the specified item in the inventory.

### \`inventory.toObject()\`

- **Returns**: A simple object representation of the inventory, suitable for JSON serialization.

### \`Inventory.fromObject(obj)\`

- \`obj\`: A simple object representing an inventory.
- **Returns**: A new \`Inventory\` instance created from the provided object.

## License

This library is open-source and available under the MIT License. Feel free to use, modify, and distribute it as per the license terms.

## Contributing

Contributions are welcome! Please submit issues or pull requests for any enhancements, bug fixes, or new features.

## Contact

For any inquiries or feedback, please reach out at [your-email@example.com].
