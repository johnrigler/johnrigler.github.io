function menuFactory() {
  const menu = {
    items: {},           // id => item object
    order: [],           // array of ids in insertion order

    tools: {
      get(id) {
        return menu.items[id] || null;
      },

      has(id) {
        return id in menu.items;
      },

      keys() {
        return [...menu.order];  // ordered keys
      },

      entries() {
        return menu.order.map(id => [id, menu.items[id]]);
      },

      add(id, label, html = "") {
        if (typeof id !== "string" || !id) throw new Error("Invalid ID");
        if (menu.items[id]) throw new Error(`Menu item "${id}" already exists.`);
        menu.items[id] = { label, html, submenu: [] };
        menu.order.push(id);
      },

      addSubmenu(parentId, id, label, html = "") {
        const parent = menu.items[parentId];
        if (!parent) throw new Error(`Parent menu item "${parentId}" not found.`);
        if (!Array.isArray(parent.submenu)) parent.submenu = [];
        parent.submenu.push({ id, label, html });
      },

      remove(id) {
        delete menu.items[id];
        menu.order = menu.order.filter(existingId => existingId !== id);

        // Clean up submenus
        for (const key of menu.order) {
          const item = menu.items[key];
          if (Array.isArray(item.submenu)) {
            item.submenu = item.submenu.filter(sub => sub.id !== id);
          }
        }
      },

      serialize() {
        const ordered = menu.order.map(id => ({
          id,
          ...menu.items[id]
        }));
        return JSON.stringify(ordered, null, 2);
      }
    }
  };

  return menu;
}

